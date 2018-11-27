import fs from 'fs';
import relativePath from 'relative';
export function safeReadFileSync(path) {
  let content = '';

  try {
    content = fs.readFileSync(path, 'UTF8');
  } catch (ex) {
    console.log(`Could not find file: ${path}`);
  }

  return content;
}
export function getMatchedExportsName(str) {
  let match;
  let matchedName = new Set();
  const MATCH_EXPORTS_VARABLE_REGEX = /exports\.([0-9a-zA-Z_$]+)\s*=[^=]/g;

  while ((match = MATCH_EXPORTS_VARABLE_REGEX.exec(str)) !== null) {
    matchedName.add(match[1]);
  }

  return Array.from(matchedName);
}
export function relative(from, to) {
  const rp = relativePath(from, to).replace(/\.js$/, ''); // 如果在当前路径下，加上 `./`

  return !rp.startsWith('.') ? `./${rp}` : rp;
}
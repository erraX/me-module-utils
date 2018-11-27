"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safeReadFileSync = safeReadFileSync;
exports.getMatchedExportsName = getMatchedExportsName;
exports.relative = relative;

var _fs = _interopRequireDefault(require("fs"));

var _relative = _interopRequireDefault(require("relative"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function safeReadFileSync(path) {
  let content = '';

  try {
    content = _fs.default.readFileSync(path, 'UTF8');
  } catch (ex) {
    console.log(`Could not find file: ${path}`);
  }

  return content;
}

function getMatchedExportsName(str) {
  let match;
  let matchedName = new Set();
  const MATCH_EXPORTS_VARABLE_REGEX = /exports\.([0-9a-zA-Z_$]+)\s*=[^=]/g;

  while ((match = MATCH_EXPORTS_VARABLE_REGEX.exec(str)) !== null) {
    matchedName.add(match[1]);
  }

  return Array.from(matchedName);
}

function relative(from, to) {
  const rp = (0, _relative.default)(from, to).replace(/\.js$/, ''); // 如果在当前路径下，加上 `./`

  return !rp.startsWith('.') ? `./${rp}` : rp;
}
import {find, isNumber, isString} from 'lodash';
import fs from 'fs';
import relative from 'relative';

const NODE_ENV = process.env.NODE_ENV;

/**
 * 判断是否是me的模块
 *
 * @param {string} code 代码
 * @return {boolean}
 */
export function isMeModule(code) {
    if (!isString(code)) {
        return false;
    }

    return code.includes('me.provide') || code.includes('me.require');
}

/**
 * Transform:  app-module-name
 *         =>  app_module_name
 *
 * @param {string} name 变量名
 * @returns {string}
 */
export function normalizeVariableName(name) {
    if (!name) {
        return '';
    }
    name = isNumber(name) ? String(name) : name;

    if (!isString(name)) {
        throw new Error('Cannot normalize none String/Number type');
    }

    return name.replace(/-/g, '_').replace(/\./, '_');
}

/**
 * 读取文件
 *
 * @param {string} path 文件路径
 * @returns {string} 文件内容
 */
export function safeReadFileSync(path) {
    let content = '';
    try {
        content = fs.readFileSync(path, 'UTF8');
    }
    catch(ex) {
        if (NODE_ENV !== 'test') {
            console.log(`Could not find file: ${path}`);
        }
    }
    return content;
}

/**
 * 获取模块中所有export的变量名`
 *
 * @param {string} str js脚本内容
 * @returns {string[]}
 */
export function getMatchedExportsName(str) {
    const MATCH_EXPORTS_VARIABLE_REGEX = /exports\.([0-9a-zA-Z_$]+)\s*=[^=]/g;

    let match;
    let matchedName = new Set();
    while((match = MATCH_EXPORTS_VARIABLE_REGEX.exec(str)) !== null) {
        matchedName.add(match[1]);
    }

    return Array.from(matchedName);
}

/**
 * 计算 `require` 时，两个文件的相对路径
 *
 * @param {string} from 调用 `require` 的文件路径
 * @param {string} to 被 `require` 的文件路径
 * @returns {string}
 */
export function relativeRequirePath(from, to) {
    const rp = relative(from, to).replace(/\.js$/, '');

    // 如果在当前路径下，加上 `./`
    return !rp.startsWith('.') ? `./${rp}` : rp;
}

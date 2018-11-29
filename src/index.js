import env from './env';
import MeModules from './MeModules';
import * as utils from './utils';

/**
 * 初始化me模块管理
 *
 * @param {Object} options 配置
 * @param {string} options.basePath 前端脚本根路径
 * @returns {MeModules}
 */
export const initMeModules = options => {
    env(options);
    return new MeModules(options);
};

/**
 * 单例
 *
 * @type {MeModules}
 */
let instance = null;

/**
 * 缓存 `MeModules` 实例化的配置
 *
 * @type {Object}
 */
let cachedInitOptions = null;

/**
 * 获取单例
 *
 * @param {Object} options 配置
 * @param {string} options.basePath 前端脚本根路径
 * @return {MeModules}
 * @throws {Error}
 */
export const getMeModuleInstance = options => {
    if (instance) {
        return instance;
    }

    options = !options && cachedInitOptions
        ? cachedInitOptions
        : options;

    // 没有传参数进来，也没有缓存
    if (!options) {
        throw new Error('You should pass `options` to get `MeModule` instance');
    }

    cachedInitOptions = options;
    instance = initMeModules(options);
    return instance;
};

/**
 * 销毁单例
 *
 * @param {boolean} destroyInitedOptions 是否清除配置缓存
 */
export const destroyInstance = destroyInitedOptions => {
    instance = null;
    destroyInitedOptions && (cachedInitOptions = null);
};

// 一些工具函数
export const {
    getMatchedExportsName,
    relativeRequirePath
} = utils;

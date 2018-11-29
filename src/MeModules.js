import {join} from 'path';
import {cloneDeep, find, each, isString} from 'lodash';
import {
    isMeModule,
    normalizeVariableName,
    safeReadFileSync,
    getMatchedExportsName
} from './utils';

/**
 * MeModules
 *
 * @class
 */
export default class MeModules {

    /**
     * 构造函数
     *
     * @constructor
     * @param {Object} options 配置
     * @param {string} options.basePath 前端脚本根路径
     */
    constructor({basePath}) {
        this.basePath = basePath;
        this.modules = cloneDeep(global.me._modules);
        this.prepareModules(this.modules);
        this.digg(this.modules);
    }

    /**
     * 获取所有模块对象
     *
     * @returns {Object}
     */
    getModules() {
        return this.modules;
    }

    /**
     * 根据模块名获取某个模块
     *
     * @param {string} name 模块名
     * @returns {Object}
     */
    getModuleByName(name) {
        return this.modules[name];
    }

    /**
     * 获取某个模块
     *
     * @param {Object} options options
     * @param {string} options.src 文件路径
     * @param {string} options.name 模块名
     * @returns {Object}
     */
    get({src, name}) {
        return this.getModuleByName(name)
            || this.getModuleByAbsSrc(src);
    }

    /**
     * 删除某个模块
     */
    remove(name) {
        delete this.modules[name];
    }

    /**
     * 根据绝对路径获取某个模块
     *
     * @param {string} src 文件路径
     * @returns {Object}
     */
    getModuleByAbsSrc(src) {
        return find(this.modules, ({absolutePath}) => absolutePath === src);
    }

    prepareModules(modules) {
        const resolve = p => join(this.basePath, p);

        each(modules, (mod, name) => {
            const absolutePath = resolve(mod.src);
            const code = safeReadFileSync(absolutePath);

            if (!code) {
                delete modules[name];
                return;
            }

            mod.absolutePath = absolutePath;
            mod.code = code;
            mod.name = normalizeVariableName(name);
            mod.isMeModule = isMeModule(code);
            mod.require = mod.require || [];

            if (mod.src !== 'lib/me.js'
                && !~mod.require.indexOf('mejs')
                && mod.isMeModule) {
                mod.require.unshift('mejs');
            }
        });
    }

    /**
     * 分析依赖关系
     */
    digg(modules) {
        this.diggCss(modules);
        this.diggSelfExports(modules);
        this.diggDeps(modules);
    }

    /**
     * 分析每个模块的依赖关系
     */
    diggDeps(modules) {
        each(modules, mod => mod.deps = this.flattenModuleDeps(true, modules, mod));
    }

    /**
     * 分析每个模块自己export的变量
     */
    diggSelfExports(modules) {
        each(modules, mod => {
            mod.selfExports = getMatchedExportsName(mod.code);
        });
    }

    /**
     * 分析每个模块依赖的CSS
     */
    diggCss(modules) {
        const cssBasePath = this.basePath.replace('scripts', 'styles');
        const resolve = p => join(cssBasePath, p);

        each(modules, mod => {
            let css = mod.css || (mod.css = []);
            css = Array.isArray(css) ? css : [css];
            mod.css = css
                .map(src => isString(src) ? resolve(src) : null)
                .filter(Boolean);
        });
    }

    /**
     * 扁平化模块依赖
     *
     * @param {boolean} isRoot 是不是需要分析的根模块
     * @param {Object} modules 所有模块
     * @param {Object} mod 模块
     * @param {Object} deps 输出的依赖
     * @return {Object}
     */
    flattenModuleDeps(isRoot, modules, mod, deps = {}) {
        if (!mod || deps.hasOwnProperty(mod.name)) {
            return deps;
        }

        if (!isRoot) {
            deps[mod.name] = [].slice.call(mod.selfExports);
        }

        (mod.require || [])
            .forEach(dep => this.flattenModuleDeps(false, modules, modules[dep], deps));

        return deps;
    }
}

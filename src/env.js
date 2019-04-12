import {join} from 'path';
import browserEnv from 'browser-env';
import {createEmptyMe} from './meFactory';

/**
 * Mock browser environment
 *
 * @param {Object} options 配置
 * @param {string} options.basePath 前端脚本根路径
 * @returns {restorePolyfill}
 */
export default function env({basePath}) {
    const resolve = p => join(basePath, p);

    // 初始化之前，重置 `me.js` 状态
    // 主要是重置 `me._modules`, 保存了上一次解析的模块依赖关系
    global.me = createEmptyMe();

    // 删除缓存，重新加载me loader
    delete require.cache[resolve('lib/me.js')];
    delete require.cache[resolve('lib/me.ext.js')];
    delete require.cache[resolve('lib/require.js')];
    delete require.cache[resolve('lib/merge_require.js')];
    delete require.cache[resolve('app/app.js')];

    // Polyfill browser env
    browserEnv();

    // `me.js` 加载过程中，`<header>` 中需要一个 `<script>` 标签
    const script = document.createElement('script');
    script.setAttribute('version', '1.0');
    document.head.appendChild(script);

    const restorePolyfill = backupMePolyfill();

    // 加载 `me.js`
    require(resolve('lib/me.js'));
    require(resolve('lib/me.ext.js'));
    require(resolve('lib/require.js'));
    require(resolve('lib/merge_require.js'));
    require(resolve('app/app.js'));

    restorePolyfill();
}

/**
 * Backup `me.js` polyfill
 *
 * @returns {restorePolyfill}
 */
function backupMePolyfill() {
    const bind = Function.prototype.bind;
    return function restorePolyfill () {
        Function.prototype.bind = bind;
    };
}

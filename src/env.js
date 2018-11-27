import {join} from 'path';
import me from './me';
import browserEnv from 'browser-env';

/**
 * Mock browser environment
 *
 * @param options {Object}
 * @param options.basePath
 * @returns {restorePolyfill}
 */
export default function env({basePath}) {
    resetEnv();
    meJsEnv();

    const restore = backupMePolyfill();

    // 加载 `me.js`
    require(join(basePath, 'lib/me.js'));
    require(join(basePath, 'lib/me.ext.js'));
    require(join(basePath, 'lib/require.js'));
    require(join(basePath, 'app/app.js'));

    return restore;
}

function meJsEnv() {
    browserEnv();

    const script = document.createElement('script');
    script.setAttribute('version', '1.0');
    document.head.appendChild(script);
}

/**
 * 重置环境，主要是重置 `global.me`
 */
function resetEnv() {
    global.me = {...me};

    delete require.cache[join(basePath, 'lib/me.js')];
    delete require.cache[join(basePath, 'lib/me.ext.js')];
    delete require.cache[join(basePath, 'lib/require.js')];
    delete require.cache[join(basePath, 'app/app.js')];
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

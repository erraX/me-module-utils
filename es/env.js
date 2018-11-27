function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { join } from 'path';
import me from './me';
import browserEnv from 'browser-env';

function polyfill() {
  const bind = Function.prototype.bind;
  return function () {
    Function.prototype.bind = bind;
  };
}

export default function env({
  basePath
}) {
  global.me = _objectSpread({}, me); // Mock一下浏览器环境

  browserEnv();
  const script = document.createElement('script');
  script.setAttribute('version', '1.0');
  document.head.appendChild(script);
  var back = polyfill(); // 初始化 `me.js`

  require(join(basePath, 'lib/me.js'));

  require(join(basePath, 'lib/me.ext.js'));

  require(join(basePath, 'lib/require.js'));

  require(join(basePath, 'app/app.js'));

  return back;
}
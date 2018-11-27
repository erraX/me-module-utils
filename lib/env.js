"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = env;

var _path = require("path");

var _me = _interopRequireDefault(require("./me"));

var _browserEnv = _interopRequireDefault(require("browser-env"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function polyfill() {
  const bind = Function.prototype.bind;
  return function () {
    Function.prototype.bind = bind;
  };
}

function env({
  basePath
}) {
  global.me = _objectSpread({}, _me.default); // Mock一下浏览器环境

  (0, _browserEnv.default)();
  const script = document.createElement('script');
  script.setAttribute('version', '1.0');
  document.head.appendChild(script);
  var back = polyfill(); // 初始化 `me.js`

  require((0, _path.join)(basePath, 'lib/me.js'));

  require((0, _path.join)(basePath, 'lib/me.ext.js'));

  require((0, _path.join)(basePath, 'lib/require.js'));

  require((0, _path.join)(basePath, 'app/app.js'));

  return back;
}
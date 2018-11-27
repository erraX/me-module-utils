"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMeModules = exports.relative = exports.getMatchedExportsName = void 0;

var _env = _interopRequireDefault(require("./env"));

var _MeModules = _interopRequireDefault(require("./MeModules"));

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  getMatchedExportsName,
  relative
} = _utils.default;
exports.relative = relative;
exports.getMatchedExportsName = getMatchedExportsName;

const initMeModules = options => {
  const back = (0, _env.default)(options);
  const modules = new _MeModules.default(options);
  back();
  return modules;
};

exports.initMeModules = initMeModules;
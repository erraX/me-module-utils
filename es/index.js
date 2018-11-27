import env from './env';
import MeModules from './MeModules';
import {* as utils} from './utils';

// Exports utils
export const {getMatchedExportsName, relative} = utils;

// Exports me modules initializer
export const initMeModules = options => {
  const back = env(options);
  const modules = new MeModules(options);
  back();
  return modules;
};

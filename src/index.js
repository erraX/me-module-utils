import env from './env';
import MeModules from './MeModules';
import utils from './utils';

export const {
    getMatchedExportsName,
    relative
} = utils;

export const initMeModules = options => {
    const back = env(options);
    const modules = new MeModules(options);
    back();
    return modules;
};

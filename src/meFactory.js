import {cloneDeep} from 'lodash';

/**
 * 默认 `me` 对象
 *
 * @const {Object}
 */
export const DEFAULT_ME_PROEPRTY = {
    _modules: {}
};

/**
 * 返回一个默认 `me` 对象
 *
 * @returns {Object}
 */
export const createEmptyMe = () => cloneDeep(DEFAULT_ME_PROEPRTY);

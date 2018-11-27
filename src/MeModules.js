import {join} from 'path';
import {safeReadFileSync, getMatchedExportsName} from './utils';

function validateName(name) {
    return name.replace(/-/g, '_').replace(/\./, '_');
}

export default class MeModules {
    constructor({basePath}) {
        this.basePath = basePath;
        this.modules = global.me._modules;
        this.digg();
        console.log(this.modules);
    }

    add(name, mod) {
        this.modules[name] = mod;
    }

    remove(name) {
        delete this.modules[name];
    }

    getModules() {
        return this.modules;
    }

    getModule({src, name}) {
        if (name) {
            return this.modules[name];
        }
        if (src) {
            return this.getModuleByAbsSrc(src);
        }
        return null;
    }

    getModuleByAbsSrc(src) {
        let matchedMod;
        this.each(mod => {
            if (mod.absolutePath === src) {
                matchedMod = mod;
                return true;
            }
        });
        return matchedMod;
    }

    digg() {
        this.diggCss();
        this.diggSelfExports();
        this.diggDeps();
    }

    diggDeps() {
        this.each((mod, name) => {
            mod.deps = this.flattenModuleDeps('', mod);
            delete mod.deps[name];
        });
    }

    diggSelfExports() {
        const diggFn = (mod, name) => {
            const absolutePath = this.resolve(mod.src);
            const code = safeReadFileSync(absolutePath);

            // 模块虽然定义了，但是文件不存在
            if (!code) {
                this.remove(name);
                return;
            }

            mod.isMeModule = code.indexOf('me.provide') > -1 || code.indexOf('me.require') > -1;
            mod.name = validateName(name);
            mod.code = code;
            mod.absolutePath = absolutePath;
            mod.selfExports = getMatchedExportsName(code);
        };

        this.each(diggFn);
    }

    diggCss() {
        this.each((mod, name) => {
            let css = mod.css || (mod.css = []);
            const basePath = this.basePath.replace('scripts', 'styles');

            if (!Array.isArray(css)) {
                css = [css];
            }

            mod.css = css.map(src => join(basePath, src));
        });
    }

    flattenModuleDeps(name, mod, deps = {}) {
        if (!mod) {
            return;
        }

        if (name && deps.hasOwnProperty(name)) {
            return;
        }

        if (name) {
            const selfExports = mod.selfExports;
            deps[name] = [].slice.call(selfExports);
        }

        if (!mod.require) {
            mod.require = [];
        }

        const req = mod.require;

        if (mod.src !== 'lib/me.js'
            && req.indexOf('mejs') === -1
            && mod.isMeModule) {
            req.push('mejs');
        }

        if (req && req.length) {
            req.forEach(name => this.flattenModuleDeps(name, this.modules[name], deps));
        }

        return deps;
    }

    each(iter) {
        const modules = this.modules;
        return Object
            .keys(modules)
            .some(name => iter(modules[name], name));
    }

    resolve(path) {
        return join(this.basePath, path);
    }
}

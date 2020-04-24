import ejs from 'ejs';
import IPackage from './IPackage';
import stringifyObject from 'stringify-object';
import IPlugin, {PluginConfig} from './IPlugin';
import IGenerator, {GeneratorConfig} from './IGenerator';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const jsStringify = (o, inline = false, indentSize = 4) => stringifyObject(o, {indent: ''.padEnd(indentSize), singleQuotes: true, inlineCharacterLimit: 'number' !== typeof inline ? undefined : inline});
const indent = (t, offset = 4) => (t || '').split(/\n/g).map(x => `${x ? ''.padEnd(offset) : ''}${x}`).join("\n");
const render = (string, vars = {}, options = {}) => ejs.render(string, {indent, jsStringify, ...vars}, options);
const renderFile = ({templatePath}) => (path, vars = {}) => {
    const filename = `${templatePath}/${path}`;
    return render(fs.readFileSync(filename, 'utf8'), vars, {filename});
};
const copy = (source, target) => {
    fse.copySync(source, target);
    return true;
};
const writeFile = (target, content) => {
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.writeFileSync(target, content);
    return true;
};

export class Generator implements IGenerator {
    public readonly plugins: IPlugin[] = [];
    public readonly packagers: {[key: string]: (config: any) => IPackage} = {};
    public readonly packages: {[key: string]: any} = {};
    public readonly vars: {[key: string]: any} = {};
    public readonly defaultPackagerName: string = 'js_lambda';
    public readonly rootDir: string
    protected readonly packageEventHooks = {};
    constructor({rootDir, plugins = [], packages = {}, vars = {}}: GeneratorConfig) {
        this.rootDir = rootDir;
        this.vars = {
            generator: 'microgen',
            license: 'MIT',
            date: new Date().toISOString(),
            rootDir: this.rootDir,
            ...vars,
        };
        this.packages = packages;
        const localPlugin = `${rootDir}/.microgen`;
        try {
            const localPluginPath = fs.realpathSync(localPlugin);
            if (localPluginPath) plugins.push('./.microgen');
        } catch (e) {
            // nothing to do, local plugin does not exist.
        }
        this.loadPlugins(plugins);
    }
    protected loadPlugins(plugins: any[]): void {
        plugins.forEach(p => {
            if ('string' === typeof p) p = {name: p};
            if ((p.name.slice(0, 1) === '@') &&  (-1 === p.name.indexOf('/')))
                p.name = `@ohoareau/microgen-plugin-${p.name.slice(1)}`;
            this.registerPluginFromConfig(p)
        });
    }
    getRootDir(): string {
        return this.rootDir;
    }
    getVars(): {[key: string]: any} {
        return this.vars;
    }
    setVar(key: string, value: any) {
        this.vars[key] = value;
    }
    registerPackager(type: string|string[], packager: (config: any) => IPackage) {
        (Array.isArray(type) ? type : [type]).forEach(t => {
            const tt = t.replace(/-/g, '_');
            this.packagers[t] = packager;
            if (tt !== t) {
                this.packagers[tt] = packager;
            }
        });
    }
    registerPackageEventHook(packageType: string, eventType: string, hook: Function): void {
        if (!this.packageEventHooks[packageType]) this.packageEventHooks[packageType] = {};
        if (!this.packageEventHooks[packageType][eventType]) this.packageEventHooks[packageType][eventType] = [];
        this.packageEventHooks[packageType][eventType].push(hook);
    }
    async describePackages(): Promise<any[]> {
        return (await this.prepare()).map((p: any) => {
            return {
                name: p.getName ? p.getName() : p.name,
                type: p.getPackageType ? p.getPackageType() : p.packageType,
            };
        });
    }
    protected applyPackageEventHooks(p: IPackage, eventType: string, data: any = {}): void {
        let hooks = <Function[]>[];
        const packageType = p.getName ? p.getName() : (p['name'] ? p['name'] : undefined);
        if (!packageType) return;
        if (this.packageEventHooks[packageType]) {
            if (this.packageEventHooks[packageType][eventType])
                hooks = hooks.concat(this.packageEventHooks[packageType][eventType]);
            if (this.packageEventHooks[packageType]['*'])
                hooks = hooks.concat(this.packageEventHooks[packageType]['*']);
        }
        if (this.packageEventHooks['*']) {
            if (this.packageEventHooks['*'][eventType])
                hooks = hooks.concat(this.packageEventHooks['*'][eventType]);
            if (this.packageEventHooks['*']['*'])
                hooks = hooks.concat(this.packageEventHooks['*'][eventType]);
        }
        const ctx = {data};
        hooks.forEach(h => h(p, eventType, ctx));
    }
    registerPlugin(plugin: IPlugin) {
        plugin.register(this);
        this.plugins.push(plugin);
    }
    registerPluginFromConfig(plugin: string|PluginConfig) {
        this.registerPlugin(this.createPluginFromConfig('string' === typeof plugin ? {name: plugin} : plugin));
    }
    createPluginFromConfig(plugin: PluginConfig): IPlugin {
        let path = plugin.path || plugin.name;
        if ('.' === path.slice(0, 1)) {
            path = fs.realpathSync(`${this.rootDir}/${path}`);
        }
        const r = require(path);
        const pluginClass = r.default || r;

        return new pluginClass({...(plugin.config || {}), loadedFrom: path});
    }
    private async prepare(): Promise<IPackage[]> {
        return Object.entries(this.packages).map(
            ([name, {type, ...c}]: [string, any]) => {
                if (!type) throw new Error(`No type specified for package '${name}'`);
                if (!this.packagers[type]) throw new Error(`Unsupported package type '${type}'`);
                const p = this.packagers[type]({...c, packageType: type, name, vars: {...this.vars, ...(c.vars || {})}});
                this.applyPackageEventHooks(p, 'created');
                return p;
            }
        );
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const packages = await this.prepare();
        const {write = false, targetDir} = vars;
        const result = (await Promise.all(packages.map(async p => {
            const n = (<any>p).getName ? (<any>p).getName() : p['name'];
            this.applyPackageEventHooks(p, 'before_generate');
            const generateResult = await p.generate(vars);
            this.applyPackageEventHooks(p, 'after_generate', generateResult);
            return [n, generateResult];
        })))
            .reduce(
                (acc, [p, f]) =>
                    Object.entries(f).reduce((acc2, [k, v]) => {
                        acc2[`${p}/${k}`] = [p, v];
                        return acc2;
                    }, acc)
                ,
                {}
            )
        ;
        const entries = Object.entries(result);
        entries.sort(([k1], [k2]) => k1 < k2 ? -1 : (k1 === k2 ? 0 : 1));
        entries.forEach(([k, x]) => {
            const [p, v] = <any>x;
            const filePath = `${targetDir}/${k}`;
            if (!this.vars || !this.vars.locked || !this.vars.locked[k]) {
                result[k] = (<any>v)(this.createPackageHelpers(p, vars));
                if (write && (true !== result[k])) writeFile(filePath, result[k]);
            }
        });
        return result;
    }
    createPackageHelpers(name, vars) {
        return {
            render,
            renderFile,
            jsStringify,
            copy: (source, target) => copy(source, `${vars.targetDir}/${name}/${target}`),
        };
    }
}

export default Generator
import IPackage from './IPackage';

export type BasePackageConfig = {
    name: string,
    sources?: string[],
    files?: {[key: string]: any},
    vars?: {[key: string]: any},
}

const fs = require('fs');

export abstract class AbstractPackage<C extends BasePackageConfig = BasePackageConfig> implements IPackage {
    public readonly name: string;
    public readonly sources: string[];
    public readonly vars: {[key: string]: any};
    public readonly files: {[key: string]: any};
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(config: C) {
        this.name = config.name;
        this.sources = config.sources || [];
        this.files = config.files || {};
        this.vars = config.vars || {};
    }
    public getName(): string {
        return this.name;
    }
    protected getTemplateRoot(): string {
        return '_no-template-root_';
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFiles(vars: any, cfg: any): any {
        return {};
    }
    protected buildVars(vars: any): any {
        return {deployable: false, name: this.name, ...this.vars, ...vars};
    }
    // noinspection JSUnusedLocalSymbols
    protected buildSources(vars: any, cfg: any): any[] {
        return [];
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const pluginCfg = {templatePath: this.getTemplateRoot()};
        vars = this.buildVars(vars);
        const files = this.buildFiles(vars, pluginCfg);
        Object.assign(files, (Object.entries(this.files).reduce((acc, [k, v]) => {
            acc[k] = 'string' === typeof v ? (() => v) : (({renderFile}) => renderFile(pluginCfg)((v as any).template, v));
            return acc;
        }, {})));
        if (vars.write) {
            if (!vars.targetDir) throw new Error('No target directory specified');
            const root = vars.configFileDir;
            await Promise.all(this.buildSources(vars, pluginCfg).map(async dir => {
                if (!fs.existsSync(`${root}/${dir}`)) return [];
                return Promise.all(fs.readdirSync(`${root}/${dir}`, {}).map(async f => {
                    f = `${f}`;
                    if ('.' === f || '..' === f) return;
                    files[f] = ({copy}) => copy(`${root}/${dir}/${f}`, f);
                }));
            }));
        }
        return files;
    }
}

// noinspection JSUnusedGlobalSymbols
export default AbstractPackage
import IPackage from './IPackage';
import StaticFileTemplate from './StaticFileTemplate';
import {populateData} from "./utils";
import {requireTechnologies} from '@ohoareau/technologies';

export type BasePackageConfig = {
    name: string,
    packageType: string,
    sources?: string[],
    files?: {[key: string]: any},
    vars?: {[key: string]: any},
}

const fs = require('fs');

export abstract class AbstractPackage<C extends BasePackageConfig = BasePackageConfig> implements IPackage {
    public readonly packageType: string;
    public readonly name: string;
    public readonly sources: string[];
    public readonly vars: {[key: string]: any};
    public readonly files: {[key: string]: any};
    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    constructor(config: C) {
        this.name = config.name;
        this.packageType = config.packageType;
        this.sources = config.sources || [];
        this.files = config.files || {};
        this.vars = config.vars || {};
    }
    public getPackageType(): string {
        return this.packageType;
    }
    public getName(): string {
        return this.name;
    }
    protected getTemplateRoot(): string {
        return '_no-template-root_';
    }
    protected async buildFiles(vars: any, cfg: any): Promise<any> {
        const files = Object.entries(await this.buildFilesFromTemplates(vars, cfg)).reduce((acc, [k, v]) => {
            acc[k] = ({renderFile}) => renderFile(cfg)(true === v ? `${k}.ejs` : v, vars);
            return acc;
        }, {});
        return Object.assign(files, await this.buildDynamicFiles(vars, cfg));
    }
    // noinspection JSUnusedLocalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {};
    }
    // noinspection JSUnusedLocalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {};
    }
    protected getTechnologies(): any {
        return [];
    }
    protected getPreRequisites(): any {
        return {};
    }
    protected getInstallProcedures(): any {
        return {};
    }
    protected getDefaultCommonVars(): any {
        return {
            deployable: false,
            name: this.name,
            version: '1.0.0',
            description: 'Package',
            dependencies: {},
        }
    }
    protected buildDefaultAutomaticVars(vars: any): any {
        return {
            author_email: vars.author_email || ((vars.author && 'object' === typeof vars.author) ? vars.author.email : 'Confidential'),
            author_name: vars.author_name || ((vars.author && 'object' === typeof vars.author) ? vars.author.name : (vars.author || 'Confidential')),
            author_full: vars.author_full || ((vars.author && 'object' === typeof vars.author) ? `${vars.author.name} <${vars.author.email}>` : (vars.author || 'Confidential')),
        };
    }
    protected buildVars(vars: any): any {
        const vv = Object.assign({}, this.getDefaultCommonVars(), vars);
        Object.assign(vv, this.buildDefaultAutomaticVars(vv));
        Object.assign(vv, this.buildDefaultVars(vv));
        Object.assign(vv, this.vars);
        return Object.assign(vv, vars);
    }
    // noinspection JSUnusedLocalSymbols
    protected buildDefaultVars(vars: any): any {
        return {};
    }
    // noinspection JSUnusedLocalSymbols
    protected buildSources(vars: any, cfg: any): any[] {
        return [];
    }
    async describe(): Promise<any> {
        return {
            ...requireTechnologies(this.getTechnologies().filter(x => !!x)),
        };
    }
    async hydrate(data: any): Promise<void> {
        populateData(this.vars, data);
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const pluginCfg = {templatePath: this.getTemplateRoot()};
        vars = this.buildVars(vars);
        const files = await this.buildFiles(vars, pluginCfg);
        Object.assign(files, (Object.entries(this.files).reduce((acc, [k, v]) => {
            acc[k] = 'string' === typeof v ? (() => v) : (('function' === typeof v) ? v : (({renderFile}) => renderFile(pluginCfg)((v as any).template, v)));
            return acc;
        }, {})));
        if (vars.write) {
            if (!vars.targetDir) throw new Error('No target directory specified');
            const root = vars.rootDir;
            await Promise.all(this.buildSources(vars, pluginCfg).map(async dir => {
                if (!fs.existsSync(`${root}/${dir}`)) return [];
                return Promise.all(fs.readdirSync(`${root}/${dir}`, {}).map(async f => {
                    f = `${f}`;
                    if ('.' === f || '..' === f) return;
                    files[f] = new StaticFileTemplate(`${root}/${dir}/${f}`, f);
                }));
            }));
        }
        return files;
    }
}

// noinspection JSUnusedGlobalSymbols
export default AbstractPackage
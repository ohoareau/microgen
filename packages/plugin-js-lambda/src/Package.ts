import Handler, {HandlerConfig} from './Handler';
import Microservice, {MicroserviceConfig} from './Microservice';
import {AbstractPackage, BasePackageConfig} from '@ohoareau/microgen';

export type PackageConfig = BasePackageConfig & {
    events?: {[key: string]: any[]},
    externalEvents?: {[key: string]: any[]},
    handlers?: {[key: string]: HandlerConfig},
    microservices?: {[key: string]: MicroserviceConfig},
};

export default class Package extends AbstractPackage<PackageConfig> {
    public readonly microservices: {[key: string]: Microservice} = {};
    public readonly handlers: {[key: string]: Handler} = {};
    public readonly events: {[key: string]: any[]} = {};
    public readonly externalEvents: {[key: string]: any[]} = {};
    constructor(config: PackageConfig) {
        super(config);
        const {events = {}, externalEvents = {}, handlers = {}, microservices = {}} = config;
        this.events = events || {};
        this.externalEvents = externalEvents || {};
        Object.entries(microservices).forEach(
            ([name, c]: [string, any]) => {
                this.microservices[name] = new Microservice(this, {name, ...c});
            }
        );
        const opNames = Object.entries(this.microservices).reduce((acc, [n, m]) =>
                Object.entries(m.types).reduce((acc2, [n2, t]) =>
                        Object.keys(t.operations).reduce((acc3, n3) => {
                            acc3.push(`${n}_${n2}_${n3}`);
                            return acc3;
                        }, acc2)
                    , acc)
            , <string[]>[]);
        Object.keys(handlers).reduce((acc, h) => {
            acc.push(h);
            return acc;
        }, opNames);
        opNames.sort();
        Object.entries(handlers).forEach(
            ([name, c]: [string, any]) =>
                this.handlers[name] = new Handler({name, ...c, directory: name === 'handler' ? undefined : 'handlers', vars: {...(c.vars || {}), operations: opNames, operationDirectory: name === 'handler' ? 'handlers' : undefined}})
        );
    }
    registerEventListener(event, listener) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(listener);
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    registerExternalEventListener(event, listener) {
        this.externalEvents[event] = this.externalEvents[event] || [];
        this.externalEvents[event].push(listener);
        return this;
    }
    getEventListeners(event) {
        return this.events[event] || [];
    }
    // noinspection JSUnusedGlobalSymbols
    getExternalEventListeners(event) {
        return this.externalEvents[event] || [];
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    protected buildVars(vars: any): any {
        const staticVars = require('../vars.json');
        vars = {...staticVars, ...super.buildVars(vars)};
        vars.author_email = vars.author ? vars.author.email : 'Confidential';
        vars.author = vars.author ? `${vars.author.name} <${vars.author.email}>` : 'Confidential';
        vars.scripts = {
            ...staticVars.scripts,
            ...(vars.deployable ? {deploy: 'deploy-package'} : {}),
            ...(vars.scripts || {}),
        };
        vars.dependencies = {
            ...staticVars.dependencies,
            ...(vars.dependencies || {}),
        };
        vars.devDependencies = {
            ...staticVars.devDependencies,
            ...(vars.devDependencies || {}),
        };
        return vars;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['LICENSE.md']: true,
            ['README.md']: true,
            ['.gitignore']: true,
            ['Makefile']: true,
            ['package-excludes.lst']: true,
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        const files = (await Promise.all(Object.values(this.handlers).map(async h => h.generate(vars)))).reduce((acc, f) => ({...acc, ...f}), {
            ['package.json']: () => JSON.stringify({
                name: vars.name,
                license: vars.license,
                dependencies: vars.dependencies,
                scripts: vars.scripts,
                devDependencies: vars.devDependencies,
                version: vars.version,
                description: vars.description,
                author: vars.author,
                private: true,
            }, null, 4),
        });
        const objects: any = (<any[]>[]).concat(
            Object.values(this.microservices),
            Object.values(this.handlers)
        );
        <Promise<any>>(await Promise.all(objects.map(async o => (<any>o).generate(vars)))).reduce(
            (acc, r) => Object.assign(acc, r),
            files
        );
        if (this.events && !!Object.keys(this.events).length) {
            files['models/events.js'] = ({jsStringify}) => `module.exports = ${jsStringify(this.events, 100)};`
        }
        if (this.externalEvents && !!Object.keys(this.externalEvents).length) {
            files['models/externalEvents.js'] = ({jsStringify}) => `module.exports = ${jsStringify(this.externalEvents, 100)};`
        }

        return files;
    }
}
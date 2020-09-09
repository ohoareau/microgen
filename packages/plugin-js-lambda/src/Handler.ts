import TestFile, {TestFileConfig} from './TestFile';
import stringifyObject from 'stringify-object';

export type HandlerConfig = {
    name: string,
    type: string,
    middlewares?: string[],
    errorMiddlewares?: string[],
    params: {[key: string]: any},
    test?: TestFileConfig,
    vars: {[key: string]: any},
    directory: string,
    custom?: boolean,
};

export default class Handler {
    public readonly name: string;
    public readonly type: string;
    public readonly middlewares: string[];
    public readonly errorMiddlewares: string[];
    public readonly params: {[key: string]: any};
    public readonly vars: {[key: string]: any};
    public readonly test: TestFile|undefined;
    public readonly directory: string;
    public readonly custom: boolean;
    constructor({name, type, middlewares = [], errorMiddlewares = [], params = {}, directory, custom = false, vars = {}, test = undefined}: HandlerConfig) {
        this.name = name;
        this.type = type;
        this.params = {o: name, ...params};
        this.middlewares = middlewares;
        this.errorMiddlewares = errorMiddlewares;
        this.vars = vars;
        this.directory = directory;
        this.custom = !!custom;
        this.test = this.enrichTest(test);
    }
    enrichTest(test: TestFileConfig|undefined): TestFile|undefined {
        const pushGroupTest = (a, b, c) => {
            a[b] = a[b] || {};
            a[b].tests = a[b].tests || [];
            a[b].tests.push(c);
        };

        const addedGroups: {[key: string]: any} = {};
        if (0 <= this.middlewares.indexOf('@warmup')) {
            pushGroupTest(addedGroups, 'warmup', {name: 'warmup call', type: 'handler-call', config: {event: {warm: true}, expected: {status: 'success', code: 1000, message: 'warmed'}}});
        }
        if ((0 <= this.middlewares.indexOf('@apigateway') || ('apigateway' === this.type)) && (!this.vars.errors)) {
            pushGroupTest(addedGroups, 'apigateway', {name: 'malformed event', type: 'handler-call', config: {event: {}, expectedBody: JSON.stringify({errorType: 'not-found', message: 'Resource Not Found', code: 404, data: {}, errorInfo: {}})}});
        }
        if ((0 <= this.middlewares.indexOf('@apigateway') || ('apigateway' === this.type)) && (true === this.vars.healthz)) {
            pushGroupTest(addedGroups, 'apigateway', {name: 'healthz', type: 'handler-call', config: {event: {httpMethod: 'GET', resource: '/healthz'}, expectedBody: JSON.stringify({status: 'ok', code: 1001, message: 'healthy'})}});
        }
        if (('graphql' === this.type)) {
            pushGroupTest(addedGroups, 'graphql', {name: 'ui', type: 'handler-call', config: {event: {httpMethod: 'GET', resource: '/graphql', headers: {'Accept': 'text/html'}}, expectedStatusCode: 200}});
        }
        if (!!Object.keys(addedGroups).length) {
            if (!test) test = <{[key: string]: any}>{};
            test.groups = <any>Object.entries(addedGroups).reduce((acc, [k, v]: [string, any[]]) => {
                if (!acc[k]) acc[k] = {};
                acc[k] = {...acc[k], ...v, tests: (acc[k].tests || [].concat((<any>v).tests || []))};
                return acc;
            }, test.groups || <any>{});
        }
        return !!test ? new TestFile(test) : undefined;
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const cfg = {templatePath: `${__dirname}/../templates`};
        if (this.custom) return {};
        const fnName = vars.fnName || `fn`;
        const offsetDir = this.directory ? this.directory.split('/').map(() => '..').join('/') : '.';
        const globalCfg: any = {hasMiddlewares: false, hasErrorMiddlewares: false, middlewares: [], errorMiddlewares: []};
        const pre_init = ({cnf: needCnf = undefined, middlewares = [], errorMiddlewares = [], config = {}, middlewaresConfigs = {}, errorMiddlewaresConfigs = {}} = {}) => {
            globalCfg.middlewares = [...middlewares, ...this.middlewares];
            globalCfg.errorMiddlewares = [...this.errorMiddlewares, ...errorMiddlewares];
            globalCfg.hasMiddlewares = !!globalCfg.middlewares.length;
            globalCfg.hasErrorMiddlewares = !!globalCfg.errorMiddlewares.length;
            const cnf = {...this.params, ...config};
            const cfrms = {};
            const cfems = {};
            needCnf = ((true === needCnf) || globalCfg.hasMiddlewares || globalCfg.hasErrorMiddlewares) as any;
            const x = [
                needCnf && `const cnf = ${stringifyObject(cnf, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true})};`,
                ...globalCfg.middlewares.map((m, i) => {
                    if (middlewaresConfigs[m] && Object.keys(middlewaresConfigs[m]).length) {
                        cfrms[m] = middlewaresConfigs[m];
                        return `const rc${i + 1} = ${this.prepareMiddlewareCf(m, middlewaresConfigs)};`
                    }
                    return undefined;
                }),
                ...globalCfg.errorMiddlewares.map((m, i) => {
                    if (errorMiddlewaresConfigs[m] && Object.keys(errorMiddlewaresConfigs[m]).length) {
                        cfems[m] = errorMiddlewaresConfigs[m];
                        return `const ec${i + 1} = ${this.prepareMiddlewareCf(m, errorMiddlewaresConfigs)};`
                    }
                    return undefined;
                }),
                ...globalCfg.middlewares.map((m, i) => {
                    if ('@' === m.substr(0, 1)) {
                        return `const rm${i + 1} = require('@ohoareau/microlib/lib/middlewares/${m.substr(1)}').default(${cfrms[m] ? `rc${i + 1}` : 'cnf'});`
                    } else if (':' === m.substr(0, 1)) {
                        return undefined;
                    }
                    return `const rm${i + 1} = require('${offsetDir}/middlewares/${m}')(${cfrms[m] ? `rc${i + 1}` : 'cnf'});`
                }),
                ...globalCfg.errorMiddlewares.map((m, i) => {
                    if ('@' === m.substr(0, 1)) {
                        return `const em${i + 1} = require('@ohoareau/microlib/lib/error-middlewares/${m.substr(1)}').default(${cfems[m] ? `ec${i + 1}` : 'cnf'});`
                    } else if (':' === m.substr(0, 1)) {
                        return undefined;
                    }
                    return `const em${i + 1} = require('${offsetDir}/error-middlewares/${m}')(${cfems[m] ? `ec${i + 1}` : 'cnf'});`
                }),
            ].filter(x => !!x).join("\n");
            return x ? `${x}\n` : '';
        };
        const options = {};
        !!this.vars.paramsKey && (options['params'] = true);
        !!this.vars.rootDir && (options['rootDir'] = ('string' === typeof options['rootDir']) ? options['rootDir'] : `\`\${__dirname}${offsetDir !== '.' ? `/${offsetDir}` : ''}\``);
        const config = !!Object.keys(options).length ? `, ${this.stringifyForOptions(options)}` : '';
        const post_init = ({fn = true} = {}) => [
            `module.exports = {handler: require('@ohoareau/microlib').default(${globalCfg.hasMiddlewares ? `[${globalCfg.middlewares.map((m, i) => ':' === m.slice(0, 1) ? m.slice(1) : `rm${i + 1}`).join(', ')}]` : ((globalCfg.hasErrorMiddlewares || fn || config) ? '[]' : '')}${globalCfg.hasErrorMiddlewares ? `, [${globalCfg.errorMiddlewares.map((m, i) => ':' === m.slice(0, 1) ? m.slice(1) : `em${i + 1}`).join(', ')}]` : ((fn || config) ? ', []' : '')}${fn ? `, ${fnName}` : (config ? ', () => {}' : '')}${config})};`,
        ].join("\n");
        vars = {
            ...this.vars,
            ...this.params,
            pre_init,
            post_init,
            fnName,
            ...vars,
            directory: this.directory,
        };
        const files = {
            [`${this.directory ? `${this.directory}/` : ''}${this.name}.js`]: ({renderFile}) => renderFile(cfg)(`handlers/${this.type}.js.ejs`, vars),
        };
        if (this.test) {
            files[`__tests__/${this.directory ? `${this.directory}/` : ''}${this.name}.test.js`] = ({renderFile}) => renderFile(cfg)(`tests/handler.test.js.ejs`, {...vars, test: this.test});
        }
        return files;
    }
    stringifyForOptions(o) {
        return stringifyObject(o, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true, transform: (obj, prop, originalResult) => {
            if (/^'`[^`]+`'$/.test(originalResult)) {
                return originalResult.substr(1, originalResult.length - 2);
            }
            return originalResult;
        }});
    }
    prepareMiddlewareCf(n, ms): string {
        if (!ms || !ms[n]) return 'cnf';
        if (!Object.keys(ms[n]).length) return 'cnf';
        return `{...cnf, ...${stringifyObject(ms[n], {indent: '', inlineCharacterLimit: 100, singleQuotes: true})}}`;
    }
}
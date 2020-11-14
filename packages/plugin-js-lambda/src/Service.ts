import ServiceMethod from './ServiceMethod';
import TestFile, {TestFileConfig} from './TestFile';

export type ServiceConfig = {
    name: string,
    methods?: {[key: string]: any},
    variables?: {[key: string]: any},
    vars?: {[key: string]: any},
    test?: TestFileConfig,
    rootDir?: string,
};

export default class Service {
    public readonly name: string;
    public readonly methods: {[key: string]: ServiceMethod} = {};
    public readonly variables: {[key: string]: any} = {};
    public readonly test: TestFile|undefined;
    public readonly vars: {[key: string]: any};
    constructor({rootDir, name, methods = {}, variables = {}, test = undefined, vars = {}}: ServiceConfig) {
        this.name = name;
        Object.entries(methods).forEach(
            ([name, c]: [string, any]) =>
                this.methods[name] = new ServiceMethod({
                    rootDir,
                    service: this,
                    name,
                    ...c,
                    vars: {...(c.vars || {}), ...vars},
                })
        );
        Object.entries(variables).forEach(
            ([name, c]: [string, any]) =>
                this.variables[name] = {
                    name,
                    code: c.code,
                }
        );
        this.test = this.enrichTest(test);
        this.vars = vars;
    }
    enrichTest(test: TestFileConfig|undefined): TestFile|undefined {
        return !!test ? new TestFile(test) : undefined;
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        const cfg = {templatePath: `${__dirname}/../templates`};
        vars = {...vars, directory: `services${this.vars.directory ? `/${this.vars.directory}` : ''}`, name: this.name};
        const methods = Object.values(this.methods);
        methods.sort((a, b) => a.name < b.name ? -1 : (a.name === b.name ? 0 : 1));
        const variables = Object.values(this.variables);
        variables.sort((a, b) => a.name < b.name ? -1 : (a.name === b.name ? 0 : 1));
        const files = {
            [`services/${this.name}.js`]: ({renderFile}) => renderFile(cfg)('service.js.ejs', {...this.vars, ...vars, variables, methods}),
        };
        if (this.test && this.test.hasTests()) {
            files[`__tests__/services/${this.name}.test.js`] = ({renderFile}) => renderFile(cfg)('tests/service.test.js.ejs', {...this.vars, ...vars, test: this.test});
        }
        return files;
    }
}
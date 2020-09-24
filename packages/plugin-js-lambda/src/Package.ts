import Handler, {HandlerConfig} from './Handler';
import Starter, {StarterConfig} from './Starter';
import Microservice, {MicroserviceConfig} from './Microservice';
import {AbstractPackage, BasePackageConfig} from '@ohoareau/microgen';
import {
    GitIgnoreTemplate,
    LicenseTemplate,
    MakefileTemplate,
    ReadmeTemplate,
    PackageExcludesTemplate,
    TerraformToVarsTemplate
} from "@ohoareau/microgen-templates";
import {StartableBehaviour, BuildableBehaviour, CleanableBehaviour, InstallableBehaviour, GenerateEnvLocalableBehaviour, TestableBehaviour} from '@ohoareau/microgen-behaviours';

export type PackageConfig = BasePackageConfig & {
    events?: {[key: string]: any[]},
    externalEvents?: {[key: string]: any[]},
    handlers?: {[key: string]: HandlerConfig},
    starters?: {[key: string]: StarterConfig},
    microservices?: {[key: string]: MicroserviceConfig},
};

export default class Package extends AbstractPackage<PackageConfig> {
    public readonly microservices: {[key: string]: Microservice} = {};
    public readonly handlers: {[key: string]: Handler} = {};
    public readonly starters: {[key: string]: Starter} = {};
    public readonly events: {[key: string]: any[]} = {};
    public readonly externalEvents: {[key: string]: any[]} = {};
    constructor(config: PackageConfig) {
        super(config);
        const {events = {}, externalEvents = {}, handlers = {}, starters = {}, microservices = {}} = config;
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
            ([name, c]: [string, any]) => {
                this.handlers[name] = new Handler({name, ...c, directory: name === 'handler' ? undefined : 'handlers', vars: {...(c.vars || {}), operations: opNames, operationDirectory: name === 'handler' ? 'handlers' : undefined}});
                if (!!c.starter) {
                    this.starters[name] = new Starter({name, ...c, directory: name === 'handler' ? undefined : 'starters', vars: {...(c.vars || {}), operations: opNames, operationDirectory: name === 'handler' ? 'handlers' : '../handlers'}});
                }
            }
        );
        Object.entries(starters).forEach(
            ([name, c]: [string, any]) =>
                this.starters[name] = new Starter({name, ...c, directory: name === 'starter' ? undefined : 'starters', vars: {...(c.vars || {}), operations: opNames, operationDirectory: name === 'starter' ? 'handlers' : undefined}})
        );
        if (!this.hasStarters()) {
            this.features['startable'] = false;
        }
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
    hasStarters(): boolean {
        return 0 < Object.keys(this.starters).length;
    }
    protected getBehaviours() {
        return [
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new TestableBehaviour(),
            new StartableBehaviour(),
        ];
    }
    protected getDefaultExtraOptions(): any {
        return {
            phase: 'pre',
        };
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    protected buildVars(vars: any): any {
        const staticVars = require('../vars.json');
        vars = {...staticVars, ...super.buildVars(vars)};
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
            ...(this.hasStarters() ? {nodemon: '^2.0.4'} : {}),
        };
        return vars;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        const files = (await Promise.all([...Object.values(this.handlers), ...Object.values(this.starters)].map(async h => h.generate(vars)))).reduce((acc, f) => ({...acc, ...f}), {
            ['package.json']: () => JSON.stringify({
                name: vars.name,
                license: vars.license,
                dependencies: vars.dependencies,
                scripts: vars.scripts,
                devDependencies: vars.devDependencies,
                version: vars.version,
                description: vars.description,
                author: (vars.author && ('object' === typeof vars.author)) ? vars.author : {name: vars.author_name, email: vars.author_email},
                private: true,
            }, null, 4),
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['package-excludes.lst']: this.buildPackageExcludes(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
        });
        const objects: any = (<any[]>[]).concat(
            Object.values(this.microservices),
            Object.values(this.handlers),
            Object.values(this.starters)
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
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars);
    }
    protected buildPackageExcludes(vars: any): PackageExcludesTemplate {
        return new PackageExcludesTemplate(vars);
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addIgnore('/coverage/')
            .addIgnore('/node_modules/')
            .addIgnore('/.idea/')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const t = new MakefileTemplate({makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('env', 'dev')
            .setDefaultTarget('install')
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build')
            .addPredefinedTarget('generate-env-local', 'generate-env-local')
            .addMetaTarget('clean', ['clean-modules', 'clean-coverage'])
            .addPredefinedTarget('clean-modules', 'clean-node-modules')
            .addPredefinedTarget('clean-coverage', 'clean-coverage')
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: true})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true})
        ;
        let index = 0;
        if (this.hasStarters()) {
            if (1 < Object.entries(this.starters).length) {
                const startTargetNames: string[] = [];
                const startNames: string[] = [];
                Object.entries(this.starters).forEach(([n, v]) => {
                    const scriptName = `${v.directory ? v.directory : ''}${v.directory ? '/' : ''}${v.name}.js`;
                    t.addPredefinedTarget(`start-${n}`, 'nodemon', {script: scriptName, port: this.computePort(this.getParameter('startPort', 4000), index)});
                    startTargetNames.push(`start-${n}`);
                    startNames.push(n);
                    index++;
                });
                t.addTarget('start', [`npx concurrently -n ${startNames.join(',')} ${startTargetNames.map(n => `"make ${n}"`).join(' ')}`])
            } else {
                const [, v] = Object.entries(this.starters)[0];
                const scriptName = `${v.directory ? v.directory : ''}${v.directory ? '/' : ''}${v.name}.js`;
                t.addPredefinedTarget('start', 'nodemon', {script: scriptName, port: this.computePort(this.getParameter('startPort', 4000), index)});
                index++;
            }
        }
        vars.deployable && t.addPredefinedTarget('deploy', 'yarn-deploy');
        return t;
    }
    protected computePort(a, b) {
        return a + b;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
    protected getTechnologies(): any {
        return [
            'microlib',
            'make',
            'aws_cli',
            'aws_lambda',
            'node',
            'es6',
            'yarn',
            'nvm',
            'npm',
            'markdown',
            'git',
            'jest',
            'prettier',
            'json',
            this.vars.publish_image && 'docker',
            this.hasStarters() && 'nodemon',
        ];
    }
}
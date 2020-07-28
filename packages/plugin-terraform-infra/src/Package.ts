import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, LicenseTemplate, MakefileTemplate, ReadmeTemplate} from "@ohoareau/microgen-templates";

export type environment = {
    name: string,
};

export type layer = {
    name: string,
    type: string,
};

export type model = {
    config?: any,
    environments: environment[],
    layers: layer[],
};

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            project_prefix: 'mycompany',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        const model = this.buildModel(vars, cfg);
        return {
            ...this.buildConfigFileIfNeeded(model, vars, cfg),
            ...this.buildEnvironmentsFiles(model, vars, cfg),
            ...this.buildLayersFiles(model, vars, cfg),
            ...this.buildModulesFiles(model, vars, cfg),
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars)
            .addNamedFragmentsFromTemplateDir(
                `${__dirname}/../templates/readme`,
                [
                    'introduction',
                    'directory-structure',
                    'useful-commands',
                ]
            )
        ;
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addIgnore('*.log')
            .addIgnore('.env*')
            .addIgnore('.DS_Store')
            .addIgnore('.idea/')
            .addIgnore('.terraform/')
            .addIgnore('*.tfplan')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        return new MakefileTemplate(vars.makefile || {})
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('layer', '"all"')
            .addGlobalVar('layers', '$(shell AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) list-layers)')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addTarget('all')
            .addTarget('pre-install')
            .addPredefinedTarget('apply', 'tflayer-apply')
            .addPredefinedTarget('destroy', 'tflayer-destroy')
            .addPredefinedTarget('get', 'tflayer-get')
            .addPredefinedTarget('init', 'tflayer-init')
            .addPredefinedTarget('init-full', 'tflayer-init-full')
            .addPredefinedTarget('init-full-upgrade', 'tflayer-init-full-upgrade')
            .addPredefinedTarget('init-upgrade', 'tflayer-init-upgrade')
            .addPredefinedTarget('list-layers', 'tflayer-list-layers')
            .addPredefinedTarget('plan', 'tflayer-plan')
            .addPredefinedTarget('refresh', 'tflayer-refresh')
            .addPredefinedTarget('sync', 'tflayer-sync')
            .addPredefinedTarget('sync-full', 'tflayer-sync-full')
            .addPredefinedTarget('update', 'tflayer-update')
            .addPredefinedTarget('generate', 'tfgen')
            .addPredefinedTarget('output', 'tflayer-output')
            .addPredefinedTarget('output-json', 'tflayer-output-json')
            .addPredefinedTarget('outputs', 'outputs')
            .addMetaTarget('provision', ['init', 'sync'])
            .addMetaTarget('provision-full', ['init-full', 'sync-full'])
        ;
    }
    protected buildEnvironmentsFiles(model: model, vars: any, cfg: any): {[name: string]: any} {
        if (!this.hasVarsCategoryFeature(vars, 'infra', 'environments')) return {
            ['environments/.gitkeep']: () => '',
        };
        return model.environments.reduce((acc, e) =>
            Object.assign(acc, this.buildEnvironmentFiles(e, model, vars, cfg))
        , {});
    }
    protected buildLayersFiles(model: model, vars: any, cfg: any): {[name: string]: any} {
        if (!this.hasVarsCategoryFeature(vars, 'infra', 'layers')) return {
            ['layers/.gitkeep']: () => '',
        };
        return model.layers.reduce((acc, l) =>
            Object.assign(acc, this.buildLayerFiles(l, model, vars, cfg))
        , {});
    }
    protected buildModulesFiles(model: model, vars: any, cfg: any): {[name: string]: any} {
        if (!this.hasVarsCategoryFeature(vars, 'infra', 'modules')) return {
            ['modules/.gitkeep']: () => '',
        };
        return model.layers.reduce((acc, l) =>
            Object.assign(acc, this.buildModuleFilesFromLayer(l, model, vars, cfg))
        , {});
    }
    protected buildEnvironmentFiles(environment: environment, model: model, vars: any, cfg: any): any {
        if (!this.hasVarsCategoryFeature(vars, 'infra', `environment_${environment.name}`, true)) {
            return {}
        }
        return {};
    }
    protected buildLayerFiles(layer: layer, model: model, vars: any, cfg: any): any {
        if (!this.hasVarsCategoryFeature(vars, 'infra', `layer_${layer.name}`, true)) {
            return {}
        }
        return {
            [`layers/${layer.name}.tmpl.tf`]: `// ${layer.name}`,
        };
    }
    protected buildModuleFilesFromLayer(layer: layer, model: model, vars: any, cfg: any): any {
        if (!this.hasVarsCategoryFeature(vars, 'infra', `module_${layer.name}`, true)) {
            return {}
        }
        return {
            [`modules/${layer.name}/main.tf`]: ({renderFile}) => renderFile(cfg)(`modules/${layer.type}/main.tf.ejs`, vars),
            [`modules/${layer.name}/outputs.tf`]: ({renderFile}) => renderFile(cfg)(`modules/${layer.type}/outputs.tf.ejs`, vars),
            [`modules/${layer.name}/variables.tf`]: ({renderFile}) => renderFile(cfg)(`modules/${layer.type}/variables.tf.ejs`, vars),
        };
    }
    protected buildConfigFileIfNeeded(model: model, vars: any, cfg: any): {[name: string]: any} {
        return model.config ? {
            ['config.json']: JSON.stringify(model.config, null, 4),
        } : {};
    }
    protected buildModel(vars: any, cfg: any): model {
        const config = {
            common: {},
            layers: {},
            environments: {},
        };
        if (vars.common) {
            config.common = vars.common || {};
        }
        if (vars.environments) {
            config.environments = Object.entries(vars.environments).reduce((acc, [k, v]) => Object.assign(acc, {[k]: (<any>v).vars || {}}), {});
        }
        if (vars.layers) {
            config.layers = Object.entries(vars.layers).reduce((acc, [k, v]) => Object.assign(acc, {[k]: v || {}}), {});
        }
        return {
            environments: Object.entries(vars.environments || {}).reduce((acc, [k, v]) => [...acc, {name: k, ...<any>v}], <environment[]>[]),
            layers: Object.entries(vars.layers || {}).reduce((acc, [k, v]) => [...acc, {name: k, type: k, ...<any>v}], <layer[]>[]),
            config: (0 < Object.keys(config.environments).length) ? config : undefined,
        };
    }
    protected getTechnologies(): any {
        return [
            'make',
            'aws_cli',
            'markdown',
            'git',
            'jest',
            'prettier',
            'json',
            'terraform',
            'terraform_cloud',
            'tfenv',
        ];
    }
}
import {AbstractPackage} from '@ohoareau/microgen';
import {MakefileTemplate} from "@ohoareau/microgen-templates-core";

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
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['LICENSE.md']: true,
            ['README.md']: true,
            ['.gitignore']: true,
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        return {
            ['environments/.gitkeep']: () => '',
            ['layers/.gitkeep']: () => '',
            ['modules/.gitkeep']: () => '',
            ['Makefile']: this.buildMakefile(vars),
        };
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
}
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
            project_name: 'myproject',
            projects: [],
            scm: 'git',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['LICENSE.md']: true,
            ['.gitignore']: true,
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        return {
            ['Makefile']: this.buildMakefile(vars),
        };
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const scm = vars.scm || 'git';
        const t = new MakefileTemplate(vars.makefile || {})
            .addGlobalVar('env', 'dev')
            .addGlobalVar('b', 'develop')
            .addPredefinedTarget('generate', 'yarn-microgen')
            .addPredefinedTarget('install-root', 'yarn-install')
            .addPredefinedTarget('install-terraform', 'tfenv-install')
            .addMetaTarget('pre-install-root', ['install-root'])
            .addMetaTarget('deploy', vars.projects.filter(p => !!p.deployable).map(p => `deploy-${p.name}`))
            .addMetaTarget('build', ['build-pre-provision', 'build-post-provision'])
            .addMetaTarget('build-pre-plan', vars.projects.filter(p => 'pre' === p.phase).map(p => `build-${p.name}`))
            .addMetaTarget('build-pre-provision', ['build-pre-plan'])
            .addMetaTarget('build-post-provision', vars.projects.filter(p => 'pre' !== p.phase).map(p => `build-${p.name}`))
            .addMetaTarget('test', vars.projects.map(p => `test-${p.name}`))
            .addSubTarget('provision', 'infra', 'provision', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('provision-full', 'infra', 'provision-full', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('infra-init', 'infra', 'init', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('infra-plan', 'infra', 'plan', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('infra-refresh', 'infra', 'refresh', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('infra-update', 'infra', 'update', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('list-layers', 'infra', 'list-layers', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('infra-init-full', 'infra', 'init-full', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('infra-init-full-upgrade', 'infra', 'init-full-upgrade', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('infra-destroy', 'infra', 'destroy', {env: '$(env)', layer: '$(layer)'}, ['generate-terraform'])
            .addSubTarget('output', 'infra', 'output', {env: '$(env)', layer: '$(layer)'}, ['generate-terraform'])
            .addSubTarget('output-json', 'infra', 'output-json', {env: '$(env)', layer: '$(layer)'}, ['generate-terraform'])
            .addSubTarget('outputs', 'infra', 'outputs', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('infra-init-upgrade', 'infra', 'init-upgrade', {env: '$(env)'}, ['generate-terraform'])
            .addSubTarget('generate-terraform', 'infra', 'generate')
            .addMetaTarget('generate-env-local', vars.projects.map(p => `generate-env-local-${p.name}`))
            .addMetaTarget('pre-install', ['pre-install-root', ...vars.projects.map(p => `pre-install-${p.name}`)])
            .addMetaTarget('install', ['install-root', ...vars.projects.map(p => `install-${p.name}`)])
            .addMetaTarget('start', vars.projects.filter(p => !!p.startable).map(p => `start-${p.name}`))
            .setDefaultTarget('install')
        ;
        vars.projects.forEach(p => {
            t
                .addSubTarget(`pre-install-${p.name}`, p.name, 'pre-install')
                .addSubTarget(`install-${p.name}`, p.name, 'install')
                .addSubTarget(`test-${p.name}`, p.name, 'test')
                .addSubTarget(`generate-env-local-${p.name}`, p.name, 'generate-env-local', {env: '$(env)'})
                .addSubTarget(`build-${p.name}`, p.name, 'build', {env: '$(env)'}, [`generate-env-local-${p.name}`])
            ;
            !!p.deployable && t.addSubTarget(`deploy-${p.name}`, p.name, 'deploy', {env: '$(env)'}, [`generate-env-local-${p.name}`], {sourceEnvLocal: true});
            !!p.refreshable && t.addSubTarget(`refresh-${p.name}`, 'infra', 'provision', {env: '$(env)', layer: p.name}, ['generate-terraform', `build-${p.name}`]);
            !!p.startable && t.addSubTarget(`start-${p.name}`, p.name, 'start', {env: '$(env)'});
        });
        ('github' === scm) && t.addTarget('pr', ['hub pull-request -b $(b)']);
        return t;
    }
}
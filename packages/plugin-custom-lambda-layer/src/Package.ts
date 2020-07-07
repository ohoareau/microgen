import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, MakefileTemplate} from "@ohoareau/microgen-templates-core";

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['LICENSE']: true,
            ['README.md']: true,
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
        }
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addIgnore('/.idea/')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const t = new MakefileTemplate(vars.makefile || {})
            .addGlobalVar('env', 'dev')
            .setDefaultTarget('install')
            .addTarget('pre-install')
            .addTarget('install-test')
            .addTarget('test')
            .addTarget('test-cov')
            .addTarget('test-ci')
            .addShellTarget('install', './bin/install')
            .addShellTarget('clean', './bin/clean')
            .addShellTarget('build', './bin/build', ['clean'])
        ;
        vars.deployable && t.addTarget('deploy');
        return t;
    }
}
import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, MakefileTemplate, ReadmeTemplate, LicenseTemplate} from "@ohoareau/microgen-templates-core";

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
        }
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars);
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
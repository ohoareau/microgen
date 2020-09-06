import {AbstractPackage} from '@ohoareau/microgen';
import {
    GitIgnoreTemplate,
    MakefileTemplate,
    ReadmeTemplate,
    LicenseTemplate,
    TerraformToVarsTemplate
} from "@ohoareau/microgen-templates";
import {BuildableBehaviour, CleanableBehaviour, InstallableBehaviour} from "@ohoareau/microgen-behaviours";

export default class Package extends AbstractPackage {
    protected getBehaviours() {
        return [
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
        ]
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    protected getDefaultExtraOptions(): any {
        return {
            phase: 'pre',
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
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
        const t = new MakefileTemplate({makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('env', 'dev')
            .addShellTarget('build', './bin/build', ['clean'])
            .addShellTarget('clean', './bin/clean')
            .addShellTarget('install', './bin/install')
            .setDefaultTarget('install')
        ;
        vars.deployable && t.addTarget('deploy');
        return t;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
}
import {AbstractPackage} from '@ohoareau/microgen';
import {
    GitIgnoreTemplate,
    LicenseTemplate,
    ReadmeTemplate,
    TerraformToVarsTemplate, MakefileTemplate
} from "@ohoareau/microgen-templates";
import {
    BuildableBehaviour,
    DeployableBehaviour,
    GenerateEnvLocalableBehaviour,
    InstallableBehaviour, TestableBehaviour
} from "@ohoareau/microgen-behaviours";

export default class Package extends AbstractPackage {
    protected getBehaviours() {
        return [
            new BuildableBehaviour(),
            new InstallableBehaviour(),
            new DeployableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new TestableBehaviour(),
        ]
    }
    protected getDefaultExtraOptions(): any {
        return {
            phase: 'pre',
        };
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            description: 'JS Docker image',
        };
    }
    protected buildStaticFiles(vars: any, cfg: any): any {
        return {
            ['code/.gitkeep']: '',
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars);
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {});
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        return new MakefileTemplate({makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addGlobalVar('AWS_DEFAULT_REGION', '$(REPOSITORY_REGION)')
            .addGlobalVar('ecr_url', '$(REPOSITORY_URL_PREFIX)')
            .addGlobalVar('image_name', '$(env)-$(shell basename `pwd`)')
            .addGlobalVar('image_tag', '$(image_name):latest')
            .addPredefinedTarget('install-code', 'yarn-install-prod', {dir: 'code'})
            .addPredefinedTarget('build-code', 'yarn-build', {dir: 'code'})
            .addPredefinedTarget('build-image', 'docker-build', {awsEcrLogin: true, tag: '$(image_tag)', path: vars.image_dir || '.', buildArgs: vars.image_buildArgs || {}})
            .addMetaTarget('build', ['build-code', 'build-image'])
            .addMetaTarget('install', ['install-code'])
            .addPredefinedTarget('tag', 'docker-tag', {awsEcrLogin: true, tag: '$(image_tag)', remoteTag: '$(ecr_url)/$(image_tag)'})
            .addPredefinedTarget('push', 'docker-push', {awsEcrLogin: true, tag: '$(ecr_url)/$(image_tag)'})
            .setDefaultTarget('install')
            .addMetaTarget('deploy', ['tag', 'push'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local')
        ;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
}
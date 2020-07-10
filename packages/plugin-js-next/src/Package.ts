import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, LicenseTemplate, MakefileTemplate, ReadmeTemplate} from "@ohoareau/microgen-templates-core";

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            project_prefix: 'mycompany',
            project_name: 'myproject',
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
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
        return new ReadmeTemplate(vars);
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addComment('See https://help.github.com/articles/ignoring-files/ for more about ignoring files.')
            .addGroup('dependencies', [
                '/node_modules', '/.pnp', '.pnp.js',
            ])
            .addGroup('testing', [
                '/coverage',
            ])
            .addGroup('next.js', [
                '/.next/',
                '/out/',
            ])
            .addGroup('production', [
                '/build',
            ])
            .addGroup('misc', [
                '.DS_Store',
            ])
            .addGroup('debug', [
                'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*',
            ])
            .addGroup('local env files', [
                '.env.local', '.env.development.local', '.env.test.local', '.env.production.local', '*.pem',
            ])
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        return new MakefileTemplate(vars.makefile || {})
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-${vars.name}`)
            .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_${vars.name.toUpperCase()})`)
            .setDefaultTarget('install')
            .addTarget('pre-install')
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build')
            .addPredefinedTarget('validate', 'yarn-lint')
            .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'public/'})
            .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
            .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'NEXT'})
            .addPredefinedTarget('start', 'yarn-start')
            .addPredefinedTarget('serve', 'yarn-serve')
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true, coverage: false})
        ;
    }
}
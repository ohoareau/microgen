import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, LicenseTemplate, MakefileTemplate, ReadmeTemplate, CodeOfConductTemplate, ContributingTemplate, NvmRcTemplate} from "@ohoareau/microgen-templates";

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            project_prefix: 'mycompany',
            project_name: 'myproject',
            project_git_url: '<your-git-url-here>',
            node_version: '14.4.0',
            project_copyright: 'Copyright (c) 2020 Mycompany',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        const files = {
            ['jest.config.js']: true,
            ['lerna.json']: true,
            ['tsconfig.json']: true,
            ['tslint.json']: true,
        }
        vars.generator_package && Object.assign(files, {
            ['packages/generator-package/__tests__/index.spec.ts']: true,
            ['packages/generator-package/src/index.ts']: true,
            ['packages/generator-package/templates/__tests__/index.spec.tsx']: true,
            ['packages/generator-package/templates/_tpls/index.stories.tsx']: true,
            ['packages/generator-package/templates/_tpls/MainComponent.tsx']: true,
            ['packages/generator-package/templates/src/index.ts']: true,
            ['packages/generator-package/templates/LICENSE.md']: true,
            ['packages/generator-package/templates/package.json.remove_ext']: true,
            ['packages/generator-package/templates/README.md']: true,
            ['packages/generator-package/templates/tsconfig.json']: true,
            ['packages/generator-package/LICENSE.md']: true,
            ['packages/generator-package/package.json']: true,
            ['packages/generator-package/README.md']: true,
            ['packages/generator-package/tsconfig.json']: true,
            ['.storybook/main.js']: true,
        });
        if (vars.scm && vars.scm === 'github') {
            files['.github/workflows/deploy-to-env.yml'] = true;
            files['.github/workflows/push-to-feature-branch.yml'] = true;
        }
        return files;
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: new LicenseTemplate(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['CODE_OF_CONDUCT.md']: new CodeOfConductTemplate(vars),
            ['CONTRIBUTING.md']: new ContributingTemplate(vars),
            ['.nvmrc']: new NvmRcTemplate(vars),
        };
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars)
            .addNamedFragmentsFromTemplateDir(
                `${__dirname}/../templates/readme`,
                [
                    'introduction',
                    'executive-summary',
                    'requirements',
                    'get-the-project',
                    'installation',
                    'running-components-locally',
                    'development',
                ]
            )
        ;
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addIgnore('.idea/')
            .addIgnore('node_modules/')
            .addIgnore('lerna-debug.log')
            .addIgnore('npm-debug.log')
            .addIgnore('/packages/*/lib/')
            .addIgnore('/packages/*/*/lib/')
            .addIgnore('coverage/')
            .addIgnore('*.log')
            .addIgnore('*.tsbuildinfo')
            .addIgnore('/packages/*/public/')
            .addIgnore('.DS_Store')
            .addIgnore('public/')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const scm = vars.scm || 'git';
        const m = vars.makefile || {};
        const t = new MakefileTemplate(m)
            .addPredefinedTarget('package-build-storybook', 'yarn-build-storybook', {dir: 'packages/$(p)'})
            .addPredefinedTarget('package-generate-svg-components', 'yarn-generate-svg-components', {dir: 'packages/$(p)'})
            .addPredefinedTarget('package-storybook', 'yarn-story', {dir: 'packages/$(p)'})
            .addPredefinedTarget('install-root', 'yarn-install')
            .addPredefinedTarget('install-packages', 'yarn-lerna-bootstrap')
            .addPredefinedTarget('build', 'yarn-lerna-run-build')
            .addPredefinedTarget('package-build', 'yarn-build', {dir: 'packages/$(p)'})
            .addPredefinedTarget('package-test', 'yarn-test-jest', {dir: 'packages/$(p)', local: true, coverage: true}, [], ['package-build'])
            .addPredefinedTarget('test-only', 'yarn-test-jest', {local: true, parallel: false, coverage: true})
            .addPredefinedTarget('test-local', 'yarn-test-jest', {local: true, coverage: true})
            .addPredefinedTarget('package-clear-test', 'yarn-jest-clear-cache', {dir: 'packages/$(p)'})
            .addPredefinedTarget('package-install', 'yarn-lerna-bootstrap', {scope: `@${vars.npm_scope}/$(p)`})
            .addPredefinedTarget('changed', 'yarn-lerna-changed')
            .addPredefinedTarget('publish', 'yarn-lerna-publish')
            .addPredefinedTarget('clean-buildinfo', 'clean-ts-build-info', {on: 'packages'})
            .addPredefinedTarget('clean-coverage', 'clean-coverage', {on: 'packages'})
            .addPredefinedTarget('clean-lib', 'clean-lib', {on: 'packages'})
            .addPredefinedTarget('clean-modules', 'clean-node-modules', {on: 'packages'})
            .addMetaTarget('test', ['build', 'test-only'])
            .addMetaTarget('install', ['install-root', 'install-packages', 'build'])
            .addMetaTarget('clean', ['clean-lib', 'clean-modules', 'clean-coverage', 'clean-buildinfo'])
            .setDefaultTarget('install')
        ;
        if (vars.generator_package) {
            t
                .addTarget('new', ['yarn --silent yo ./packages/generator-package 2>/dev/null'])
            ;
        }
        if (m.deployable_storybooks) {
            t
                .addPredefinedTarget('deploy-storybooks', 'yarn-deploy-storybooks')
                .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')

                .addGlobalVar('prefix', vars.project_prefix)
                .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
                .addGlobalVar('env', 'dev')
                .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
                .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-storybook`)
                .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_STORYBOOK)`)
                .addMetaTarget('deploy', ['deploy-storybooks', 'invalidate-cache'])
            ;
        }
        if (m.microgen) {
            t
                .addPredefinedTarget('generate', 'yarn-microgen')
            ;
        }
        if ('github' === scm) {
            t
                .addTarget('pr', ['hub pull-request -b $(b)'])
                .addGlobalVar('b', vars.default_branch ? vars.default_branch : 'master')
            ;
        }
        return t;
    }
}
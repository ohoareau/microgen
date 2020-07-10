import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, LicenseTemplate, ReadmeTemplate} from "@ohoareau/microgen-templates-core";

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
        return {
            ['.nvmrc']: true,
            ['CODE_OF_CONDUCT.md']: true,
            ['CONTRIBUTING.md']: true,
            ['jest.config.js']: true,
            ['lerna.json']: true,
            ['Makefile']: true,
            ['tsconfig.json']: true,
            ['tslint.json']: true,
            ['packages/generator-package/__tests__/index.spec.ts']: true,
            ['packages/generator-package/src/index.ts']: true,
            ['packages/generator-package/templates/__tests__/index.spec.tsx']: true,
            ['packages/generator-package/templates/_tpls/index.stories.tsx']: true,
            ['packages/generator-package/templates/_tpls/MainComponent.tsx']: true,
            ['packages/generator-package/templates/src/index.ts']: true,
            ['packages/generator-package/templates/LICENSE.md']: true,
            ['packages/generator-package/templates/package.json']: true,
            ['packages/generator-package/templates/README.md']: true,
            ['packages/generator-package/templates/tsconfig.json']: true,
            ['packages/generator-package/LICENSE.md']: true,
            ['packages/generator-package/package.json']: true,
            ['packages/generator-package/README.md']: true,
            ['packages/generator-package/tsconfig.json']: true,
            ['.storybook/main.js']: true,
            ['.github/workflows/deploy-to-env.yml']: true,
            ['.github/workflows/push-to-feature-branch.yml']: true,
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars)
            .addFragmentFromTemplate(`${__dirname}/../templates/README.md.ejs`)
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
}
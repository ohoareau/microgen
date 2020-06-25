import {AbstractPackage} from '@ohoareau/microgen';

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
            ['.gitignore']: true,
            ['.nvmrc']: true,
            ['CODE_OF_CONDUCT.md']: true,
            ['CONTRIBUTING.md']: true,
            ['jest.config.js']: true,
            ['lerna.json']: true,
            ['LICENSE.md']: true,
            ['Makefile']: true,
            ['README.md']: true,
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
}
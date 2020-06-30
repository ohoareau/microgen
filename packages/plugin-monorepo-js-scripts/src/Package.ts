import {AbstractPackage} from '@ohoareau/microgen';

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            node_version: '14.4.0',
            project_copyright: 'Copyright (c) 2020 Mycompany',
            npm_scope: 'myscope',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['packages/.gitkeep']: true,
            ['.gitignore']: true,
            ['.nvmrc']: true,
            ['lerna.json']: true,
            ['LICENSE.md']: true,
            ['Makefile']: true,
            ['package.json']: true,
            ['README.md']: true,
            ['rollup.config.js']: true,
        };
    }
}
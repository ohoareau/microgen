import {AbstractPackage} from '@ohoareau/microgen';

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            prefix: 'mycompany',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['LICENSE.md']: true,
            ['README.md']: true,
            ['.gitignore']: true,
            ['Makefile']: true,
            ['environments/.gitkeep']: () => '',
            ['layers/.gitkeep']: () => '',
            ['modules/.gitkeep']: () => '',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        return {
            ['environments/.gitkeep']: () => '',
            ['layers/.gitkeep']: () => '',
            ['modules/.gitkeep']: () => '',
        };
    }
}
import {AbstractPackage} from '@ohoareau/microgen';

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            version: '1.0.0',
            author: 'Confidential',
            author_email: 'Confidential',
            description: 'Python AWS Lambda Layer',
            url: 'https://github.com',
            pypi_repo: 'pypi',
            dependencies: {},
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['requirements.txt']: true,
            ['LICENSE']: true,
            ['README.md']: true,
            ['.gitignore']: true,
            ['setup.py']: true,
            ['Makefile']: true,
            ['tests/__init__.py']: true,
            ['package-excludes.lst']: true,
        };
    }
}
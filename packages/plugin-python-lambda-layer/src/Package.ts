import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate} from "@ohoareau/microgen-templates-core";

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            description: 'Python AWS Lambda Layer',
            url: 'https://github.com',
            pypi_repo: 'pypi',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['requirements.txt']: true,
            ['LICENSE']: true,
            ['README.md']: true,
            ['setup.py']: true,
            ['Makefile']: true,
            ['tests/__init__.py']: true,
            ['package-excludes.lst']: true,
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        return {
            ['.gitignore']: this.buildGitIgnore(vars),
        };
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addIgnore('/venv/')
            .addIgnore('/.idea/')
        ;
    }
}
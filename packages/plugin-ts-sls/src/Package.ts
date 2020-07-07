import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate} from "@ohoareau/microgen-templates-core";

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
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['LICENSE.md']: true,
            ['README.md']: true,
            ['Makefile']: true,
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
            .addIgnore('.DS_Store')
            .addIgnore('node_modules')
            .addIgnore('.webpack')
            .addIgnore('.dynamodb')
        ;
    }
}
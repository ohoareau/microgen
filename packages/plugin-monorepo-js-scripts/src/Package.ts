import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, LicenseTemplate, ReadmeTemplate, NvmRcTemplate} from "@ohoareau/microgen-templates";

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
            ['lerna.json']: true,
            ['Makefile']: true,
            ['package.json']: true,
            ['rollup.config.js']: true,
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: new LicenseTemplate(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['.nvmrc']: new NvmRcTemplate(vars),
        };
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
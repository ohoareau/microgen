import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, LicenseTemplate, MakefileTemplate, ReadmeTemplate} from "@ohoareau/microgen-templates";

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            license: 'ISC',
            npm_scope: 'myscope',
            project_prefix: 'mycompany',
            project_name: 'myproject',
            scm: 'git',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['layers/.gitkeep']: true,
            ['scripts/Makefile']: true,
            ['templates/Makefile']: true,
            ['templates/code/build.sh']: true,
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: new LicenseTemplate(vars),
            ['README.md']: this.buildReadme(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
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
            .addIgnore('/layers/*/build/')
            .addIgnore('coverage/')
            .addIgnore('*.log')
            .addIgnore('.DS_Store')
            ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const scm = vars.scm || 'git';
        const t = new MakefileTemplate({makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .setDefaultTarget('install')
            .addGlobalVar('l', 'noname')
            .addGlobalVar('layers', '$(shell cd layers && ls -d */)')
            .addTarget('install', ['$(foreach l,$(layers),make -C layers/$(l) install;)'], ['install-root'])
            .addTarget('layer-install', ['make -C layers/$(l) install'])
            .addTarget('test', ['$(foreach l,$(layers),make -C layers/$(l) test;)'])
            .addTarget('layer-test', ['make -C layers/$(l) test'])
            .addTarget('build', ['$(foreach l,$(layers),make -C layers/$(l) build;)'])
            .addTarget('layer-build', ['make -C layers/$(l) build'])
            .addTarget('publish', ['$(foreach l,$(layers),make -C layers/$(l) publish;)'])
            .addTarget('layer-publish', ['make -C layers/$(l) publish'])
            .addPredefinedTarget('install-root', 'yarn-install')
            .addTarget('list-layers', ['echo $(layers)'])
            .addTarget('new', ['/bin/echo -n "Layer name: " && read layer_name && cp -R templates layers/$$layer_name'])
        ;
        ('github' === scm) && t.addTarget('pr', ['hub pull-request -b $(b)']);
        return t;
    }
    protected getTechnologies(): any {
        return [
            'microgen',
            'make',
            'node',
            'es6',
            'yarn',
            'nvm',
            'npm',
            'markdown',
            'git',
            'jest',
            'prettier',
            'json',
            ...((this.vars.scm === 'github') ? ['github', 'github_actions', 'github_packages', 'npm_rc_github', 'hub', 'ssh_github'] : []),
            (this.vars.scm === 'gitlab') && 'gitlab',
        ];
    }
}
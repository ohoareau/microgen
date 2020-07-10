import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, LicenseTemplate, MakefileTemplate, ReadmeTemplate} from "@ohoareau/microgen-templates-core";

export default class Package extends AbstractPackage {
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            url: 'https://github.com',
            pypi_repo: 'pypi',
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildFilesFromTemplates(vars: any, cfg: any): any {
        return {
            ['requirements.txt']: true,
            ['setup.py']: true,
            ['tests/__init__.py']: true,
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDynamicFiles(vars: any, cfg: any): any {
        return {
            ['LICENSE']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars);
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addIgnore('/venv/')
            .addIgnore('/.idea/')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        return new MakefileTemplate(vars.makefile || {})
            .addGlobalVar('env', 'dev')
            .addGlobalVar('pypi_repo', undefined, vars.pypi_repo)
            .addMetaTarget('pre-install', ['create-venv'])
            .addPredefinedTarget('system-install', 'pip-install-build-utils')
            .addPredefinedTarget('create-venv', 'virtualenv-create')
            .addPredefinedTarget('clean-venv', 'virtualenv-create')
            .addPredefinedTarget('venv-deactivate', 'virtualenv-deactivate')
            .addPredefinedTarget('venv-activate', 'virtualenv-activate')
            .addTarget('build', ['source venv/bin/activate && python3 setup.py sdist bdist_wheel'], ['clean'])
            .addTarget('clean', ['rm -rf dist'])
            .addTarget('deploy', ['source venv/bin/activate && twine upload --repository $(pypi_repo) dist/*'])
            .addTarget('install', ['source venv/bin/activate && pip3 install -r requirements.txt'])
            .addTarget('install-test', ['source venv/bin/activate && pip3 install -r requirements.txt -i https://test.pypi.org/simple'])
            .addTarget('test', ['source venv/bin/activate && python -m unittest tests/*.py -v'])
            .addTarget('test-ci', ['source venv/bin/activate && python -m unittest tests/*.py -v'])
            .addTarget('test-cov', ['source venv/bin/activate && python -m unittest tests/*.py -v'])
            .setDefaultTarget('install')
        ;
    }
}
import {AbstractPackage} from '@ohoareau/microgen';
import {
    GitIgnoreTemplate,
    LicenseTemplate,
    MakefileTemplate,
    ReadmeTemplate,
    PackageExcludesTemplate,
    TerraformToVarsTemplate
} from "@ohoareau/microgen-templates";
import {
    DeployableBehaviour,
    StartableBehaviour,
    BuildableBehaviour,
    CleanableBehaviour,
    InstallableBehaviour,
    GenerateEnvLocalableBehaviour,
    TestableBehaviour
} from '@ohoareau/microgen-behaviours';

export default class Package extends AbstractPackage {
    protected getBehaviours() {
        return [
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new TestableBehaviour(),
            new StartableBehaviour(),
            new DeployableBehaviour(),
        ];
    }
    protected getDefaultExtraOptions(): any {
        return {
            phase: 'pre',
        };
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
            project_name: 'project',
            scripts: {
                "build": "build-package"
            },
            dependencies: {
                "@ohoareau/build-package": "^0.1.0"
            }
        };
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['package.json']: () => JSON.stringify({
                name: vars.name,
                license: vars.license,
                dependencies: vars.dependencies,
                scripts: vars.scripts,
                devDependencies: vars.devDependencies,
                version: vars.version,
                description: vars.description,
                author: (vars.author && ('object' === typeof vars.author)) ? vars.author : {name: vars.author_name, email: vars.author_email},
                private: true,
            }, null, 4),
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['package-excludes.lst']: this.buildPackageExcludes(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars);
    }
    protected buildPackageExcludes(vars: any): PackageExcludesTemplate {
        return new PackageExcludesTemplate(vars);
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addIgnore('/coverage/')
            .addIgnore('/node_modules/')
            .addIgnore('/vendor/')
            .addIgnore('/composer.phar')
            .addIgnore('/build/')
            .addIgnore('/reports/')
            .addIgnore('/.idea/')
            .addIgnore('/.env')
            .addIgnore('/web/bundles/')
            .addIgnore('/app/bootstrap.php.cache')
            .addIgnore('/app/cache/*')
            .addNonIgnore('/app/cache/.gitkeep')
            .addIgnore('/app/logs/*')
            .addNonIgnore('/app/logs/.gitkeep')
            .addIgnore('/app/files/*')
            .addNonIgnore('/app/files/.gitkeep')
            .addIgnore('/bin/doctrine*')
            .addIgnore('/bin/phpunit')
            .addIgnore('/app/config/parameters.yml')
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        const t = new MakefileTemplate({makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('env', 'dev')
            .setDefaultTarget('install')
            .addMetaTarget('install', ['install-js', 'install-php'])
            .addMetaTarget('build', ['build-package'])
            .addPredefinedTarget('install-js', 'yarn-install')
            .addPredefinedTarget('install-php', 'composer-install')
            .addPredefinedTarget('build-package', 'yarn-build')
            .addPredefinedTarget('generate-env-local', 'generate-env-local')
            .addMetaTarget('clean', ['clean-modules', 'clean-coverage', 'clean-vendor'])
            .addPredefinedTarget('clean-modules', 'clean-node-modules')
            .addPredefinedTarget('clean-coverage', 'clean-coverage')
            .addPredefinedTarget('clean-vendor', 'clean-vendor')
            .addPredefinedTarget('test', 'composer-test', {ci: true, coverage: true})
            .addPredefinedTarget('test-dev', 'composer-test', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'composer-test', {local: true})
            .addPredefinedTarget('test-ci', 'composer-test', {ci: true})
        ;
        vars.deployable && t
            .addMetaTarget('deploy', ['deploy-assets'])
            .addTarget('deploy-assets', ['echo not-yet-implemented'])
        ;
        return t;
    }
    protected computePort(a, b) {
        return a + b;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
    protected getTechnologies(): any {
        return [
            'symfony',
            'php',
            'phpenv',
            'make',
            'aws_cli',
            'aws_lambda',
            'node',
            'es6',
            'yarn',
            'nvm',
            'npm',
            'markdown',
            'git',
            'composer',
            'json',
        ];
    }
}
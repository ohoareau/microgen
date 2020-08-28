import {AbstractPackage} from '@ohoareau/microgen';
import {
    GitIgnoreTemplate,
    LicenseTemplate,
    MakefileTemplate,
    ReadmeTemplate,
    TerraformToVarsTemplate
} from '@ohoareau/microgen-templates';
import {BuildableBehaviour, CleanableBehaviour, InstallableBehaviour, DeployableBehaviour, GenerateEnvLocalableBehaviour, StartableBehaviour, ServableBehaviour, TestableBehaviour} from '@ohoareau/microgen-behaviours';

export default class Package extends AbstractPackage {
    protected getBehaviours() {
        return [
            new BuildableBehaviour(),
            new CleanableBehaviour(),
            new InstallableBehaviour(),
            new DeployableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new StartableBehaviour(),
            new ServableBehaviour(),
            new TestableBehaviour(),
        ]
    }
    protected getTemplateRoot(): string {
        return `${__dirname}/../templates`;
    }
    // noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
    protected buildDefaultVars(vars: any): any {
        return {
        };
    }
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
        };
    }
    protected buildLicense(vars: any): LicenseTemplate {
        return new LicenseTemplate(vars);
    }
    protected buildReadme(vars: any): ReadmeTemplate {
        return new ReadmeTemplate(vars)
            .addFragmentFromTemplate(`${__dirname}/../templates/readme/original.md.ejs`)
        ;
    }
    protected buildGitIgnore(vars: any): GitIgnoreTemplate {
        return new GitIgnoreTemplate(vars.gitignore || {})
            .addGroup('Logs', [
                'logs', '*.log', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*',
            ])
            .addGroup('Dependency directories', [
                'node_modules/',
            ])
            .addGroup('dotenv environment variable files', [
                '.env*',
            ])
            .addGroup('Docusaurus files', [
                '.docusaurus', '.cache-loader', '/build',
            ])
            .addGroup('Mac files', [
                '.DS_Store',
            ])
            .addGroup('IDE files', [
                '.idea',
            ])
            .addGroup('Yarn', [
                'yarn-error.log', '.pnp/', '.pnp.js',
            ])
            .addGroup('Yarn Integrity file', [
                '.yarn-integrity',
            ])
        ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        return new MakefileTemplate({makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('env', 'dev')
            .setDefaultTarget('install')
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build')
            .addPredefinedTarget('deploy', 'yarn-deploy')
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'DOCUSAURUS'})
            .addPredefinedTarget('start', 'yarn-start', {port: this.getParameter('startPort')})
            .addPredefinedTarget('serve', 'yarn-serve', {port: this.getParameter('servePort')})
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true, coverage: false})
        ;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
    protected getPreRequisites(): any {
        return {
        };
    }
    protected getInstallProcedures(): any {
        return {
        };
    }
    protected getTechnologies(): any {
        return [
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
        ];
    }
}
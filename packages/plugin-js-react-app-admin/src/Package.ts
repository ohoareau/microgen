import {AbstractPackage, BasePackageConfig} from '@ohoareau/microgen';
import {GitIgnoreTemplate, LicenseTemplate, MakefileTemplate, ReadmeTemplate, TerraformToVarsTemplate} from "@ohoareau/microgen-templates";
import {BuildableBehaviour, DeployableBehaviour, InstallableBehaviour, StartableBehaviour, TestableBehaviour, GenerateEnvLocalableBehaviour} from "@ohoareau/microgen-behaviours";
import {config} from "./types";
import FormResource from "./resources/FormResource";
import ScreenResource from "./resources/ScreenResource";
import MenuitemResource from "./resources/MenuitemResource";
import ActionResource from "./resources/ActionResource";
import QueryResource from "./resources/QueryResource";
import ThemeResource from "./resources/ThemeResource";
import TranslationResource from "./resources/TranslationResource";
import RouteResource from "./resources/RouteResource";
import ConfigLoader from "./ConfigLoader";
import {MenuitemsFileTemplate} from "./templates/MenuitemsFileTemplate";
import {ActionsFileTemplate} from "./templates/ActionsFileTemplate";
import QueriesFileTemplate from "./templates/QueriesFileTemplate";
import ThemesIndexFileTemplate from "./templates/ThemesIndexFileTemplate";
import ThemeFileTemplate from "./templates/ThemeFileTemplate";
import TranslationsIndexFileTemplate from "./templates/TranslationsIndexFileTemplate";
import TranslationFileTemplate from "./templates/TranslationFileTemplate";
import RoutesFileTemplate from "./templates/RoutesFileTemplate";
import FormComponentFileTemplate from "./templates/FormComponentFileTemplate";

interface PackageConfig extends BasePackageConfig, config {
}

export default class Package extends AbstractPackage {
    protected readonly resources: {
        forms: FormResource[],
        screens: ScreenResource[],
        menuitems: MenuitemResource[],
        actions: ActionResource[],
        queries: QueryResource[],
        themes: ThemeResource[],
        translations: TranslationResource[],
        routes: RouteResource[],
    }
    constructor(config: PackageConfig) {
        super(config);
        const schema = new ConfigLoader().load(config);
        this.resources = {
            forms: schema.forms.map(x => new FormResource(x)),
            screens: schema.screens.map(x => new ScreenResource(x)),
            menuitems: schema.menuitems.map(x => new MenuitemResource(x)),
            actions: schema.actions.map(x => new ActionResource(x)),
            queries: schema.queries.map(x => new QueryResource(x)),
            themes: schema.themes.map(x => new ThemeResource(x)),
            translations: schema.translations.map(x => new TranslationResource(x)),
            routes: schema.routes.map(x => new RouteResource(x)),
        }
    }
    protected getBehaviours() {
        return [
            new BuildableBehaviour(),
            new DeployableBehaviour(),
            new GenerateEnvLocalableBehaviour(),
            new InstallableBehaviour(),
            new StartableBehaviour(),
            new TestableBehaviour(),
        ]
    }
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
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
            ['terraform-to-vars.json']: this.buildTerraformToVars(vars),
            ...(await this.buildAppFiles(vars, cfg)),
        };
    }
    protected async buildAppFiles(vars: any, cfg: any): Promise<any> {
        return {
            ...(await this.buildAppFormFiles(vars, cfg)),
            ...(await this.buildAppScreenFiles(vars, cfg)),
            ...(await this.buildAppMenuitemFiles(vars, cfg)),
            ...(await this.buildAppActionFiles(vars, cfg)),
            ...(await this.buildAppQueryFiles(vars, cfg)),
            ...(await this.buildAppThemeFiles(vars, cfg)),
            ...(await this.buildAppTranslationFiles(vars, cfg)),
            ...(await this.buildAppRouteFiles(vars, cfg)),
        };
    }
    protected async buildAppFormFiles(vars: any, cfg: any): Promise<any> {
        return this.resources.forms.reduce(
            (acc, x) =>
                (Object.assign as any)(acc, this.buildAppFormResourceFiles(x, vars, cfg)),
            {}
        );
    }
    protected buildAppFormResourceFiles(r: FormResource, vars: any, cfg: any) {
        return {
            [`components/forms/${r.package}/${r.componentName}.jsx`]:  new FormComponentFileTemplate(r, vars, cfg),
        }
    }
    protected async buildAppScreenFiles(vars: any, cfg: any): Promise<any> {
        return this.resources.screens.reduce(
            (acc, x) =>
                (Object.assign as any)(acc, this.buildAppScreenResourceFiles(x, vars, cfg)),
            {}
        );
    }
    protected buildAppScreenResourceFiles(r: ScreenResource, vars: any, cfg: any) {
        return {
        }
    }
    protected async buildAppMenuitemFiles(vars: any, cfg: any): Promise<any> {
        return {
            'configs/menuitems.js': new MenuitemsFileTemplate(this.resources.menuitems, vars, cfg),
        };
    }
    protected async buildAppActionFiles(vars: any, cfg: any): Promise<any> {
        return {
            'configs/actions.js': new ActionsFileTemplate(this.resources.actions, vars, cfg),
        };
    }
    protected async buildAppQueryFiles(vars: any, cfg: any): Promise<any> {
        return {
            'queries.js': new QueriesFileTemplate(this.resources.queries, vars, cfg),
        };
    }
    protected async buildAppThemeFiles(vars: any, cfg: any): Promise<any> {
        return {
            ...this.resources.themes.reduce(
                (acc, x) =>
                    (Object.assign as any)(acc, this.buildAppThemeResourceFiles(x, vars, cfg)),
                {}
            ),
            'configs/themes/index.js': new ThemesIndexFileTemplate(this.resources.themes, vars, cfg),
        };
    }
    protected buildAppThemeResourceFiles(r: ThemeResource, vars: any, cfg: any) {
        return {
            [`configs/themes/${r.name}.js`]: new ThemeFileTemplate(r, vars, cfg),
        }
    }
    protected async buildAppTranslationFiles(vars: any, cfg: any): Promise<any> {
        return {
            ...this.resources.translations.reduce(
                (acc, x) =>
                    (Object.assign as any)(acc, this.buildAppTranslationResourceFiles(x, vars, cfg)),
                {}
            ),
            'configs/translations/index.js': new TranslationsIndexFileTemplate(this.resources.translations, vars, cfg),
        };
    }
    protected buildAppTranslationResourceFiles(r: TranslationResource, vars: any, cfg: any) {
        return {
            [`configs/translations/${r.name}.js`]: new TranslationFileTemplate(r, vars, cfg),
        }
    }
    protected async buildAppRouteFiles(vars: any, cfg: any): Promise<any> {
        return {
            'configs/routes.js': new RoutesFileTemplate(this.resources.routes, vars, cfg),
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
            .addComment('See https://help.github.com/articles/ignoring-files/ for more about ignoring files.')
            .addGroup('dependencies', [
                '/node_modules', '/.pnp', '.pnp.js',
            ])
            .addGroup('testing', [
                '/coverage',
            ])
            .addGroup('production', [
                '/build',
            ])
            .addGroup('misc', [
                '.DS_Store',
                '.env.local', '.env.development.local', '.env.test.local', '.env.production.local',
                'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*',
            ])
            ;
    }
    protected buildMakefile(vars: any): MakefileTemplate {
        return new MakefileTemplate({makefile: false !== vars.makefile, ...(vars.makefile || {})})
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-${vars.name}`)
            .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_${vars.name.toUpperCase()})`)
            .setDefaultTarget('install')
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build', {ci: (!!vars.hide_ci) ? 'hidden' : undefined})
            .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'build/'})
            .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
            .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'REACT_APP'})
            .addPredefinedTarget('start', 'yarn-start', {port: this.getParameter('startPort')})
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true, coverage: false})
        ;
    }
    protected buildTerraformToVars(vars: any): TerraformToVarsTemplate {
        return new TerraformToVarsTemplate(vars);
    }
    protected getTechnologies(): any {
        return [
            'react_cra',
            'make',
            'aws_cli',
            'aws_cloudfront',
            'aws_s3',
            'aws_route53',
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
            this.vars.publish_image && 'docker',
        ];
    }
}
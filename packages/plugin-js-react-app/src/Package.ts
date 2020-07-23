import {AbstractPackage} from '@ohoareau/microgen';
import {GitIgnoreTemplate, LicenseTemplate, MakefileTemplate, ReadmeTemplate} from "@ohoareau/microgen-templates-core";

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
    protected async buildDynamicFiles(vars: any, cfg: any): Promise<any> {
        return {
            ['LICENSE.md']: this.buildLicense(vars),
            ['README.md']: this.buildReadme(vars),
            ['.gitignore']: this.buildGitIgnore(vars),
            ['Makefile']: this.buildMakefile(vars),
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
        return new MakefileTemplate(vars.makefile || {})
            .addGlobalVar('prefix', vars.project_prefix)
            .addGlobalVar('bucket_prefix', vars.bucket_prefix ? vars.bucket_prefix : `$(prefix)-${vars.project_name}`)
            .addGlobalVar('env', 'dev')
            .addGlobalVar('AWS_PROFILE', `${vars.aws_profile_prefix || '$(prefix)'}-$(env)`)
            .addGlobalVar('bucket', vars.bucket ? vars.bucket : `$(env)-$(bucket_prefix)-${vars.name}`)
            .addGlobalVar('cloudfront', vars.cloudfront ? vars.cloudfront : `$(AWS_CLOUDFRONT_DISTRIBUTION_ID_${vars.name.toUpperCase()})`)
            .setDefaultTarget('install')
            .addTarget('pre-install')
            .addPredefinedTarget('install', 'yarn-install')
            .addPredefinedTarget('build', 'yarn-build')
            .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'build/'})
            .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
            .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
            .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'REACT_APP'})
            .addPredefinedTarget('start', 'yarn-start')
            .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: false})
            .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
            .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true, coverage: false})
        ;
    }
    protected getTechnologies(vars: any): any {
        return {
            create_react_app: {name: "Create React App (CRA)", link: "https://create-react-app.dev/"},
            make: {name: "Make / Makefile", link: "https://www.gnu.org/software/make/manual/make.html"},
            aws: {name: "Amazon Web Services (AWS)", link: "https://aws.amazon.com/"},
            aws_cli: {name: "AWS CLI", link: "https://aws.amazon.com/fr/cli/"},
            aws_cloudfront: {name: "AWS CloudFront", link: "https://aws.amazon.com/fr/cloudfront/"},
            aws_s3: {name: "AWS S3", link: "https://aws.amazon.com/fr/s3/"},
            aws_route53: {name: "AWS Route53", link: "https://aws.amazon.com/fr/route53/"},
            nodejs: {name: "Node.js", link: "https://nodejs.org/en/"},
            js_es6: {name: "Javascript (ES6)", link: "http://es6-features.org/"},
            reactjs: {name: "ReactJS", link: "https://fr.reactjs.org/"},
            yarn: {name: "Yarn", link: "https://yarnpkg.com/"},
            nvm: {name: "NVM", link: "https://github.com/nvm-sh/nvm"},
            npm: {name: "NPM", link: "https://www.npmjs.com/"},
            markdown: {name: "Markdown", link: "https://guides.github.com/features/mastering-markdown/"},
            git: {name: "Git", link: "https://git-scm.com/"},
            jest: {name: "Jest", link: "https://jestjs.io/"},
            prettier: {name: "Prettier", link: "https://prettier.io/"},
            json: {name: "JSON", link: "https://www.json.org/json-fr.html"},
        };
    }
}
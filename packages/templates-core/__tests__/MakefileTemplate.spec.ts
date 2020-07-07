import {MakefileTemplate} from '../src';
import path from 'path';

const expectRenderSameAsFile = (template: MakefileTemplate, file: string) => {
    expect(template.render()).toEqual(require('fs').readFileSync(path.resolve(`${__dirname}/../__fixtures__/makefiles/${file}`), 'utf8').trim());
};

describe('render', () => {
    it('no targets', () => {
        expectRenderSameAsFile(new MakefileTemplate(), 'no-targets.mk');
    })
    it('one target named all', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addTarget('all', ['@true'])
            ,
            'one-target-named-all.mk'
        );
    })
    it('one target named all plus other targets', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addTarget('all', ['@true'])
                .addTarget('t1', ['@false'])
                .addTarget('t2', ['@true'])
            ,
            'one-target-named-all-plus-other-targets.mk'
        );
    })
    it('grouped targets', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addTarget('all', ['@true'])
                .addTarget('build', ['@true'])
                .addPredefinedTarget('install-dummy', 'yarn-lerna-bootstrap', {scope: '@dummy'})
                .addTarget('build-c', ['@true'])
                .addTarget('build-a', ['@true'])
                .addTarget('build-b', ['@true'])
            ,
            'grouped-targets.mk'
        );
    })
    it('sample packages', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addTarget('fixture-gen', ['cd packages/$(p) && yarn --silent gen -c __fixtures__/$(f).js -t ../../generated/$(f)'])
                .addPredefinedTarget('install-root', 'yarn-install')
                .addPredefinedTarget('install-packages', 'yarn-lerna-bootstrap')
                .addPredefinedTarget('build', 'yarn-lerna-run-build')
                .addPredefinedTarget('package-build', 'yarn-build', {dir: 'packages/$(p)'})
                .addPredefinedTarget('package-test', 'yarn-test-jest', {dir: 'packages/$(p)', local: true, coverage: true}, [], ['package-build'])
                .addPredefinedTarget('test-only', 'yarn-test-jest', {local: true, parallel: false, coverage: true})
                .addPredefinedTarget('test-local', 'yarn-test-jest', {local: true, coverage: true})
                .addPredefinedTarget('package-clear-test', 'yarn-jest-clear-cache', {dir: 'packages/$(p)'})
                .addPredefinedTarget('package-install', 'yarn-lerna-bootstrap', {scope: '@ohoareau/$(p)'})
                .addPredefinedTarget('changed', 'yarn-lerna-changed')
                .addPredefinedTarget('publish', 'yarn-lerna-publish')
                .addPredefinedTarget('clean-buildinfo', 'clean-ts-build-info', {on: 'packages'})
                .addPredefinedTarget('clean-coverage', 'clean-coverage', {on: 'packages'})
                .addPredefinedTarget('clean-lib', 'clean-lib', {on: 'packages'})
                .addPredefinedTarget('clean-modules', 'clean-node-modules', {on: 'packages'})
                .addMetaTarget('test', ['build', 'test-only'])
                .addMetaTarget('install', ['install-root', 'install-packages', 'build'])
                .addMetaTarget('clean', ['clean-lib', 'clean-modules', 'clean-coverage', 'clean-buildinfo'])
                .setDefaultTarget('install')
            ,
            'sample-packages.mk'
        );
    })
    it('sample platform', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addGlobalVar('env', 'dev')
                .addGlobalVar('b', 'develop')
                .addPredefinedTarget('generate', 'yarn-microgen')
                .addPredefinedTarget('install-root', 'yarn-install')
                .addPredefinedTarget('install-terraform', 'tfenv-install')
                .addMetaTarget('pre-install-root', ['install-root'])
                .addTarget('pre-install-git')
                .addTarget('install-git')
                .addTarget('test-git')
                .addMetaTarget('deploy', ['deploy-front', 'deploy-app'])
                .addMetaTarget('build', ['build-pre-provision', 'build-post-provision'])
                .addMetaTarget('build-pre-plan', ['build-api'])
                .addMetaTarget('build-pre-provision', ['build-pre-plan'])
                .addMetaTarget('build-post-provision', ['build-front', 'build-app'])
                .addMetaTarget('test', ['test-git', 'test-front', 'test-app', 'test-api'])
                .addSubTarget('provision', 'infra', 'provision', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('provision-full', 'infra', 'provision-full', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-init', 'infra', 'init', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-plan', 'infra', 'plan', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-refresh', 'infra', 'refresh', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-update', 'infra', 'update', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('list-layers', 'infra', 'list-layers', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-init-full', 'infra', 'init-full', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-init-full-upgrade', 'infra', 'init-full-upgrade', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('infra-destroy', 'infra', 'destroy', {env: '$(env)', layer: '$(layer)'}, ['generate-terraform'])
                .addSubTarget('output', 'infra', 'output', {env: '$(env)', layer: '$(layer)'}, ['generate-terraform'])
                .addSubTarget('output-json', 'infra', 'output-json', {env: '$(env)', layer: '$(layer)'}, ['generate-terraform'])
                .addSubTarget('outputs', 'infra', 'outputs', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('refresh-api', 'infra', 'provision', {env: '$(env)', layer: 'api'}, ['generate-terraform', 'build-api'])
                .addSubTarget('infra-init-upgrade', 'infra', 'init-upgrade', {env: '$(env)'}, ['generate-terraform'])
                .addSubTarget('pre-install-api', 'api', 'pre-install')
                .addSubTarget('pre-install-app', 'app', 'pre-install')
                .addSubTarget('pre-install-front', 'front', 'pre-install')
                .addSubTarget('install-api', 'api', 'install')
                .addSubTarget('install-app', 'app', 'install')
                .addSubTarget('install-front', 'front', 'install')
                .addSubTarget('deploy-app', 'app', 'deploy', {env: '$(env)'}, ['generate-env-local-app'], {sourceEnvLocal: true})
                .addSubTarget('deploy-front', 'front', 'deploy', {env: '$(env)'}, ['generate-env-local-front'], {sourceEnvLocal: true})
                .addSubTarget('build-api', 'api', 'build', {env: '$(env)'}, ['generate-env-local-api'])
                .addSubTarget('build-front', 'front', 'build', {env: '$(env)'}, ['generate-env-local-front'])
                .addSubTarget('build-app', 'app', 'build', {env: '$(env)'}, ['generate-env-local-app'])
                .addSubTarget('test-api', 'api', 'test')
                .addSubTarget('test-app', 'app', 'test')
                .addSubTarget('test-front', 'front', 'test')
                .addSubTarget('start-front', 'front', 'start', {env: '$(env)'})
                .addSubTarget('start-app', 'app', 'start', {env: '$(env)'})
                .addSubTarget('generate-terraform', 'infra', 'generate')
                .addSubTarget('generate-env-local-front', 'front', 'generate-env-local', {env: '$(env)'})
                .addSubTarget('generate-env-local-api', 'api', 'generate-env-local', {env: '$(env)'})
                .addSubTarget('generate-env-local-app', 'app', 'generate-env-local', {env: '$(env)'})
                .addMetaTarget('generate-env-local', ['generate-env-local-front', 'generate-env-local-app', 'generate-env-local-api'])
                .addMetaTarget('pre-install', ['pre-install-root', 'pre-install-git', 'pre-install-front', 'pre-install-app', 'pre-install-api'])
                .addMetaTarget('install', ['install-root', 'install-git', 'install-front', 'install-app', 'install-api'])
                .addMetaTarget('start', ['start-front'])
                .setDefaultTarget('install')
            ,
            'sample-platform.mk'
        );
    })
    it('sample api', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addGlobalVar('env', 'dev')
                .setDefaultTarget('install')
                .addTarget('pre-install')
                .addPredefinedTarget('generate-env-local', 'generate-env-local')
                .addPredefinedTarget('build', 'yarn-build')
                .addPredefinedTarget('deploy', 'yarn-deploy')
                .addPredefinedTarget('install', 'yarn-install')
                .addPredefinedTarget('clean-modules', 'clean-node-modules')
                .addPredefinedTarget('clean-coverage')
                .addPredefinedTarget('test-ci', 'yarn-test-jest', {ci: true})
                .addPredefinedTarget('test', 'yarn-test-jest', {local: true, coverage: false})
                .addPredefinedTarget('test-cov', 'yarn-test-jest', {local: true})
                .addMetaTarget('clean', ['clean-modules', 'clean-coverage'])
            ,
            'sample-api.mk'
        );
    })
    it('sample app', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addGlobalVar('prefix', 'myprefix')
                .addGlobalVar('bucket_prefix', '$(prefix)-myproject')
                .addGlobalVar('env', 'dev')
                .addGlobalVar('AWS_PROFILE', '$(prefix)-$(env)')
                .addGlobalVar('bucket', '$(env)-$(bucket_prefix)-app')
                .addGlobalVar('cloudfront', '$(AWS_CLOUDFRONT_DISTRIBUTION_ID_APP)')
                .setDefaultTarget('install')
                .addTarget('pre-install')
                .addPredefinedTarget('install', 'yarn-install')
                .addPredefinedTarget('build', 'yarn-build')
                .addPredefinedTarget('deploy-code', 'aws-s3-sync')
                .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
                .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
                .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'REACT_APP'})
                .addPredefinedTarget('start', 'yarn-start')
                .addPredefinedTarget('test', 'yarn-test-jest', {ci: true, coverage: false})
                .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            ,
            'sample-app.mk'
        );
    })
    it('sample front', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addGlobalVar('prefix', 'myprefix')
                .addGlobalVar('bucket_prefix', '$(prefix)-myproject')
                .addGlobalVar('env', 'dev')
                .addGlobalVar('AWS_PROFILE', '$(prefix)-$(env)')
                .addGlobalVar('bucket', '$(env)-$(bucket_prefix)-front')
                .addGlobalVar('cloudfront', '$(AWS_CLOUDFRONT_DISTRIBUTION_ID_FRONT)')
                .setDefaultTarget('install')
                .addTarget('pre-install')
                .addPredefinedTarget('install', 'yarn-install')
                .addPredefinedTarget('build', 'yarn-build')
                .addPredefinedTarget('deploy-code', 'aws-s3-sync', {source: 'public/'})
                .addPredefinedTarget('invalidate-cache', 'aws-cloudfront-create-invalidation')
                .addMetaTarget('deploy', ['deploy-code', 'invalidate-cache'])
                .addPredefinedTarget('generate-env-local', 'generate-env-local', {prefix: 'GATSBY'})
                .addPredefinedTarget('start', 'yarn-start')
                .addPredefinedTarget('serve', 'yarn-serve')
                .addPredefinedTarget('test', 'yarn-test-jest', {coverage: true})
                .addPredefinedTarget('test-dev', 'yarn-test-jest', {local: true, all: true, coverage: false, color: true})
            ,
            'sample-front.mk'
        );
    })
    it('sample infra', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addGlobalVar('prefix', 'myprefix')
                .addGlobalVar('env', 'dev')
                .addGlobalVar('layer', '"all"')
                .addGlobalVar('layers', '$(shell AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) list-layers)')
                .addGlobalVar('AWS_PROFILE', '$(prefix)-$(env)')
                .addTarget('all')
                .addTarget('pre-install')
                .addPredefinedTarget('apply', 'tflayer-apply')
                .addPredefinedTarget('destroy', 'tflayer-destroy')
                .addPredefinedTarget('get', 'tflayer-get')
                .addPredefinedTarget('init', 'tflayer-init')
                .addPredefinedTarget('init-full', 'tflayer-init-full')
                .addPredefinedTarget('init-full-upgrade', 'tflayer-init-full-upgrade')
                .addPredefinedTarget('init-upgrade', 'tflayer-init-upgrade')
                .addPredefinedTarget('list-layers', 'tflayer-list-layers')
                .addPredefinedTarget('plan', 'tflayer-plan')
                .addPredefinedTarget('refresh', 'tflayer-refresh')
                .addPredefinedTarget('sync', 'tflayer-sync')
                .addPredefinedTarget('sync-full', 'tflayer-sync-full')
                .addPredefinedTarget('update', 'tflayer-update')
                .addPredefinedTarget('generate', 'tfgen')
                .addPredefinedTarget('output', 'tflayer-output')
                .addPredefinedTarget('output-json', 'tflayer-output-json')
                .addPredefinedTarget('outputs', 'outputs')
                .addMetaTarget('provision', ['init', 'sync'])
                .addMetaTarget('provision-full', ['init-full', 'sync-full'])
            ,
            'sample-infra.mk'
        );
    })
    it('sample custom lambda layer', () => {
        expectRenderSameAsFile(
            new MakefileTemplate()
                .addGlobalVar('env', 'dev')
                .setDefaultTarget('install')
                .addTarget('pre-install')
                .addTarget('install-test')
                .addTarget('test')
                .addTarget('test-cov')
                .addTarget('test-ci')
                .addShellTarget('install', './bin/install')
                .addShellTarget('clean', './bin/clean')
                .addShellTarget('build', './bin/build', ['clean'])
                .addTarget('deploy')
            ,
            'sample-custom-lambda-layer.mk'
        );
    })
})
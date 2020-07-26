prefix ?= myprefix
bucket_prefix ?= $(prefix)-myproject
env ?= dev
AWS_PROFILE ?= $(prefix)-$(env)
bucket ?= $(env)-$(bucket_prefix)-storybook
cloudfront ?= $(AWS_CLOUDFRONT_DISTRIBUTION_ID_STORYBOOK)

all: install

build:
	@yarn --silent lerna run build --stream

changed:
	@yarn --silent lerna changed

clean: clean-lib clean-modules clean-coverage clean-buildinfo
clean-buildinfo:
	@find packages/ -name tsconfig.tsbuildinfo -exec rm -rf {} +
clean-coverage:
	@rm -rf coverage/
	@find packages/ -name coverage -type d -exec rm -rf {} +
clean-lib:
	@find packages/ -name lib -type d -exec rm -rf {} +
clean-modules:
	@rm -rf node_modules/
	@find packages/ -name node_modules -type d -exec rm -rf {} +

deploy: deploy-storybooks invalidate-cache
deploy-storybooks:
	@yarn --silent deploy-storybooks

generate:
	@yarn --silent microgen

install: install-root install-packages build
install-packages:
	@yarn --silent lerna bootstrap
install-root:
	@yarn --silent install

invalidate-cache:
	@AWS_PROFILE=$(AWS_PROFILE) aws cloudfront create-invalidation --distribution-id $(cloudfront) --paths '/*'

new:
	@yarn --silent yo ./packages/generator-package 2>/dev/null

package-build:
	@cd packages/$(p) && yarn --silent build
package-build-storybook:
	@cd packages/$(p) && yarn --silent build-storybook
package-clear-test:
	@cd packages/$(p) && yarn --silent jest --clearCache
package-generate-svg-components:
	@cd packages/$(p) && yarn --silent generate-svg-components
package-install:
	@yarn --silent lerna bootstrap --scope @ohoareau/$(p)
package-storybook:
	@cd packages/$(p) && yarn --silent story
package-test: package-build
	@cd packages/$(p) && yarn --silent test --coverage --detectOpenHandles

publish:
	@yarn --silent lerna publish

test: build test-only
test-local:
	@yarn --silent test --coverage --detectOpenHandles
test-only:
	@yarn --silent test --runInBand --coverage --detectOpenHandles

.PHONY: all \
		build \
		changed \
		clean clean-buildinfo clean-coverage clean-lib clean-modules \
		deploy deploy-storybooks \
		generate \
		install install-packages install-root \
		invalidate-cache \
		new \
		package-build package-build-storybook package-clear-test package-generate-svg-components package-install package-storybook package-test \
		publish \
		test test-local test-only

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

fixture-gen:
	@cd packages/$(p) && yarn --silent gen -c __fixtures__/$(f).js -t ../../generated/$(f)

install: install-root install-packages build
install-packages:
	@yarn --silent lerna bootstrap
install-root:
	@yarn --silent install

package-build:
	@cd packages/$(p) && yarn --silent build
package-clear-test:
	@cd packages/$(p) && yarn --silent jest --clearCache
package-install:
	@yarn --silent lerna bootstrap --scope @ohoareau/$(p)
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
		fixture-gen \
		install install-packages install-root \
		package-build package-clear-test package-install package-test \
		publish \
		test test-local test-only
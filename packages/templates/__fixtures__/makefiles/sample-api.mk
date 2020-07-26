env ?= dev

all: install

build:
	@yarn --silent build

clean: clean-modules clean-coverage
clean-coverage:
	@rm -rf coverage/
clean-modules:
	@rm -rf node_modules/

deploy:
	@yarn --silent deploy

generate-env-local:
	@../node_modules/.bin/generate-vars-from-terraform-outputs $(env) ./terraform-to-vars.json > ./.env.local

install:
	@yarn --silent install

pre-install:
	@true

test:
	@yarn --silent test --detectOpenHandles
test-ci:
	@CI=true yarn --silent test --all --color --coverage --detectOpenHandles
test-cov:
	@yarn --silent test --coverage --detectOpenHandles

.PHONY: all \
		build \
		clean clean-coverage clean-modules \
		deploy \
		generate-env-local \
		install \
		pre-install \
		test test-ci test-cov
prefix ?= myprefix
bucket_prefix ?= $(prefix)-myproject
env ?= dev
AWS_PROFILE ?= $(prefix)-$(env)
bucket ?= $(env)-$(bucket_prefix)-app
cloudfront ?= $(AWS_CLOUDFRONT_DISTRIBUTION_ID_APP)

all: install

build:
	@yarn --silent build

deploy: deploy-code invalidate-cache
deploy-code:
	@AWS_PROFILE=$(AWS_PROFILE) aws s3 sync build/ s3://$(bucket) --delete

generate-env-local:
	@../node_modules/.bin/env REACT_APP_ > ./.env.local
	@../node_modules/.bin/generate-vars-from-terraform-outputs $(env) ./terraform-to-vars.json >> ./.env.local

install:
	@yarn --silent install

invalidate-cache:
	@AWS_PROFILE=$(AWS_PROFILE) aws cloudfront create-invalidation --distribution-id $(cloudfront) --paths '/*'

pre-install:
	@true

start:
	@yarn --silent start

test:
	@CI=true yarn --silent test --all --color --detectOpenHandles
test-dev:
	@yarn --silent test --all --color --detectOpenHandles

.PHONY: all \
		build \
		deploy deploy-code \
		generate-env-local \
		install \
		invalidate-cache \
		pre-install \
		start \
		test test-dev
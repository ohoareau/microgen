prefix ?= myprefix
bucket_prefix ?= $(prefix)-myproject
env ?= dev
AWS_PROFILE ?= $(prefix)-$(env)
bucket ?= $(env)-$(bucket_prefix)-front
cloudfront ?= $(AWS_CLOUDFRONT_DISTRIBUTION_ID_FRONT)

all: install

build: build-code build-publish-image
build-code:
	@yarn --silent build
build-publish-image:
	@docker build -t mytag --build-arg arg1=value1 --build-arg arg2=value2 .

deploy: deploy-publish-image
deploy-code:
	@AWS_PROFILE=$(AWS_PROFILE) aws s3 sync public/ s3://$(bucket) --delete
deploy-publish-image:
	@(aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin 012345678912.dkr.ecr.eu-west-3.amazonaws.com) && (docker push 012345678912.dkr.ecr.eu-west-3.amazonaws.com/abcd:latest)
deploy-raw: deploy-code invalidate-cache

generate-env-local:
	@../node_modules/.bin/env GATSBY_ > ./.env.local
	@../node_modules/.bin/generate-vars-from-terraform-outputs $(env) ./terraform-to-vars.json >> ./.env.local

install:
	@yarn --silent install

invalidate-cache:
	@AWS_PROFILE=$(AWS_PROFILE) aws cloudfront create-invalidation --distribution-id $(cloudfront) --paths '/*'

pre-install:
	@true

serve:
	@yarn --silent serve

start:
	@yarn --silent start

test:
	@yarn --silent test --all --color --coverage --detectOpenHandles
test-dev:
	@yarn --silent test --all --color --detectOpenHandles

.PHONY: all \
		build build-code build-publish-image \
		deploy deploy-code deploy-publish-image deploy-raw \
		generate-env-local \
		install \
		invalidate-cache \
		pre-install \
		serve \
		start \
		test test-dev

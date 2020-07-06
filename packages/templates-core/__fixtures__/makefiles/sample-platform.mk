env ?= dev
b ?= develop

all: install

build: build-pre-provision build-post-provision
build-api: generate-env-local-api
	@make -C api/ build env=$(env)
build-app: generate-env-local-app
	@make -C app/ build env=$(env)
build-front: generate-env-local-front
	@make -C front/ build env=$(env)
build-post-provision: build-front build-app
build-pre-plan: build-api
build-pre-provision: build-pre-plan

deploy: deploy-front deploy-app
deploy-app: generate-env-local-app
	@set -a && . app/.env.local && set +a && make -C app/ deploy env=$(env)
deploy-front: generate-env-local-front
	@set -a && . front/.env.local && set +a && make -C front/ deploy env=$(env)

generate:
	@yarn --silent microgen
generate-env-local: generate-env-local-front generate-env-local-app generate-env-local-api
generate-env-local-api:
	@make -C api/ generate-env-local env=$(env)
generate-env-local-app:
	@make -C app/ generate-env-local env=$(env)
generate-env-local-front:
	@make -C front/ generate-env-local env=$(env)
generate-terraform:
	@make -C infra/ generate

infra-destroy: generate-terraform
	@make -C infra/ destroy env=$(env) layer=$(layer)
infra-init: generate-terraform
	@make -C infra/ init env=$(env)
infra-init-full: generate-terraform
	@make -C infra/ init-full env=$(env)
infra-init-full-upgrade: generate-terraform
	@make -C infra/ init-full-upgrade env=$(env)
infra-init-upgrade: generate-terraform
	@make -C infra/ init-upgrade env=$(env)
infra-plan: generate-terraform
	@make -C infra/ plan env=$(env)
infra-refresh: generate-terraform
	@make -C infra/ refresh env=$(env)
infra-update: generate-terraform
	@make -C infra/ update env=$(env)

install: install-root install-git install-front install-app install-api
install-api:
	@make -C api/ install
install-app:
	@make -C app/ install
install-front:
	@make -C front/ install
install-git:
	@true
install-root:
	@yarn --silent install
install-terraform:
	@tfenv install

list-layers: generate-terraform
	@make -C infra/ list-layers env=$(env)

output: generate-terraform
	@make -C infra/ output env=$(env) layer=$(layer)
output-json: generate-terraform
	@make -C infra/ output-json env=$(env) layer=$(layer)

outputs: generate-terraform
	@make -C infra/ outputs env=$(env)

pre-install: pre-install-root pre-install-git pre-install-front pre-install-app pre-install-api
pre-install-api:
	@make -C api/ pre-install
pre-install-app:
	@make -C app/ pre-install
pre-install-front:
	@make -C front/ pre-install
pre-install-git:
	@true
pre-install-root: install-root

provision: generate-terraform
	@make -C infra/ provision env=$(env)
provision-full: generate-terraform
	@make -C infra/ provision-full env=$(env)

refresh-api: generate-terraform build-api
	@make -C infra/ provision env=$(env) layer=api

start: start-front
start-app:
	@make -C app/ start env=$(env)
start-front:
	@make -C front/ start env=$(env)

test: test-git test-front test-app test-api
test-api:
	@make -C api/ test
test-app:
	@make -C app/ test
test-front:
	@make -C front/ test
test-git:
	@true

.PHONY: all \
		build build-api build-app build-front build-post-provision build-pre-plan build-pre-provision \
		deploy deploy-app deploy-front \
		generate generate-env-local generate-env-local-api generate-env-local-app generate-env-local-front generate-terraform \
		infra-destroy infra-init infra-init-full infra-init-full-upgrade infra-init-upgrade infra-plan infra-refresh infra-update \
		install install-api install-app install-front install-git install-root install-terraform \
		list-layers \
		output output-json \
		outputs \
		pre-install pre-install-api pre-install-app pre-install-front pre-install-git pre-install-root \
		provision provision-full \
		refresh-api \
		start start-app start-front \
		test test-api test-app test-front test-git
prefix ?= myprefix
env ?= dev
layer ?= "all"
layers ?= $(shell AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) list-layers)
AWS_PROFILE ?= $(prefix)-$(env)

all:
	@true

apply:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) apply $(layer)

destroy:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) destroy $(layer)

generate:
	@../node_modules/.bin/tfgen ./config.json layers environments

get:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) get $(layer)

init:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) init $(layer)
init-full:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) init-full $(layer)
init-full-upgrade:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) init-full-upgrade $(layer)
init-upgrade:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) init-upgrade $(layer)

list-layers:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) list-layers

output:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) output $(layer)
output-json:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) output-json $(layer)

outputs:
	@mkdir -p ../outputs/$(env)
	@$(foreach l,$(layers),echo "[$(env)] Saving outputs of layer '$(l)'..." && AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) output-json $l > ../outputs/$(env)/$(l).json;)

plan:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) plan $(layer)

pre-install:
	@true

provision: init sync
provision-full: init-full sync-full

refresh:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) refresh $(layer)

sync:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) sync $(layer)
sync-full:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) sync-full $(layer)

update:
	@AWS_SDK_LOAD_CONFIG=1 AWS_PROFILE=$(AWS_PROFILE) ../node_modules/.bin/tflayer $(env) update $(layer)

.PHONY: all \
		apply \
		destroy \
		generate \
		get \
		init init-full init-full-upgrade init-upgrade \
		list-layers \
		output output-json \
		outputs \
		plan \
		pre-install \
		provision provision-full \
		refresh \
		sync sync-full \
		update
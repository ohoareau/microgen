var1 ?= 12
var2 = 13

all: target1

build-custom:
	@yarn --silent build

target1: target1-sub-a target1-sub-b
target1-sub-a:
	@echo "Hello from Target1SubA!"
target1-sub-b:
	@echo "Hello from"
	@echo "Target1SubB!"

.PHONY: all \
		build-custom \
		target1 target1-sub-a target1-sub-b
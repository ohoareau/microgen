prefix ?= myprefix

export a
export B_C

all: install

install:
	@echo "Hello world!"

.PHONY: all \
		install

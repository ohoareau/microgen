var2 = 14

all:
	@true

build:
	@true
build-a:
	@true
build-b:
	@echo "Overriden!"
build-c:
	@true

install-dummy:
	@yarn --silent lerna bootstrap --scope @dummy

.PHONY: all \
		build build-a build-b build-c \
		install-dummy
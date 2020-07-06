all:
	@true

build:
	@true
build-a:
	@true
build-b:
	@true
build-c:
	@true

install-dummy:
	@yarn --silent lerna bootstrap --scope @dummy

.PHONY: all \
		build build-a build-b build-c \
		install-dummy
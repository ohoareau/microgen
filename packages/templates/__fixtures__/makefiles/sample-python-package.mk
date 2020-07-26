env ?= dev
pypi_repo = mypypirepo

all: install

build: clean
	@source venv/bin/activate && python3 setup.py sdist bdist_wheel

clean:
	@rm -rf dist
clean-venv:
	@virtualenv venv

create-venv:
	@virtualenv venv

deploy:
	@source venv/bin/activate && twine upload --repository $(pypi_repo) dist/*

install:
	@source venv/bin/activate && pip3 install -r requirements.txt
install-test:
	@source venv/bin/activate && pip3 install -r requirements.txt -i https://test.pypi.org/simple

pre-install: create-venv

system-install:
	@python3 -m pip install --upgrade pip
	@python3 -m pip install --upgrade setuptools wheel twine

test:
	@source venv/bin/activate && python -m unittest tests/*.py -v
test-ci:
	@source venv/bin/activate && python -m unittest tests/*.py -v
test-cov:
	@source venv/bin/activate && python -m unittest tests/*.py -v

venv-activate:
	@. venv/bin/activate
venv-deactivate:
	@deactivate

.PHONY: all \
		build \
		clean clean-venv \
		create-venv \
		deploy \
		install install-test \
		pre-install \
		system-install \
		test test-ci test-cov \
		venv-activate venv-deactivate
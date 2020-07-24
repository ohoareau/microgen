# MYPROJECT

## Introduction

This repository is a mono-repository that contains all the code for the platform.



## Our Team's 10 Commandments

1. Always from the root of this repo, work you will
2. Always after git-pulling, executing `make` you will
3. Never on the `develop`, `release`, `master` and `prod` branches, directly committing you will 
4. Never on `aws.amazon.com/console` manually modifying resources you will
5. As often as possible, during the day, git-rebase your feature-branch you will
6. Just after creating your new feature branch, a new `WIP` Pull-Request create you will 
7. ?
8. ?
9. ?
10. ?


## Pre-requisites

Ensure you have the following installed on your local environment, with a versions >= to those displayed:

### Operating System(s)

Whereas you are free to choose the Operating System you want to work on this project, we recommend the following that are compatible with our dev workflow:

* `macOS` (with XCode Command Line Tools installed)
* `Linux` (apt-based)

We do not recommend Windows as an Operating System for working on this project.

### Terminal/Console

Whereas a Terminal/Console is required to work on this project, you can choose whatever professional Terminal/Console program you want. Here is a short list of proposed ones:

* [iTerm2](https://www.iterm2.com/) (macOS only)
* [Linux console](https://en.wikipedia.org/wiki/Linux_console) (Linux only)

We do not recommend Windows-based Terminal/Console for working on this project.

### IDE (Integrated Development Environment)

Whereas an IDE is required to work on this project, you can choose whatever professional IDE to work with Javascript you want. Here is a short list of proposed ones:

* Free: [Microsoft Visual Studio Code](https://code.visualstudio.com/)
* Commercial: [JetBrains WebStorm](https://www.jetbrains.com/fr-fr/webstorm/)

We do not recommend Text-only Editor (Sublime-Text, TextEdit, vi, vim, emacs, ...) for working on this project.

### Required CLI Tools & Settings




## Installation

    make pre-install
    make


## Development (local)

### Install dependencies

#### All dependencies

    make

#### Project specific dependencies

    make install-root


### Execute tests

#### All tests

    make test

#### Project specific tests



### Start local server (hot-reloaded)

#### Default local server (front only)

    make start

#### Project specific local service



### Build production-ready directory

#### All builds

By default if no ` env=<env>` is provided on the command line, the default value is considered to be `env=dev`:

    make build

...or to specify a target env explicitly:

    make build env=dev
    make build env=test
    make build env=preprod
    make build env=prod


#### Project specific build



### Deploy to an environment

As a pre-requisite, you need to have build the production-ready version of the website targeted for the specified `env` (`dev|test|preprod|prod`)

    make
    make test
    make build env=<env>

where `<env>` must be one of the values: `dev`, `test`, `preprod`, `prod`.

The first time you want to deploy from your local environment, you need to initialize terraform locally:

    make infra-init env=<env>

After having built the production-ready static files, you can then execute:

    make provision env=<env>
    make deploy env=<env>

The `provision` command will synchronize the infrastructure resources (on AWS) with the ones described in the Terraform configuration (*.tf files located in the `./infra/environments/<env>/` directory).

The `deploy` command will send and synchronize remote s3 bucket (containing static files served by the CloudFront CDN) with your local `./<deployable-project>/public/` or `./<deployable-project>/build/` directory, and then trigger a cache invalidation on the CloudFront distribution.
You can deploy a single project by executing one of these commands:




## Appendices

### Optional Installation Procedures


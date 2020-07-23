# MYPROJECT

## Introduction

This repository is a mono-repository that contains all the code for the platform.

This mono-repo is composed of several technical sub-projects:

* `project1` (desc of project1)
* `project2` (desc of project2)
* `project3` (desc of project3)

The noticeable technologies used in this repository are (not exhaustive):

* [techno1](https://techno1.com)
* [techno2](https://techno2.com)
* [techno3](https://techno3.com)
* [techno4](https://techno4.com)


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

#### make

    $ make -v
    GNU Make 3.81
    Copyright (C) 2006  Free Software Foundation, Inc.
    This is free software; see the source for copying conditions.
    There is NO warranty; not even for MERCHANTABILITY or FITNESS FOR A
    PARTICULAR PURPOSE.

    This program built for i386-apple-darwin11.3.0

if not installed, see [Make installation procedure](#install-make).
#### Git

    $ git --version
    git version 2.24.2 (Apple Git-127)

if not installed, see [Git installation procedure](#install-git)
#### Hub (aliased to git)

    $ git --version
    git version 2.24.2 (Apple Git-127)
    hub version 2.14.2

if not installed, see [Hub installation procedure](#install-hub)
#### SSH (Personal SSH Keys added on GitHub)

    $ ssh git@github.com
    PTY allocation request failed on channel 0
    Hi xxxx! You've successfully authenticated, but GitHub does not provide shell access.
    Connection to github.com closed.

if not installed, see [SSH installation procedure](#install-ssh)
#### NVM

    $ nvm --version
    0.35.3

if not installed, see [NVM installation procedure](#install-nvm).
#### Node

    $ node -v
    v14.3.0

if the displayed version is older:

    $ nvm use
    Found '/Users/.../site-front/.nvmrc' with version <14.3.0>
    Now using node v14.3.0 (npm v6.14.5)

if not installed, see [Node installation procedure](#install-node).
#### NPM

    $ npm -v
    6.14.5

if not installed, see [NPM installation procedure](#install-npm).
#### ~/.npmrc (for GitHub Packages Private Registry)

    $ npm whoami --registry https://npm.pkg.github.com
    <your-github-login>

if not installed, see [.npmrc installation procedure](#install-npmrc).
#### Yarn

    $ yarn -v
    1.22.4

if not installed, see [Yarn installation procedure](#install-yarn).
#### tfenv

    $ tfenv -v
    tfenv 1.0.2

if not installed, see [tfenv installation procedure](#install-tfenv).
#### Terraform

    $ terraform -v
    Terraform v0.12.26

if not installed, see [Terraform installation procedure](#install-terraform).
#### ~/.terraformrc (for Terraform Cloud)

    $ cat ~/.terraformrc
    credentials "app.terraform.io" {
        token = "XXXXXXXXXX..."
    }

if not installed, see [Terraformrc installation procedure](#install-terraformrc).
#### aws (CLI)

    $ aws --version
    aws-cli/2.0.10 Python/3.8.2 Darwin/19.4.0 botocore/2.0.0dev14

if not installed, see [AWS CLI installation procedure](#install-aws-cli).
#### AWS Profiles (for your IAM user)

    $ AWS_PROFILE=xxxxxxxx-dev aws s3 ls
    2020-06-03 19:21:42 xxxx
    2020-06-03 18:37:03 yyyy


    $ AWS_PROFILE=xxxxxxxx-test aws s3 ls
    2020-06-03 19:21:42 xxxx
    2020-06-03 18:37:03 yyyy


    $ AWS_PROFILE=xxxxxxxx-preprod aws s3 ls
    2020-06-03 19:21:42 xxxx
    2020-06-03 18:37:03 yyyy


    $ AWS_PROFILE=xxxxxxxx-prod aws s3 ls
    2020-06-03 18:48:01 zzzz


if not installed, see [AWS Profiles installation procedure](#install-aws-profiles).

## Installation

    make pre-install
    make


## Development (local)

### Install dependencies

#### All dependencies

    make

#### Project specific dependencies

    make install-root
    make install-project1
    make install-project2
    make install-project3


### Execute tests

#### All tests

    make test

#### Project specific tests

    make test-project1
    make test-project2
    make test-project3


### Start local server (hot-reloaded)

#### Default local server (front only)

    make start

#### Project specific local service

    make start-project2
    make start-project3


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

    make build-project1 env=<env>
    make build-project2 env=<env>
    make build-project3 env=<env>


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

## Appendices

### Optional Installation Procedures

#### Install Make

`make` should be already installed on MacOS. For linux installation, search for `install make <name-of-distro>` on google ;)

##### Acceptance test

    $ make -v

... should display the version of Make.
#### Install Git

[Follow instructions for your operating system](https://git-scm.com/downloads)

##### Acceptance test

    $ git --version

... should display the version of Git.
#### Install Hub

[Follow instructions for your operating system](https://hub.github.com/)

To be able to use `hub` as a transparent wrapper of `git`, add the following to your `~/.bash_profile` / `~/.zshrc file` or equivalent:

    $ eval "$(hub alias -s)"

##### Acceptance test

    $ git -v

... should display the version of `Git + Hub`.
#### Install SSH

An SSH client should already being installed on your system. If not, please add an ssh client using the official installation method for your operating system.
Then, ensure the following is displaying the SSH client version:

    $ ssh -V
    OpenSSH_8.1p1, LibreSSL 2.7.3

You need to have a personal ssh key in order to access th GitHub restricted projects of your organization.
If not yet set on your local environment and on your GitHub account, please [follow instructions for your operating system](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account)

##### Acceptance test

    $ ssh git@github.com

... should display a GitHub ssh server greeting with your username.
#### Install NVM

[Follow instructions for your operating system](https://github.com/nvm-sh/nvm)

##### Acceptance test

    $ nvm --version

... should display `0.35.3` or a higher version.
#### Install Node

You have to install NVM first. Then:

    $ nvm install
    $ nvm use

##### Acceptance test

    $ node -v

... should display `v14.3.0` or a higher version.
#### Install NPM

You have to install NVM and NODE first. Then:

    $ nvm install
    $ nvm use

##### Acceptance test

    $ npm -v

... should display `6.14.5` or a higher version.
#### Install NPMRC

Ensure first to have create a GitHub Personal Token, with scope package read/write enabled, and pick it up.

Then, add the following content to your `~/.npmrc` file (create it if not exist):

    //npm.pkg.github.com/:_authToken=<your-personal-github-token-with-packages-read-write-scope-enabled>


##### Acceptance test

    $ npm whoami --registry https://npm.pkg.github.com

... should display your personal GitHub username.
#### Install tfenv

[Follow instructions for your operating system](https://github.com/tfutils/tfenv)

##### Acceptance test

    $ tfenv -v

... should display `1.0.2` or a higher version.
#### Install Terraform

You have to install tfenv first. Then:

    $ tfven install

It will install the Terraform version specified in the `./.terraform-version` file.

##### Acceptance test

    $ terraform -v

... should display `0.12.26` or a higher version.
#### Install Yarn

[Follow instructions for your operating system](https://classic.yarnpkg.com/fr/docs/install)

##### Acceptance test

    $ yarn -v

... should display `1.22.4` or a higher version.
#### Install Terraformrc

* if not yet provided to you, request an access to app.terraform.io to the Team Tech Lead
* browse to https://app.terraform.io
* log in with your account
* go to upper right corner, click on your avatar
* click User Settings link
* go to Tokens menu item in the left
* if not yet created, create a new personal Token and pick it up (so-called `the token`)

Then add the following content to your `~/.terraformrc` file (create it if not exist):

    credentials "app.terraform.io" {
        token = "the token"
    }

if needed, here is the [Official Terraform Credentials documentation](https://www.terraform.io/docs/commands/cli-config.html#credentials-1)

##### Acceptance test

    $ cat ~/.terraformrc
    credentials "app.terraform.io" {
        token = "XXXXXXXXXX..."
    }

#### Install AWS CLI

[Follow instructions for your operating system](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

##### Acceptance test

    $ aws --version

... should display `2.0.10` or a higher version.
#### Install AWS Profiles

AWS CLI is using configuration files located in your home directory (as one of its method) to authenticate your api requests when using the tool.
There are 2 important files:

* `~/.aws/credentials`: contains your personal credentials
* `~/.aws/config`: contains additional profiles (so-called roles to assume)

To set your profiles, follow these steps:

* ensure you have a personal IAM user and proper credentials that were provided to you (a so-called `Access Key Id` and `Secret Access Key`). These are your personal API credentials that you must not share with others. If not, please contact the Team Tech Lead.
* ensure you have the following content to your `~/.aws/config` file (or create it with that content):


    [profile xxxxxxxx-dev]
    role_arn=arn:aws:iam::XXXXXXXXXXXX:role/OrganizationAccountAccessRole
    source_profile=xxxxxxxx

    [profile xxxxxxxx-test]
    role_arn=arn:aws:iam::XXXXXXXXXXXX:role/OrganizationAccountAccessRole
    source_profile=xxxxxxxx

    [profile xxxxxxxx-preprod]
    role_arn=arn:aws:iam::XXXXXXXXXXXX:role/OrganizationAccountAccessRole
    source_profile=xxxxxxxx

    [profile xxxxxxxx-prod]
    role_arn=arn:aws:iam::YYYYYYYYYYYY:role/OrganizationAccountAccessRole
    source_profile=xxxxxxxx


* ensure you have the following content (at least) in your `~/.aws/credentials` file (or create it with that content):


    [xxxxxxxx]
    aws_access_key_id = <your-AKI-here>
    aws_secret_access_key = <your-SAK-here>


##### Acceptance test

    AWS_PROFILE=xxxxxxxx-dev aws s3 ls

... should display a non empty list of s3 buckets for DEV environment.

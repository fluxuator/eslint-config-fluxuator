# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
VIOLET := $(shell tput -Txterm setaf 5)
WHITE  := $(shell tput -Txterm setaf 7)
RESET  := $(shell tput -Txterm sgr0)

all: help

help: ## Show this help.
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<task>${RESET} ${VIOLET}ARGS="foo bar"${RESET}'
	@echo ''
	@echo 'Targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-20s\033[0m %s\n", $$1, $$2}'
.PHONY: help

#
# CLI Command definitions
#
lint: ## Runs eslint over the project
	@yarn lint
.PHONY: lint

lint-staged: ## Runs eslint for staged files
	@yarn lint-staged
.PHONY: lint

publish: ## Publish package to NPM registry
	@yarn publish --strict-semver --non-interactive
.PHONY: publish


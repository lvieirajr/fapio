ORGANIZATION=lvieirajr
PROJECT=fapio
BACKEND_IMAGE_REPOSITORY=$(ORGANIZATION)/$(PROJECT)-backend
FRONTEND_IMAGE_REPOSITORY=$(ORGANIZATION)/$(PROJECT)-frontend
SERVICE=backend


# ======================================================================================
# Help
# ======================================================================================
.PHONY: help
help:
	@echo "Help:"
	@echo " help                            Display this help message"

	@echo "\nDocker:"
	@echo " docker-run                      Run a command inside the docker container"
	@echo " docker-build                    Build the release docker image"
	@echo " docker-build-dev                Build the development docker image"
	@echo " docker-bash                     Open a bash session using the docker image"

	@echo "\nDocker Compose:"
	@echo " run                             Run a command inside the compose service"
	@echo " debug                           Start the services on debug mode"
	@echo " start                           Start all services"
	@echo " stop                            Stop all services"
	@echo " bash                            Open a bash session inside the compose service"

	@echo "\nLinting:"
	@echo " black                           Check for code formatting issues"
	@echo " black-fix                       Fixes code formatting issues"
	@echo " ruff                            Runs a general code linting"
	@echo " ruff-fix                        Fix issues found by the linter"

	@echo "\nTesting:"
	@echo " tests                           Run the full test suite"
	@echo " test-coverage                   Run the full test suite with coverage"

	@echo "\nType checking:"
	@echo " mypy                            Run static type checker"

	@echo "\nVulnerability scanning:"
	@echo " safety                          Check for security vulnerabilities in third party libraries"


# ======================================================================================
# Docker
# ======================================================================================
.PHONY: docker-run
docker-run:
	@docker run -it --rm -v "$(shell pwd):/app/" $(options) $(BACKEND_IMAGE_REPOSITORY) $(cmd)

.PHONY: docker-build-backend
docker-build:
	@docker build --rm $(options) --tag $(BACKEND_IMAGE_REPOSITORY) ./backend/

.PHONY: docker-build-dev
docker-build-dev:
	@$(MAKE) docker-build options="--target development"


# ======================================================================================
# Docker Compose
# ======================================================================================
.PHONY: run
run:
	@docker-compose run --rm $(options) $(SERVICE) $(cmd)

.PHONY: debug
debug:
	@$(MAKE) run options="--service-ports"

.PHONY: start
start:
	@docker-compose up --remove-orphans

.PHONY: stop
stop:
	@docker-compose down --remove-orphans


# =====================
# Linting
# =====================
.PHONY: black
black:
	@$(MAKE) docker-run cmd="black --check --diff ./backend/"

.PHONY: black-fix
black-fix:
	@$(MAKE) docker-run cmd="black ./backend/"

.PHONY: ruff
ruff:
	@$(MAKE) docker-run cmd="ruff --no-cache ./backend/"

.PHONY: ruff-fix
ruff-fix:
	@$(MAKE) docker-run cmd="ruff --fix ./backend/"


# ======================================================================================
# Testing
# ======================================================================================
.PHONY: tests
tests:
	@$(MAKE) docker-run cmd="pytest $(args)"

.PHONY: test-coverage
test-coverage:
	@$(MAKE) tests args="$(TESTS_PATH) --cov=$(SOURCE_PATH) --cov-branch --cov-report term-missing:skip-covered"


# ======================================================================================
# Type checking
# ======================================================================================
.PHONY: mypy
mypy:
	@$(MAKE) docker-run cmd="mypy -p $(PROJECT)"


# ======================================================================================
# Vulnerability Scanning
# ======================================================================================
.PHONY: safety
safety:
	@$(MAKE) docker-run cmd="safety check -r requirements/release.txt -r requirements/development.txt --ignore 39642"

# ======================================================================================
# Base Image - Python 3.10 Slim
# ======================================================================================
FROM python:3.10-slim as base

# Working directory
WORKDIR /app/

# Environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONPATH /app/

# Create a new user to avoid using root
RUN addgroup --system fapio && adduser --system --ingroup fapio fapio && chown fapio:fapio ./

# Install general dependencies
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
    build-essential \
    && apt-get upgrade --no-install-recommends -y \
    && apt-get purge --auto-remove -y -o APT::AutoRemove::RecommendsImportant=false -o APT::AutoRemove::SuggestsImportant=false \
    && apt-get autoremove -y \
    && apt-get clean autoclean \
    && rm -rf /var/lib/{apt,dpkg,cache,log}/ \
    && pip install --upgrade --no-cache-dir pip setuptools poetry \
    && poetry config virtualenvs.create false

# Copy configuration files
COPY --chown=fapio:fapio ./pyproject.toml ./poetry.lock* /app/


# ======================================================================================
# Release Image
# ======================================================================================
FROM base as release

# Install only core dependencies
RUN poetry install --no-root --no-dev

# Copy the app
COPY --chown=fapio:fapio ./ /app/

# Set the default user
USER fapio


# ======================================================================================
# Development Image
# ======================================================================================
FROM base as development

# Install all dependencies
RUN poetry install --no-root

# Copy the app
COPY --chown=fapio:fapio ./ /app/

# Set the default user
USER fapio

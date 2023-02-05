#! /usr/bin/env bash

set -ex

uvicorn app.main:app \
    --host 0.0.0.0 \
    --port $PORT

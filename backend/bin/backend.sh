#! /usr/bin/env bash

set -ex

gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --workers 2 --max-requests 10 --bind 0.0.0.0:$PORT

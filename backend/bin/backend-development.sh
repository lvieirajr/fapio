#! /usr/bin/env bash

set -ex

uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 443 \
    --ssl-keyfile certificates/localhost.lvieira.com-key.pem \
    --ssl-certfile certificates/localhost.lvieira.com.pem \
    --reload

#!/bin/bash

envsubst < assets/env.template.js > assets/env.js

exec /docker-entrypoint.sh "$@"

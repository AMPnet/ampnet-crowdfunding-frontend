#!/bin/sh

echo "Running envsubst on assets/env.template.js to assets/env.js"
envsubst < assets/env.template.js > assets/env.js

exec /docker-entrypoint.sh "$@"

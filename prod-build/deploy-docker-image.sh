#!/bin/bash

APP_VERSION=$(npm run env | grep ^npm_package_version= | cut -d "=" -f 2)
IMAGE_NAME="ampnet/ampnet-crowdfunding-frontend:${APP_VERSION}"

docker build --no-cache -f prod-build/Dockerfile -t "${IMAGE_NAME}" .
docker image push "${IMAGE_NAME}"

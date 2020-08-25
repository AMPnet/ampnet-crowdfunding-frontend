#!/bin/bash

# Script for deploying experimental versions of the app from a local machine.
# NOTICES:
# 1. Don't forget to change version number in package.json (e.g. 0.1.0-pre1).
# 2. Don't forget to make production build before running this script.

APP_VERSION=$(npm run env | grep ^npm_package_version= | cut -d "=" -f 2)
IMAGE_NAME="ampnet/ampnet-crowdfunding-frontend:${APP_VERSION}"

docker build --no-cache -f prod-build/Dockerfile -t "${IMAGE_NAME}" .
docker image push "${IMAGE_NAME}"

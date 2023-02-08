#!/usr/bin/env zsh
set -e

ROOT=$(git rev-parse --show-toplevel)

cd $ROOT

mkdir -p dist
cp -r src/* dist/
cp -r prod-config/images/* dist/images/
jq --slurp add src/manifest.json prod-config/manifest.json > dist/manifest.json

cd dist
zip -r ../copiest-bundle.zip *
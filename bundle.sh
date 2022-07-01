#!/usr/bin/env zsh
set -e

ROOT=$(git rev-parse --show-toplevel)

cd $ROOT/src
zip -r ../copiest-bundle.zip *
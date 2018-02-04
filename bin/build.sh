#!/bin/bash

set -e

source bin/shared.sh

marquee "Lint Step"
yarn lint

marquee "Transpile Step"
yarn tsc

marquee "Unit Test Step"
yarn test

marquee "Package Step"
yarn pack

mkdir -p target/dist
mv *.tgz target/dist
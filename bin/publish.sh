#!/bin/bash

set -e

source bin/shared.sh

function get_npm_tag {
    # Figure out whether we need to tag the package with latest or a pre-release tag
    tar -zxf *.tgz package/package.json

    package_version=$(node -p "require('./package/package.json').version")
    prerelease_suffix=${package_version##*-}

    if [ "$package_version" = "$prerelease_suffix" ]; then
        npm_tag=latest
    else
        npm_tag=${prerelease_suffix%%.*}
    fi

    echo $npm_tag
}

marquee "Write NPM Credentials"
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
echo "done"

marquee "Establish Github Host Identity"
ssh -T -o StrictHostKeyChecking=no git@github.com

cd target/dist

marquee "Determine NPM Tag"
npm_tag=$(get_npm_tag)
echo $npm_tag

marquee "NPM Publish"
npm publish *.tgz --tag $npm_tag

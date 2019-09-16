#!/bin/bash

# Script to deploy frontend in server.

# In order to checkout a specific branch, you must do the following before running the script:
# export BRANCH="<branch_name>"
if [[ -z "${BRANCH}" ]]; then
	BRANCH=master
fi
git pull origin ${BRANCH}

NG_FILE=$(which ng)
if [[ -z "${NG_FILE}" ]]; then
	npm install -g @angular/cli
fi

npm install

# Execute build to prod
node --max_old_space_size=1096 ./node_modules/@angular/cli/bin/ng build --prod true --progress true --verbose true

# Copies the dist folder
# cp -Rf ./dist /var/www/trouw-nutrition.com/html
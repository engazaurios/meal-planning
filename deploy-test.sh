#!/bin/bash

# Script to deploy frontend in server.

function execute_in_server() {
	ssh engazaurio@67.205.147.22 "${1}"	
}

# In order to checkout a specific branch, you must do the following before running the script:
# export BRANCH="<branch_name>"

rm package-lock.json || true

# Checks if NG is running.
NG_FILE=$(which ng)
if [[ -z "${NG_FILE}" ]]; then
	npm install -g @angular/cli
fi

# In order to install packages, you must do the following before running the script:
# export INSTALL_PACKAGES=yes

# Installs packages
if [[ ! -z "${INSTALL_PACKAGES}" ]]; then
	echo "---> Installing packages."
	npm install
fi

echo "---> Starting to build production environment."
# Execute build to prod
ng build --prod true --progress true

echo "---> Cleaning directories."
# Creates the directory if doesn't exist.
execute_in_server 'rm -rf /var/www/test.trouw-nutrition.com/ && mkdir -p /var/www/test.trouw-nutrition.com/html/'

echo "---> Copying files to remote."
# Copies all the files to specified directory
scp -r dist/meal-planning/* engazaurio@67.205.147.22:/var/www/test.trouw-nutrition.com/html

echo "---> Removing ./dist folder"
rm -rf dist

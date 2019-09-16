#!/bin/bash

# Script to deploy frontend in server.

# In order to checkout a specific branch, you must do the following before running the script:
# export BRANCH="<branch_name>"
if [[ -z "${BRANCH}" ]]; then
	BRANCH=master
fi
git checkout ${BRANCH}
git pull origin ${BRANCH}

# Checks if NG is running.
NG_FILE=$(which ng)
if [[ -z "${NG_FILE}" ]]; then
	npm install -g @angular/cli
fi

# Installs packages
npm install

# Execute build to prod
ng build --prod true --progress true --verbose true

# Creates the directory if doesn't exist.
ssh engazaurio@67.205.147.22 'mkdir -p /var/www/trouw-nutrition.com/html/'
# Removes backup folder and creates it again.
ssh engazaurio@67.205.147.22 'rm -rf ~/backup/meal-planning && mkdir -p ~/backup/meal-planning'
# Moves all the content to backup
ssh engazaurio@67.205.147.22 'mv /var/www/trouw-nutrition.com/html/* ~/backup/meal-planning'

# Copies all the files to specified directory
scp -r dist/meal-planning/* engazaurio@67.205.147.22:/var/www/trouw-nutrition.com/html

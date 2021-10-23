#!/bin/bash
npm ci --prefer-offline
git config include.path ../.gitconfig
./node_modules/.bin/git-hooks-wrapper init


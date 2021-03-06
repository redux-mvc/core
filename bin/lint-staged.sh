#!/bin/bash

errors=false

for file in $(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(js|jsx)$')
do
    git show ":$file" | node_modules/.bin/eslint --stdin --stdin-filename "$file" # we only want to lint the staged changes, not any un-staged changes
    if [ $? -ne 0 ]; then
        errors=true
    fi
done

if [ $errors = true ]; then
    echo "ESLint failed on staged file '$file'. Please check your code and try again. You can run ESLint manually via npm run eslint."
    exit 1 # exit with failure status
fi

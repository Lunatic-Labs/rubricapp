#!/bin/sh
git config merge.regen-lockfile.name "Regenerate lockfile"
git config merge.regen-lockfile.driver "npm install --package-lock-only && cp package-lock.json %A"
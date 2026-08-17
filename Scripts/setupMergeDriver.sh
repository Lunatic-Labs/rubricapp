#!/bin/sh

git config merge.regen-lockfile.name "Regenerate lockfile"

git config merge.regen-lockfile.driver \
  'sh -c "cd FrontEndReact && npm install && cp package-lock.json \"$1\"" _ %A'
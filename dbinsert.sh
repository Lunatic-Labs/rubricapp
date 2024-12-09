#!/bin/bash

set -e

function help() {
    echo "This script is inteded to be ran *while* the backend is running in Docker."
    echo -e "It will insert a new user into the DB so you don't have to do it in the website.\n"
    echo "dbinsert.sh <OPTION>"
    echo "OPTION:"
    echo "  --new-student   - insert a new student into the DB"
    echo "  --new-admin     - insert a new admin into the DB"
    exit 1
}

if [ $# -le 0 ]; then
    help
fi

docker compose exec backend python dbinsert.py "$@"

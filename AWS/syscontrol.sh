#!/bin/bash

set -e

# Available options to run this script with.
# To add a new one, put it here and update
# the `case` statement located in the `driver`
# section. Also be sure to put the new option
# in the `usage` function.
FRESH="--fresh"
INSTALL="--install"
HELP="--help"
REPO="--repo"

# Used to keep track of logs. At the
# end of execution of this script, this
# will be put into a file called `syscontrol.log`.
LOGSTR=""

# The name of the log file to log all
# messages to.
LOGFILE="./syscontrol.log"

# List of programs to check/install.
# Add to this list when a new program
# is needed. No further action is needed.
DEPS='python3
      git
      npm
      redis-server
      python3-pip
      python3-gdbm'

# Write the `LOGSTR` to `LOGFILE`.
function write_logs() {
    echo -e "$LOGSTR" > "$LOGFILE"
}

# Pretty-prints a major action to stdout.
function major() {
    echo "========== $1 =========="
}

# Prints a log message to stdout. Appends the
# `msg` variable to `logstr`. Use this function
# for general IO messages.
function log() {
    local msg="$1"
    LOGSTR+="$msg\n"
    echo "$msg"
}

# Prints a panic message to stdout. Appends the
# `msg` variable to `logstr`. Exits with 1. Use
# this function when an error is encountered.
function panic() {
    local msg="$1"
    LOGSTR+="$msg\n"
    echo "[ERR] $msg"
    write_logs
    exit 1
}

# Displays the usage information.
function usage() {
    echo "Usage:"
    echo "  ./syscontrol <OPTION>"
    echo "  where OPTION is one of:"
    echo "    $HELP    :: prints this message"
    echo "    $FRESH   :: sets up entire infrastructure"
    echo "    $INSTALL :: only installs dependencies"
    echo "    $REPO    :: updates the repository"
    exit 1
}

# Checks if `prog` is installed locally
# on the system. Returns 0 on success
# and 1 on failure.
function is_installed() {
    local prog="$1"
    if command -v "$prog" &> /dev/null ;
    then
        return 0
    else
        return 1
    fi
}

# Updates installed packages.
function update_pkgs() {
    major "updating/upgrading packages"
    sudo apt update
    sudo apt upgrade -y
}

# Install all requirements needed.
function install_reqs() {
    update_pkgs
    major "installing dependencies"
    sudo apt install $DEPS -y
}

function setup_environment() {
    panic "setup_environment unimplemented"
    function configure_nginx() {
        panic "configure_nginx unimplemented"
    }
}

# Driver.

# Check for arguments.
if [ "$#" -eq 0 ];
then
    usage
fi

# Add new options here.
case "$1" in
    "$FRESH")
        panic "$FRESH unimplemented"
        update_pkgs
        install_reqs
        setup_environment
        ;;
    "$INSTALL")
        install_reqs
        ;;
    "$REPO")
        panic "$REPO unimplemented"
        ;;
    "$HELP")
        usage
        ;;
    *)
        panic "unknown option: $1"
        ;;
esac

write_logs

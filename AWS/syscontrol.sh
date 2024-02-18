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
      build-essential
      libssl-dev
      libffi-dev
      git
      npm
      redis-server
      python3-pip
      python3-gdbm
      python3-dev
      python3-setuptools
      python3-venv
      ufw
      nginx'

PROD_NAME="POGIL_PRODUCTION"
VENV_DIR="/home/$USER/$PROD_NAME/pogilenv/"
PROJ_DIR="/home/$USER/$PROD_NAME/rubricapp/"
SERVICE_NAME=rubricapp.service

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

# Install all requirements needed.
function install_deps() {
    major "updating/upgrading packages"
    sudo apt update
    sudo apt upgrade -y
    major "installing dependencies"
    sudo apt install $DEPS -y
}

function configure_nginx() {
    major "configuring nginx"
    panic "configure_nginx unimplemented"
}

function configure_ufw() {
    major "configuring ufw"
    sudo ufw allow 5000
    sudo ufw allow 3000
    sudo ufw allow 443
    sudo ufw allow 80
    sudo ufw allow 22
}

function enter_venv() {
    major "entering python virtual environment"
    source ./pogilenv/bin/activate
}

function exit_venv() {
    major "exiting python virtual environment"
    deactivate
}

function setup_venv() {
    major "setting up python virtual environment"

    local venv_dir=pogilenv
    if [ ! -d "$venv_dir" ]; then
        python3 -m venv "$venv_dir"
    fi

    source "$venv_dir/bin/activate"
}

function configure_gunicorn() {
    major "installing and configuring gunicorn"
    panic "configure_gunicorn unimplemented"
    sudo cp "$PROJ_DIR/AWS/$SERVICE_NAME" "/etc/systemd/system/$SERVICE_NAME"
}

function install_pip_reqs() {
    setup_venv
    major "installing pip requirements"
    pip3 install wheel
    cd ./BackEndFlask
    pip3 install -r requirements.txt
    cd -
}

function setup_proj() {
    major "setting up production directory"
    local old_prod_dir=$(pwd)
    cd ~
    mkdir -p "$PROD_NAME"
    cp -r "$old_prod_dir" "$PROD_NAME"
    cd "./$PROD_NAME"
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
        install_deps
        setup_proj
        install_pip_reqs
        configure_gunicorn
        configure_nginx
        configure_ufw
        ;;
    "$INSTALL")
        panic "$INSTALL unimplemented"
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

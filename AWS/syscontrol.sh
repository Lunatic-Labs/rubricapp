#!/bin/bash

set -e

# Available options to run this script with.
# To add a new one, put it here and update
# the `case` statement located in the `driver`
# section. Also be sure to put the new option
# in the `usage` function.
FRESH="--fresh"
CONFIGURE="--configure"
INSTALL="--install"
HELP="--help"
UPDATE="--update"
RUN="--run"

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
VENV_DIR="/home/$USER/$PROD_NAME/pogilenv"
PROJ_DIR="/home/$USER/$PROD_NAME/rubricapp"
SERVICE_NAME="rubricapp.service"

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
    echo "    $HELP      :: prints this message"
    echo "    $FRESH     :: sets up entire infrastructure"
    echo "    $CONFIGURE :: configure pip, gunicorn, nginx..."
    echo "    $RUN       :: run the application"
    echo "    $UPDATE    :: updates the repository"
    echo "    $INSTALL   :: only installs dependencies"
    exit 1
}

function kill_pids() {
    local port=$1
    local pids=$(lsof -ti :$port)

    # If PIDs are not empty, kill them.
    if [ -n "$pids" ]; then
        kill $pids
    fi
}

function start_bgproc() {
    local dir=$1
    local proc=$2
    cd $dir
    $proc &
    cd -
}

function update_repo() {
    major "updating repo"
    git fetch
    if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/master)" ];
    then
        # Kill PIDs that are launched on port 5000
        # and 3000. These are launched by python3
        # and npm.
        kill_pids 5000
        kill_pids 3000

        # Get the most up-to-date version of the repo.
        git pull origin master

        # Start the services back up in the background.
        start_bgproc "$PROJ_DIR/BackEndFlask" "python3 ./setupEnv.py -is"
        start_bgproc "$PROJ_DIR/FrontEndReact" "npm start"
    fi
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
    source "$VENV_DIR"
}

function exit_venv() {
    major "exiting python virtual environment"
    deactivate
}

function configure_gunicorn() {
    major "installing and configuring gunicorn"
    sudo cp "$PROJ_DIR/AWS/$SERVICE_NAME" "/etc/systemd/system/$SERVICE_NAME"
}

function setup_venv() {
    log "settup up the virtual environment"
    if [ ! -d "$VENV_DIR" ]; then
        python3 -m venv "$VENV_DIR"
    fi
}

function install_pip_reqs() {
    setup_venv
    enter_venv

    major "installing pip requirements"

    cd "$PROJ_DIR/BackEndFlask"

    pip3 install wheel
    pip3 install -r requirements.txt

    exit_venv
}

function setup_proj() {
    major "setting up production directory"

    cd ../; local old_pwd="$(pwd)"
    cd ~; mkdir -p "$PROD_NAME"
    cp -r "$old_pwd" "$PROD_NAME/"
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
        install_deps
        setup_proj
        log "The project has been successfully setup."
        log "The main project has been cloned into: $PROJ_DIR"
        log "Next, re-run this script which is located in $PROJ_DIR/AWS with $CONFIGURE"
        ;;
    "$CONFIGURE")
        install_pip_reqs
        configure_gunicorn
        configure_nginx
        configure_ufw
        ;;
    "$RUN")
        panic "$RUN unimplemented"
        ;;
    "$INSTALL")
        panic "$INSTALL unimplemented"
        ;;
    "$UPDATE")
        update_repo
        ;;
    "$HELP")
        usage
        ;;
    *)
        panic "unknown option: $1"
        ;;
esac

major "syscontrol.sh END"
log "Logged all messages to: $LOGFILE"

write_logs

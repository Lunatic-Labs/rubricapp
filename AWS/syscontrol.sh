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
SERVE="--serve"

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

# Variables for keeping track of important directories.
PROD_NAME="POGIL_PRODUCTION"
VENV_DIR="/home/$USER/$PROD_NAME/pogilenv"
PROJ_DIR="/home/$USER/$PROD_NAME/rubricapp"

# Service name for use with systemctl.
SERVICE_NAME="rubricapp.service"

# ///////////////////////////////////
# UTILS
# ///////////////////////////////////

# Write the `LOGSTR` to `LOGFILE`.
function write_logs() {
    echo -e "$LOGSTR" > "$LOGFILE"
}

# Prints a log message to stdout. Appends the
# `msg` variable to `logstr`. Use this function
# for general IO messages.
function log() {
    local green="\033[0;32m"
    local nc="\033[0m"
    local msg="${BASH_SOURCE[1]}:${FUNCNAME[1]}:${LINENO} ${green}{ $1 }$nc"
    LOGSTR+="$msg\n"
    echo -e "$msg"
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
    echo "    $SERVE     :: serve the application"
    echo "    $UPDATE    :: updates the repository"
    echo "    $INSTALL   :: only installs dependencies"
    exit 1
}

# Enter the python virtual environment.
function enter_venv() {
    log "entering python virtual environment"
    source "$VENV_DIR/bin/activate"
    log "done"
}

# Exit the python virtual environment.
function exit_venv() {
    log "exiting python virtual environment"
    deactivate
    log "done"
}

# ///////////////////////////////////
# UPDATES
# ///////////////////////////////////

# Kill PIDS given a port num.
# It uses the terse option from lsof
# to accomplish this.
function kill_pids() {
    log "killing pids"

    local port=$1
    local pids=$(lsof -ti :$port)

    # If PIDs are not empty, kill them.
    if [ -n "$pids" ]; then
        kill $pids
    fi

    log "done"
}

# Start a process in the background. It expects
# `dir` (the directory to change to) and
# `proc` (the process to run).
function start_bgproc() {
    log "starting background processes $1 and $2"
    local dir=$1
    local proc=$2
    cd $dir
    $proc &
    cd -
    log "done"
}

# Updates the repo by comparing the hash of what is
# local vs what is remote.
function update_repo() {
    log "updating repo"
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
    log "done"
}

# Install all requirements needed
# through aptitude. NOTE: if more
# packages are needed, append them
# to the `DEPS` variable at the top
# of the file.
function install_deps() {
    log "updating/upgrading packages"
    sudo apt update
    sudo apt upgrade -y
    log "installing dependencies"
    sudo apt install $DEPS -y
    log "done"
}

# ///////////////////////////////////
# CONFIGURATION
# ///////////////////////////////////

function configure_npm() {
    cd "$PROJ_DIR/FrontEndReact"
    npm install
}

# Configure NGINX. It uses the configuration
# that is in the same directory as this script
# `./nginx_config`.
function configure_nginx() {
    log "configuring nginx"

    cd "$PROJ_DIR/AWS"

    sudo cp ./nginx_config /etc/nginx/sites-available/rubricapp
    sudo ln -s /etc/nginx/sites-available/rubricapp /etc/nginx/sites-enabled

    log "done"
}

# Allow ports for UFW.
function configure_ufw() {
    log "configuring ufw"
    sudo ufw allow 5000
    sudo ufw allow 3000
    sudo ufw allow 443
    sudo ufw allow 80
    sudo ufw allow 22
    log "done"
}

# Configure gunicorn. It uses the configuration
# file that is stored in the same directory as
# this script. See `SERVICE_NAME` for the name
# of the file.
function configure_gunicorn() {
    log "configuring gunicorn"
    sudo cp "$PROJ_DIR/AWS/$SERVICE_NAME" "/etc/systemd/system/$SERVICE_NAME"
    log "done"
}

# Configure the python virtual environment.
# It checks if the virtual environment has
# already been created or not. If it hasn't,
# it creates it. Otherwise it does nothing.
function configure_venv() {
    log "settup up the virtual environment"
    if [ ! -d "$VENV_DIR" ]; then
        python3 -m venv "$VENV_DIR"
    fi
    log "done"
}

# Installs the dependencies that the
# project needs through pip3. This requires
# that the venv has been set up already
# and that --fresh has already been ran.
function install_pip_reqs() {
    configure_venv
    enter_venv

    log "installing pip requirements"

    cd "$PROJ_DIR/BackEndFlask"

    pip3 install wheel
    pip3 install -r requirements.txt

    exit_venv
    log "done"
}

# Sets up the root of the project, namely
# in /home/$USER/$PROD_NAME/. All project
# files will be stored here, including the
# main codebase as well as the python
# virtual environment.
function setup_proj() {
    log "setting up production directory"
    cd ../; local old_pwd="$(pwd)"
    cd ~; mkdir -p "$PROD_NAME"
    cp -r "$old_pwd" "$PROD_NAME/"
    log "done"
}

# ///////////////////////////////////
# SERVING
# ///////////////////////////////////

# Start gunicorn.
function start_gunicorn() {
    log "binding gunicorn"
    cd "$PROJ_DIR/BackEndFlask"
    gunicorn --bind 0.0.0.0:5000 wsgi:app &
    log "done"
}

# Start nginx.
function start_nginx() {
    log "starting nginx"
    sudo systemctl enable rubricapp
    log "done"
}

# Start the rubricapp service.
function start_rubricapp_service() {
    log "starting rubricapp service"
    sudo chmod 644 /etc/systemd/system/rubricapp.service
    sudo systemctl restart "$SERVICE_NAME"
    log "done"
}

# Serve the rubricapp app. Starts all
# relevant services needed.
function serve() {
    enter_venv

    log "serving rubricapp"

    start_rubricapp_service
    start_gunicorn
    start_nginx

    sudo ufw delete allow 5000
    sudo ufw allow 'Nginx Full'

    sudo nginx -s reload
    sudo unlink /etc/nginx/sites-enabled/default

    sudo chmod 755 "/home/$USER"

    # cd "$PROJ_DIR/FrontEndReact"
    # npm start &

    log "done"
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
        configure_npm
        ;;
    "$SERVE")
        serve
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

log "syscontrol.sh END"
log "Logged all messages to: $LOGFILE"

write_logs

#!/bin/bash

set -e

# Available options to run this script with.
# To add a new one, put it here and update
# the `case` statement located in the `driver`
# section. Also be sure to put the new option
# in the `usage` function.
FRESH="--fresh"
INIT="--init"
CONFIGURE="--configure"
INSTALL="--install"
HELP="--help"
UPDATE="--update"
SERVE="--serve"
STATUS="--status"
KILL="--kill"

# List of programs to check/install for apt.
# Add to this list when a new program
# is needed. No further action is needed.
DEPS='python3
      curl
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
PROD_NAME="RUBRICAPP_PRODUCTION"
VENV_DIR="/home/$USER/$PROD_NAME/rubricapp-env"
PROJ_DIR="/home/$USER/$PROD_NAME/rubricapp"

# Service name for use with systemctl.
SERVICE_NAME="rubricapp.service"

# ///////////////////////////////////
# NGINX CONFIG
# This gets put into /etc/nginx/sites-available/rubricapp
# ///////////////////////////////////

NGINX_BACKEND_CONFIG="server {
    listen 5000;
    server_name 0.0.0.0;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/$USER/$PROD_NAME/rubricapp/BackEndFlask/rubricapp.sock;
 }
}
"

NGINX_FRONTEND_CONFIG="server {
    listen 80;
    server_name 0.0.0.0;

    location / {
        include proxy_params;
        proxy_pass http://0.0.0.0:3000;
 }
}
"

# ///////////////////////////////////
# GUNICORN CONFIG
# This gets put into /etc/systemd/system/rubricapp.service
# ///////////////////////////////////

GUNICORN_CONFIG="[Unit]
Description=Gunicorn instance to serve rubricapp
After=network.target

[Service]
User=$USER
Group=www-data
WorkingDirectory=/home/$USER/$PROD_NAME/rubricapp/BackEndFlask
Environment="PATH=/home/$USER/$PROD_NAME/$VENV_DIR/bin/"
ExecStart=/home/$USER/$PROD_NAME/$VENV_DIR/bin/gunicorn --workers 3 --bind unix:rubricapp.sock -m 007 wsgi:app

[Install]
WantedBy=multi-user.target
"

# ///////////////////////////////////
# UTILS
# ///////////////////////////////////

# Prints a log message to stdout. Appends the
# `msg` variable to `logstr`. Use this function
# for general IO messages.
function log() {
    local green="\033[0;32m"
    local bold="\033[1m"
    local nc="\033[0m"
    local msg="${green}${BASH_SOURCE[1]}:${FUNCNAME[1]}:${LINENO} ::: ${bold}$1${nc}"
    echo -e "$msg"
}

# Prints a panic message to stdout. Appends the
# `msg` variable to `logstr`. Exits with 1. Use
# this function when an error is encountered.
function panic() {
    local msg="$1"
    echo "[ERR] $msg"
    exit 1
}

# Displays the usage information.
function usage() {
    echo "Usage:"
    echo "  ./syscontrol <OPTION>"
    echo "  where OPTION is one of:"
    echo "    $HELP      :: prints this message"
    echo "    $FRESH     :: sets up the initial root project"
    echo "    $INIT      :: inits the project by calling $INSTALL and $CONFIGURE"
    echo "    $INSTALL   :: only installs dependencies"
    echo "    $CONFIGURE :: configure gunicorn and nginx"
    echo "    $SERVE     :: serve the application"
    echo "    $UPDATE    :: updates the repository and calls $SERVE"
    echo "    $STATUS    :: shows the status of everything running"
    echo "    $KILL      :: kills running processes"
    echo "If this is a brand new AWS instance, run with $FRESH, change to root proj directory, then $INIT"
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

function assure_proj_dir() {
    if [ ! -d "$PROJ_DIR" ];
    then
        panic "The project directory: $PROJ_DIR has not been set up. Run this script with $FRESH"
    fi
}

function show_status() {
    log "showing status"

    log "nginx.service"
    systemctl status nginx.service --no-pager || true

    log "rubricapp.service"
    systemctl status rubricapp.service --no-pager || true

    log "redis-server.service"
    systemctl status redis-server.service --no-pager || true

    log "port 5001"
    lsof -i :5001 || true

    log "port 5000"
    lsof -i :5000 || true

    log "port 3000"
    lsof -i :3000 || true

    log "port 80"
    lsof -i :80 || true

    log "done"
}

function kill_procs() {
    log "killing all processes"

    sudo systemctl stop redis-server.service
    sudo systemctl stop rubricapp.service
    sudo systemctl stop nginx.service

    kill_pids 5000
    kill_pids 5001
    kill_pids 3000

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
        # Get the most up-to-date version of the repo.
        git pull origin master
    fi
    log "done"
}

function install_npm_deps() {
    log "installing npm dependencies"

    # Install NVM
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    nvm install 20.11.1
    nvm use 20.11.1
    source ~/.bashrc

    cd "$PROJ_DIR/FrontEndReact"
    sudo npm install -g serve
    npm install

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

# Install all requirements needed
# through aptitude. NOTE: if more
# packages are needed, append them
# to the `DEPS` variable at the top
# of the file.
function install_sys_deps() {
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

# Configure NGINX. It uses the configuration
# that is in the same directory as this script
# `./nginx_config`.
function configure_nginx() {
    log "configuring nginx"

    cd "$PROJ_DIR/AWS"

    # sudo cp ./nginx_config /etc/nginx/sites-available/rubricapp
    echo -e "$NGINX_BACKEND_CONFIG" | sudo tee /etc/nginx/sites-available/rubricapp > /dev/null
    echo -e "$NGINX_FRONTEND_CONFIG" | sudo tee /etc/nginx/sites-available/rubricapp-frontend > /dev/null

    sudo ln -bs /etc/nginx/sites-available/rubricapp /etc/nginx/sites-enabled
    sudo ln -bs /etc/nginx/sites-available/rubricapp-frontend /etc/nginx/sites-enabled

    # A temporary file can be created, remove it.
    sudo rm -f /etc/nginx/sites-enabled/rubricapp~

    log "done"
}

# Allow ports for UFW.
function configure_ufw() {
    log "configuring ufw"
    # sudo ufw allow 5000
    # sudo ufw allow 5001
    # sudo ufw allow 3000
    # sudo ufw allow 443
    sudo ufw allow 80
    # sudo ufw allow 22

    sudo ufw delete allow 5000
    sudo ufw delete allow 5001
    sudo ufw delete allow 3000
    sudo ufw allow 'Nginx Full'

    log "done"
}

# Configure gunicorn. It uses the configuration
# file that is stored in the same directory as
# this script. See `SERVICE_NAME` for the name
# of the file.
function configure_gunicorn() {
    log "configuring gunicorn"

    echo -e "$GUNICORN_CONFIG" | sudo tee "/etc/systemd/system/$SERVICE_NAME" > /dev/null
    sudo chmod 644 /etc/systemd/system/rubricapp.service

    log "done"
}

# Configure the python virtual environment.
# It checks if the virtual environment has
# already been created or not. If it hasn't,
# it creates it. Otherwise it does nothing.
function configure_venv() {
    log "settup up the virtual environment"

    if [ ! -d "$VENV_DIR" ];
    then
        python3 -m venv "$VENV_DIR"
    fi

    log "done"
}

# Sets up the root of the project, namely
# in /home/$USER/$PROD_NAME/. All project
# files will be stored here, including the
# main codebase as well as the python
# virtual environment.
function setup_proj_root() {
    log "setting up production directory"

    cd ../; local old_pwd="$(pwd)"
    cd ~; mkdir -p "$PROD_NAME"
    cp -r "$old_pwd" "$PROD_NAME/"

    log "done"

    log "The project has been successfully setup. 
The main project has been cloned into: $PROJ_DIR. 
Next, re-run this script which is located in $PROJ_DIR/AWS with $CONFIGURE"
}

# ///////////////////////////////////
# SERVING
# ///////////////////////////////////

# Serve the rubricapp app. Starts all
# relevant services needed.
function serve_rubricapp() {
    assure_proj_dir
    enter_venv

    log "serving rubricapp"

    log "stopping services"
    kill_procs

    sudo chmod 644 /etc/systemd/system/rubricapp.service

    # Start redis
    log "starting redis"
    sudo systemctl start redis-server.service

    # Start gunicorn
    log "Starting gunicorn"
    cd "$PROJ_DIR/BackEndFlask"
    gunicorn --bind 0.0.0.0:5001 wsgi:app &
    sudo systemctl start rubricapp.service

    # Start nginx
    log "starting NGINX"
    sudo systemctl start nginx.service
    sudo nginx -s reload

    sudo chmod 755 "/home/$USER"

    log "serving front-end"
    cd "$PROJ_DIR/FrontEndReact"
    npm run build
    serve -s -l tcp://0.0.0.0:3000 build &
    cd -

    log "done"
}

function configure_db() {
    log "configuring database"

    configure_venv
    enter_venv

    cd "$PROJ_DIR/BackEndFlask"
    python3 ./dbcreate.py

    # Creating hidden.py with password to enable emails
    echo "PASSWORD = \"nzdh hnyf bafo ovtm\"" > ./models/hidden.py

    exit_venv

    cd -

    log "done"
}

function configure() {
    assure_proj_dir
    configure_gunicorn
    configure_nginx
    configure_ufw
}

function install() {
    assure_proj_dir
    install_sys_deps
    install_pip_reqs
    install_npm_deps
}

function fresh() {
    setup_proj_root
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
        fresh
        ;;
    "$INIT")
        red="\033[0;31m"
        nc="\033[0m"
        echo -e "${red}You are running $INIT. This resets the DATABASE COMPLETELY. Do you want to continue? Y/n${nc}"
        read ans
        if [ "$ans" == "Y" ] || [ "$ans" == "y" ];
        then
            install
            configure
            configure_db # NOTE: resets the DB!
        else
            panic "Aborting"
        fi
        ;;
    "$INSTALL")
        install
        ;;
    "$CONFIGURE")
        configure
        ;;
    "$SERVE")
        serve_rubricapp
        ;;
    "$UPDATE")
        kill_procs
        update_repo
        serve
        ;;
    "$STATUS")
        show_status
        ;;
    "$KILL")
        kill_procs
        ;;
    "$HELP")
        usage
        ;;
    *)
        panic "unknown option: $1"
        ;;
esac

log "syscontrol.sh END"

#!/bin/bash

set -e

# =====================================================
# This script is made for Ubunut / Debian-Based Distros
# =====================================================

# ===================================================================
# SCRIPT OPTIONS
# These are the command-line flags you can use with this script
# PSA: When adding new options, must add them in the usage function
# ===================================================================
FRESH="--fresh"
INIT="--init"
CONFIGURE="--configure"
INSTALL="--install"
HELP="--help"
UPDATE="--update"
SERVE="--serve"
STATUS="--status"
KILL="--kill"

# ======================================
# System Dependencies (For Ubuntu/Debian)
# to add new packages, add them to the DEPS below
# ======================================
 DEPS='python3
      curl
      build-essential
      libssl-dev
      libffi-dev
      git
      redis-server
      python3-pip
      python3-gdbm
      python3-dev
      python3-setuptools
      python3-venv
      ufw
      nginx
      certbot
      python3-certbot-nginx
      lsof'

# =====================================================
# DIRECTORY STRUCTURE
# =====================================================
# /home/$USER/RUBRICAPP_PRODUCTION/
#   ├── rubricapp-env/  (Python venv)
#   └── rubricapp/      (Application code)
# =====================================================
PROD_NAME="RUBRICAPP_PRODUCTION"
VENV_DIR="/home/$USER/$PROD_NAME/rubricapp-env"
PROJ_DIR="/home/$USER/$PROD_NAME/rubricapp"
SERVICE_NAME="rubricapp.service"
FRONTEND_SERVICE_NAME="rubricapp-frontend.service"
DOMAIN="skill-builder-testing.net"
# =====================================================

# ========================================================
# NGINX CONFIG
# This gets put into /etc/nginx/sites-available/rubricapp
# ========================================================

# Port 5000 SSL Proxy to Gunicorn
NGINX_BACKEND_CONFIG="server {
    listen 5000 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://unix:/home/$USER/RUBRICAPP_PRODUCTION/rubricapp/BackEndFlask/rubricapp.sock;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}"

# Redirect HTTP -> HTTPS and port 433 proxy to React (Port 3000)
NGINX_FRONTEND_CONFIG="server {
    listen 80;
    server_name ${DOMAIN};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name ${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}"

# ========================================================
# GUNICORN CONFIG
# This gets put into /etc/systemd/system/rubricapp.service
# ========================================================
GUNICORN_CONFIG="[Unit]
Description=Gunicorn instance to serve rubricapp
After=network.target

[Service]
User=$USER
Group=www-data
WorkingDirectory=/home/$USER/$PROD_NAME/rubricapp/BackEndFlask
Environment=\"PATH=$VENV_DIR/bin\"
ExecStart=$VENV_DIR/bin/gunicorn --workers 3 --umask 007 --bind unix:rubricapp.sock wsgi:app
[Install]
WantedBy=multi-user.target
"

# ================
# UTIL FUNCTIONS
# ================

# Print colored log messages with file/function/line context
function log() {
    local green="\033[0;32m"
    local bold="\033[1m"
    local nc="\033[0m"
    local msg="${green}${BASH_SOURCE[1]}:${FUNCNAME[1]}:${LINENO} ::: ${bold}$1${nc}"
    echo -e "$msg"
}

# Prints error and exit with status 1
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
    echo "    $HELP             :: prints this message"
    echo "    $FRESH            :: sets up the initial root project"
    echo "    $INIT             :: inits the project by calling $INSTALL and $CONFIGURE"
    echo "    $INSTALL          :: only installs dependencies"
    echo "    $CONFIGURE        :: configure SSL certificate,gunicorn and nginx"
    echo "    $SERVE <dev|prod> :: serve the application with either development environment or production environment"
    echo "    $UPDATE           :: updates the repository and calls $SERVE"
    echo "    $STATUS           :: shows the status of everything running"
    echo "    $KILL             :: kills running processes"
    echo "If this is a brand new instance, run with $FRESH, change to root proj directory, then $INIT"
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
# Validate project directory exists, exit if not
function assure_proj_dir() {
    if [ ! -d "$PROJ_DIR" ];
    then
        panic "The project directory: $PROJ_DIR has not been set up. Run this script with $FRESH"
    fi
}

# =============================
# STATUS AND MONITORING
# =============================

# Status for all services and ports
function show_status() {
    log "showing status"

    log "nginx.service"
    systemctl status nginx.service --no-pager || true

    log "rubricapp.service"
    systemctl status rubricapp.service --no-pager || true

    log "rubricapp-frontend.service"
    systemctl status rubricapp-frontend.service --no-pager || true

    log "redis-server.service"
    systemctl status redis-server.service --no-pager || true

    echo ""
    echo "===Port Usage==="

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

# ===================
# PROCESS MANAGEMENT
# ===================

# Stop all services, kill processes and clear PyCache
function kill_procs() {
    log "killing all processes/services"

    sudo systemctl stop rubricapp-frontend.service 2>/dev/null || true
    sudo systemctl stop redis-server.service 2>/dev/null || true
    sudo systemctl stop rubricapp.service 2>/dev/null || true
    sudo systemctl stop nginx.service 2>/dev/null || true

    kill_pids 5000
    kill_pids 5001
    kill_pids 3000

    log "cleaning pycache files"
    if [ -d "$PROJ_DIR" ]; then
      find "$PROJ_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
      find "$PROJ_DIR" -type f -name "*.pyc" -delete 2>/dev/null || true
    fi

    cd - >/dev/null 2>&1 || true
    log "done"
}

# Kill PIDS given a port using lsof
function kill_pids() {
    local port=$1
    log "killing pids on port $port"

    local pids
    pids=$(lsof -ti :$port 2>/dev/null || true)

    if [ -n "$pids" ]; then
        kill $pids 2>/dev/null || true
    else
        log "no processes found on port"
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

# Pull latest changes from git if remote differs from local
function update_repo() {
    log "updating repo"

    cd "$PROJ_DIR"

    git fetch
    if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/master)" ];
    then
        # Get the most up-to-date version of the repo.
        git pull origin master
    fi

    cd -
    log "done"
}

# ===========================
# DEPENDENCY INSTALLATION
# ===========================

# Install system packages via apt (EPEL + upgrades + DEPS)
function install_sys_deps() {
    log "updating/upgrading packages"

    sudo apt update || true
    sudo apt upgrade -y

    log "installing dependencies"

    sudo apt install $DEPS -y

    log "done"
}

# Configure the python virtual environment.
# It checks if the virtual environment has
# already been created or not. If it hasn't,
# it creates it. Otherwise it does nothing.
function configure_venv() {
    log "setting up the virtual environment"

    if [ ! -d "$VENV_DIR" ]; then
        python3 -m venv "$VENV_DIR"
    fi

    log "done"
}

# Installs NVM, Nodejs v20.11.1, serve and npm packages
function install_npm_deps() {
    log "installing npm dependencies"

    # Install NVM (idempotent)
    if [ ! -d "$HOME/.nvm" ]; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    fi

    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"

    nvm install 20.11.1
    nvm use 20.11.1

    # Ensure global serve exists (systemd will call it)
    npm list -g --depth=0 serve >/dev/null 2>&1 || sudo npm install -g serve

    cd "$PROJ_DIR/FrontEndReact"

    # CRA5 expects TS 4.x. Force pin.
    if [ -f package.json ]; then
        npm pkg set devDependencies.typescript="4.9.5" >/dev/null 2>&1 || true
    fi

    # Clean partial installs if needed
    rm -rf node_modules

    if [ -f package-lock.json ]; then
        npm ci --legacy-peer-deps
    else
        npm install --legacy-peer-deps
    fi

    cd -
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

    pip3 install --upgrade pip wheel
    pip3 install -r requirements.txt

    exit_venv

    log "done"
}

# ======================
# CONFIGURATION
# ======================

function ensure_le_nginx_files() {
    log "ensuring letsencrypt nginx ssl include files exist"

    if ! sudo test -f /etc/letsencrypt/options-ssl-nginx.conf; then
        sudo mkdir -p /etc/letsencrypt
        sudo tee /etc/letsencrypt/options-ssl-nginx.conf > /dev/null <<'EOF'
        ssl_session_cache shared:le_nginx_SSL:10m;
        ssl_session_timeout 1d;
        ssl_session_tickets off;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers off;

        ssl_stapling on;
        ssl_stapling_verify on;

        resolver 1.1.1.1 8.8.8.8 valid=300s;
        resolver_timeout 5s;
EOF
    fi

    if ! sudo test -f /etc/letsencrypt/ssl-dhparams.pem; then
        sudo openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
    fi

    log "done"
}

# Get SSL certificates using certbot standalone mode
# Domain must be pointing to server IP before attempting this
function configure_ssl() {
    log "obtaining SSL certificates"

    DOMAIN="$(echo "$DOMAIN" | tr -d '\r' | xargs)"
    CERT_DIR="/etc/letsencrypt/live/$DOMAIN"

    log "ensuring ports 80 and 443 are available"
    sudo systemctl stop nginx.service 2>/dev/null || true
    kill_pids 80
    kill_pids 443

    if sudo test -d "$CERT_DIR"; then
        log "certificates already exist for $DOMAIN"
    else
        log "obtaining new certificates for $DOMAIN"
        sudo certbot certonly --standalone \
            --non-interactive \
            --agree-tos \
            --register-unsafely-without-email \
            -d "$DOMAIN" \
            || panic "Failed to obtain SSL certificates"
    fi

    if ! sudo test -e "$CERT_DIR/fullchain.pem" || ! sudo test -e "$CERT_DIR/privkey.pem"; then
        sudo ls -la "$CERT_DIR" || true
        sudo ls -la "/etc/letsencrypt/archive/$DOMAIN" || true
        panic "SSL certificate files not found after certbot run"
    fi

    # Make sure nginx include files exist (prevents your earlier error)
    ensure_le_nginx_files

    log "SSL certificates successfully obtained"
    log "done"
}

# Configure NGINX. It uses the configuration
# that is in the same directory as this script
# `./nginx_config`.
function configure_nginx() {
    log "configuring nginx"

    echo "$NGINX_BACKEND_CONFIG" | sudo tee /etc/nginx/sites-available/rubricapp > /dev/null
    echo "$NGINX_FRONTEND_CONFIG" | sudo tee /etc/nginx/sites-available/rubricapp-frontend > /dev/null
    
    # Creates site-enabled directory if it does not exist
    sudo mkdir -p /etc/nginx/sites-enabled

    # use -sf consistently for symbolic links
    sudo ln -sf /etc/nginx/sites-available/rubricapp /etc/nginx/sites-enabled/
    sudo ln -sf /etc/nginx/sites-available/rubricapp-frontend /etc/nginx/sites-enabled/

    # Include sites-enabled in nginx.conf if not already there
    if ! grep -q "include /etc/nginx/sites-enabled/\*;" /etc/nginx/nginx.conf; then
        sudo sed -i '/include \/etc\/nginx\/conf.d\/\*.conf;/a\    include /etc/nginx/sites-enabled/*;' /etc/nginx/nginx.conf
    fi

    # Test Nginx configuration
    sudo nginx -t || panic "Nginx configuration test failed"

    log "done"
}

# Configure UFW firewall to allow necessary ports
function configure_ufw() {
    log "configuring UFW firewall"
    sudo ufw --force enable
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 5000/tcp
    sudo ufw allow 3000/tcp
    sudo ufw status verbose
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

function configure_frontend_service() {
    log \"configuring frontend systemd service\"

    local serve_path
    serve_path=\"$(command -v serve || true)\"
    if [ -z \"$serve_path\" ]; then
        panic \"serve not found. Run --install first.\"
    fi

    sudo tee \"/etc/systemd/system/$FRONTEND_SERVICE_NAME\" > /dev/null <<EOF
[Unit]
Description=Rubricapp React Frontend (serve)
After=network.target

[Service]
User=$USER
WorkingDirectory=$PROJ_DIR/FrontEndReact
ExecStart=$serve_path -s build -l 3000
Restart=always
RestartSec=2
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable \"$FRONTEND_SERVICE_NAME\"

    log \"done\"
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

# ======================
# APPLICATION SERVING
# ======================

# Starts all relevant services needed
# Stops existing processes first for clean deployment
function serve_rubricapp() {
    assure_proj_dir

    log "serving rubricapp"
    log "stopping services"
    kill_procs

    # Backend
    configure_venv
    enter_venv

    log "starting redis-server"
    sudo systemctl enable --now redis-server.service

    log "starting gunicorn"
    sudo systemctl daemon-reload
    sudo systemctl enable --now rubricapp.service

    # Nginx
    log "starting nginx"
    sudo systemctl enable --now nginx.service
    sudo nginx -s reload || log "Warning: Nginx reload failed but running"

    # Allows nginx to read home directory (needed sometimes for socket paths)
    sudo chmod 755 "/home/$USER"

    exit_venv

    # Frontend build + systemd restart
    log "building front-end"
    cd "$PROJ_DIR/FrontEndReact"
    npm run build || panic "Failed NPM run build"
    cd - >/dev/null 2>&1 || true

    log "starting front-end service"
    sudo systemctl reset-failed "$FRONTEND_SERVICE_NAME" 2>/dev/null || true
    sudo systemctl restart "$FRONTEND_SERVICE_NAME"

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

# ===================
# ADVANCED COMMANDS
# ===================

# Runs all configuration steps: Gunicorn, Nginx, UFW
function configure() {
    assure_proj_dir
    configure_ssl
    configure_gunicorn
    configure_nginx
    configure_frontend_service
    configure_ufw
}

# Install all dependencies: sytem packages, Python Packages, Node.js
function install() {
    assure_proj_dir
    install_sys_deps
    install_pip_reqs
    install_npm_deps
}

# Sets up production directory structure (run First on a new server)
function fresh() {
    setup_proj_root
}

# ============================================================
# MAIN SCRIPT EXECUTION
# Usage: ./syscontrol.sh --fresh (then --init, then --serve)
# ============================================================

# Check if any arguments were provided
if [ "$#" -eq 0 ];
then
    usage
fi

# Process the command-line argument
# Add new options here.
case "$1" in
    "$FRESH")
        fresh
        ;;
    "$INIT")
        # Full initialization with warning
        red="\033[0;31m"
        nc="\033[0m"
        echo -e "${red}WARNING: Running $INIT will RESET THE DATABASE COMPLETELY.${nc}"
        echo -e "${red}Do you want to continue? (Y/n)${nc}"
        read ans
        
        if [ "$ans" == "Y" ] || [ "$ans" == "y" ]; then
            install
            configure
            configure_db  # Resets database!
        else
            panic "Initialization aborted by user"
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
        panic "Unknown option: $1 (use $HELP for usage info)"
        ;;
esac

log "syscontrol.sh completed successfully"
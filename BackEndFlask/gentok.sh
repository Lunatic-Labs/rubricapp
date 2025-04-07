#!/bin/bash

# Overview
#   This file is intended to be used by project admins
#   who have appropriate access to the rubricapp
#   Google project. Will generate a refresh token
#   to send to the specified server.

# Steps It Takes:
#   1. Checks for some environment variables (listed below).
#   2. Sets up a temporary Python virtual environment.
#   3. Runs a temporary Python script to generate the token.
#   4. Uses `scp` to transfer that token to the dev/prod server.

# Variables It Checks For:
#   Note: You do not need to set these up before using
#         this script, as it will do it for you.
#   1. GENTOK_DEV_CREDS_FP  - The filepath for the Google Console credentials (dev).
#   2. GENTOK_PROD_CREDS_FP - The filepath for the Google Console credentials (prod).
#   3. GENTOK_DEV_IP        - The IP address of the development server.
#   4. GENTOK_PROD_IP       - The IP address of the production server.
#   5. GENTOK_PEM_FILE      - The PEM file for `scp`.

set -e

# Names for the temporary artifacts that
# are created. These files are deleted.
VENV="__gentok_env_"
PYTHON_SCRIPT_NAME="__gentok_script_.py"
CREDS_TMP_FILE="__creds_tmp_file_"

function usage() {
    echo "Usage: gentok <dev|prod>"
    echo "where"
    echo "  dev  - Send the token to the development server"
    echo "  prod - Send the token to the production server"
    exit 1
}

function s() {
    sleep 0.3
}

function info() {
    local msg=$1
    echo "[INFO] $msg"
}

function info2() {
    local msg=$1
    printf "[INFO] $msg"
}

function err() {
    local msg=$1
    echo "[ERROR] $msg"
    exit 1
}

function action() {
    local msg=$1
    printf "[ACTION] $msg: "
}

# Setup the virtual environment and install all
# dependencies needed for generating a token.
function setup_env() {
    info "Settup up venv"
    python3 -m venv $VENV
    source "$VENV/bin/activate"
    pip3 install google-api-core google-api-python-client google-auth google-auth-httplib2 google-auth-oauthlib
}

# Remove the unneeded venv directory.
function remove_env() {
    info "Removing venv"
    rm -r $VENV
}

# Run the python script (in-place) to generate the
# refresh token.
function run_script() {
    local server="$1"
    local path=""

    if [ $server == "dev" ]; then
        path="$GENTOK_DEV_CREDS_FP"
    else
        path="$GENTOK_PROD_CREDS_FP"
    fi

    cat <<EOF > $PYTHON_SCRIPT_NAME
import os
import base64
from email.message import EmailMessage
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
def get_gmail_credentials():
    SCOPES = [
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.readonly",
    ]
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "$path", SCOPES)
            creds = flow.run_local_server(port=8080, access_type='offline', prompt='consent')
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds
creds = get_gmail_credentials()
EOF

    python3 $PYTHON_SCRIPT_NAME
    rm $PYTHON_SCRIPT_NAME
}

# Temporarily set an environment variable.
function set_envvar() {
    local var="$1"
    local value="$2"
    export "$var=$value"
}

# Write an environment variable to a specified file.
function write_envvar() {
    local var="$1"
    local value="$2"

    action "Enter filepath to write to (blank for ${HOME}/.bashrc)"
    read fp

    if [[ $fp == "" || fp == " " ]]; then
        fp="$HOME/.bashrc"
    fi

    echo "WRITING: $var=\"$value\""

    echo "export $var=\"$value\"" >> "$fp"
}

# Create an environnment variable.
function create_envvar() {
    local var="$1"
    local msg="$2"
    local apirel="$3"

    if [ $apirel -eq 1 ]; then
        info "$var is either not set or empty, creating one..."
        info "[Where to find]"; s
        info "  1. Navigate to https://console.cloud.google.com/apis/credentials in the browser."; s
        info "  2. Find the appropriate 'OAuth 2.0 Client IDs' and click 'download'"; s
    fi

    action "$msg"
    read value
    set_envvar $var $value

    while true; do
        info "Save environment variable to file?"
        info "This makes it so you do not have to manually"
        info "enter this variable next time"
        action "[Y/n]"
        read yn
        if [[ $yn = "y" || $yn == "Y" || $yn == "yes" || $yn == "Yes" || $yn == "" || $yn == " " ]]; then
            write_envvar $var $value
            break
        elif [[ $yn = "n" || $yn == "N" || $yn == "no" || $yn == "No" ]]; then
            break
        fi
        info "invalid input: $yn"; s
    done

    set_envvar $var $value
}

# Send the generated token to the appropriate server.
function send_to_server() {
    local server=$1
    local loc=""

    if [ $1 == "dev" ]; then
        if [ ! -n "${GENTOK_DEV_IP}" ]; then
            create_envvar GENTOK_DEV_IP "Enter the IP address of the testing server" 0
        fi
        loc="${GENTOK_DEV_IP}:/home/ubuntu/private"
        echo "LOC: $loc"
    else
        server="prod"
        if [ ! -n "${GENTOK_PROD_IP}" ]; then
            create_envvar GENTOK_PROD_IP "Enter the IP address of the production server" 0
        fi
        loc="${GENTOK_PROD_IP}:/home/ubuntu/private"
        echo "LOC: $loc"
    fi

    if [ ! -n "${GENTOK_PEM_FILE}" ]; then
        create_envvar GENTOK_PEM_FILE "Enter path for the PEM file" 0
    fi

    echo "creds: $GENTOK_DEV_CREDS_FP"
    echo "ip: $GENTOK_DEV_IP"
    echo "pem: ${GENTOK_PEM_FILE}"

    if [[ ! -n $GENTOK_DEV_CREDS_FP || ! -n $GENTOK_DEV_IP || ! -n $GENTOK_PEM_FILE ]]; then
        info "Something went wrong, could not retrive env var"
    fi

    info "Sending token.json to: $loc"

    scp -i "$GENTOK_PEM_FILE" token.json "$loc"
}

function find_server_creds() {
    local s=$1
    if [ $s == "prod" ]; then
        if [ ! -n "${GENTOK_PROD_CREDS_FP}" ]; then
            create_envvar GENTOK_PROD_CREDS_FP "Enter filepath to the production credentials" 1
        fi
    else
        if [ ! -n "${GENTOK_DEV_CREDS_FP}" ]; then
            create_envvar GENTOK_DEV_CREDS_FP "Enter filepath to the development credentials" 1
        fi
    fi
}

# Check for server type.
if [ "$#" -lt 1 ]; then
    usage
fi

# Check for scp
if ! which scp &> /dev/null
then
    err "The program 'scp' is not installed. It is required for this script"
fi

# Check for the appropriate environment credential filepaths
# and create them if they do not exist.
server=""
if   [ $1 == "dev" ];  then server="dev"
elif [ $1 == "prod" ]; then server="prod"
else                        usage
fi

find_server_creds $server
setup_env && run_script $server && remove_env
send_to_server $server

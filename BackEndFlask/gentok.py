import os
import sys
import base64
import argparse
import subprocess
from enum import Enum

try:
    from email.message import EmailMessage
    import google.auth
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from google_auth_oauthlib.flow import Flow
except:
    print('Cannot import Google API libraries, make sure to:')
    print('\tpython3 -m venv gentok-env')
    print('\tsource ./gentok-env/bin/activate')
    print('\tpip3 install google-api-core google-api-python-client google-auth google-auth-httplib2 google-auth-oauthlib')
    exit(1)

GENTOK_PROD_CREDS_FP: None|str = os.getenv('GENTOK_PROD_CREDS_FP')
GENTOK_DEV_CREDS_FP:  None|str = os.getenv('GENTOK_DEV_CREDS_FP')
GENTOK_PROD_IP:       None|str = os.getenv('GENTOK_PROD_IP')
GENTOK_DEV_IP:        None|str = os.getenv('GENTOK_DEV_IP')
GENTOK_PEM_FILE:      None|str = os.getenv('GENTOK_PEM_FILE')
GENTOK_NO_DEV_EV:     bool     = not GENTOK_DEV_CREDS_FP or not GENTOK_DEV_IP or not GENTOK_PEM_FILE
GENTOK_NO_PROD_EV:    bool     = not GENTOK_PROD_CREDS_FP or not GENTOK_PROD_IP or not GENTOK_PEM_FILE

# If you are reading this script for this documentation, I suggest
# running `python3 gentok.py --info` to view this information
# in a nicer format.
def how_to_use(): pass
how_to_use.__doc__ = f"""
    This script will generate a refresh token for the AWS instance.

    Important: After running this script successfully, I suggest removing the local
               `token.json` file.

    Note:      I suggest using this script outside of the rubricapp Git repository
               so as to not have unnecessary file(s) generated in it i.e., the venv.

    Flags:
        1. --info           - view this information
        2. --vars           - show the environment variables' status
        3. --srv=<dev|prod> - select the server to send the token to

    A few dependencies are needed to generate the token:
        1. google-api-core
        2. google-api-python-client
        3. google-auth
        4. google-auth-httplib2
        5. google-auth-oauthlib

    I suggest installing these into a virtual environment using `pip3 -m venv <name>`.

    A full example to install the dependencies would be:
        python3 -m venv gentok-env
        source gentok-env/bin/activate
        pip3 install google-api-core google-api-python-client google-auth google-auth-httplib2 google-auth-oauthlib
        python3 ./gentok.py
        deactivate

    When running this script, it checks to see if some environment variables are set. If not,
    it will prompt you to enter the information:
        1. GENTOK_PROD_CREDS_FP: The absolute filepath for the production credentials file (if prod option).
        2. GENTOK_DEV_CREDS_FP:  The absolute filepath for the development credentials file (if dev option).
        3. GENTOK_PROD_IP:       The production server IP address (if prod option)
        4. GENTOK_DEV_IP:        The development server IP address (if dev option)
        5. GENTOK_PEM_FILE:      The absolute path to the PEM file.

    These can be saved as environment variables so the script does not keep asking for
    this information every time. They can be temporary variables or saved somewhere
    in .bashrc, .zshrc, .profile etc.
        export GENTOK_PROD_CREDS_FP='<absolute path to production credentials.json>'
        export GENTOK_DEV_CREDS_FP='<absolute path to development credentials.json>'
        export GENTOK_PROD_IP='<ubuntu@ec2-...>'
        export GENTOK_DEV_IP='<ubuntu@ec2-...>'
        export GENTOK_PEM_FILE='<absolute path to PEM file>'

    The environment variables are currently set to:
        GENTOK_PROD_CREDS_FP={GENTOK_PROD_CREDS_FP}
        GENTOK_DEV_CREDS_FP={GENTOK_DEV_CREDS_FP}
        GENTOK_PROD_IP={GENTOK_PROD_IP}
        GENTOK_DEV_IP={GENTOK_DEV_IP}
        GENTOK_PEM_FILE={GENTOK_PEM_FILE}

    This script uses the program `scp` (Secure Copy Protocol) to transfer the generated
    token to the appropriate server, so this program must be installed.

    Press 'q' to quit..."""

def info(msg):
    print(f'[Info]: {msg}')

def get_gmail_credentials(path_to_creds):
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
                path_to_creds, SCOPES)
            creds = flow.run_local_server(port=8080, access_type='offline', prompt='consent')
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds

def get_in(msg: list):
    for m in msg: info(m)
    inp = None
    while True:
        inp = input(": ")
        if len(inp) != 0: break
    assert inp is not None
    return inp

def assert_pem_ev():
    global GENTOK_PEM_FILE
    pem = None
    if GENTOK_PEM_FILE is None:
        GENTOK_PEM_FILE = get_in(["Enter the absolute filepath for the PEM file",
                                  "\tex: /path/to/PEM_file.pem"])
    pem = GENTOK_PEM_FILE
    assert pem is not None
    return pem

def assert_ip_evs(ser_ty):
    global GENTOK_DEV_IP, GENTOK_PROD_IP
    ip = None
    if ser_ty == "prod":
        if GENTOK_PROD_IP is None:
            GENTOK_PROD_IP = get_in(["Enter the IP for the production server",
                                    "\tex: ubuntu@ec2-..."])
        ip = GENTOK_PROD_IP
    else:
        if GENTOK_DEV_IP is None:
            GENTOK_DEV_IP = get_in(["Enter the IP for the development server",
                                     "\tex: ubuntu@ec2-..."])
        ip = GENTOK_DEV_IP
    assert ip is not None
    return ip

def assert_fp_evs(ser_ty):
    global GENTOK_DEV_CREDS_FP, GENTOK_PROD_CREDS_FP
    fp = None
    if ser_ty == "prod":
        if GENTOK_PROD_CREDS_FP is None:
            GENTOK_PROD_CREDS_FP = get_in(["Enter filepath for the production credentials",
                                          "\tex: /home/<user>/path/to/credentials.json"])
        fp = GENTOK_PROD_CREDS_FP
    else:
        if GENTOK_DEV_CREDS_FP is None:
            GENTOK_DEV_CREDS_FP = get_in(["Enter filepath for the development credentials",
                                           "\tex: /home/<user>/path/to/credentials.json"])
        fp = GENTOK_DEV_CREDS_FP
    assert fp is not None
    return fp

def scp(pem, ip):
    cmd = ["scp", "-i", pem, "token.json", ip+":/home/ubuntu/private"]
    info(f'Running: {cmd}')
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        info('Transfer successful')
    else:
        info('Transfer failed')
        info(result.stderr)

def checkbadcwd():
    info('CWD: ' + os.getcwd())
    try:
        result = subprocess.run(
            ['git', 'rev-parse', '--is-inside-work-tree'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
            text=True
        )
        return result.stdout.strip() == 'true'
    except subprocess.CalledProcessError:
        return False

def show_vars(srv: str|None):
    if (srv and srv == "prod") or not srv:
        info(f'GENTOK_PROD_CREDS_FP: {GENTOK_PROD_CREDS_FP}')
        info(f'GENTOK_PROD_IP: {GENTOK_PROD_IP}')
    if (srv and srv == "dev") or not srv:
        info(f'GENTOK_DEV_CREDS_FP: {GENTOK_DEV_CREDS_FP}')
        info(f'GENTOK_DEV_IP: {GENTOK_DEV_IP}')
    info(f'GENTOK_PEM_FILE: {GENTOK_PEM_FILE}')

def main():
    parser = argparse.ArgumentParser(description="Generate a refresh token")
    parser.add_argument(
        "--srv",
        choices=["dev", "prod"],
        help="which server to send the token to"
    )
    parser.add_argument("--info", action="store_true", help="display documentation info")
    parser.add_argument("--vars", action="store_true", help="display the status of the environment variables the script uses")
    args = parser.parse_args()

    if args.info:
        help(how_to_use)
        exit(0)
    if args.vars:
        show_vars(None)
        exit(0)

    if not args.srv:
        info('--srv is a required argument')
        exit(1)

    if checkbadcwd():
            info('[Note]: You are currently in a Git repo.')
            while True:
                yn = input('Continue? [Y/n] ')
                if yn in ('N', 'n', 'No', 'no'): exit(0)
                elif yn in ('Y', 'y', 'Yes', 'yes', ''): break
                else: info(f'bad input: `{yn}`')

    creds_fp = assert_fp_evs(args.srv)
    ip = assert_ip_evs(args.srv)
    creds = get_gmail_credentials(creds_fp)
    info('Generated credentials:')
    info(f'    {creds}')
    pem = assert_pem_ev()
    scp(pem, ip)

    info('Done. Make sure to discard the `token.json` file that was created.')
    if (args.srv == "dev" and GENTOK_NO_DEV_EV) or (args.srv == "prod" and GENTOK_NO_PROD_EV):
        info('Some environment variables were not automatically detected.')
        info('Here they are for convenience if you want to set them somewhere:')
        show_vars(args.srv)

if __name__ == "__main__":
    main()

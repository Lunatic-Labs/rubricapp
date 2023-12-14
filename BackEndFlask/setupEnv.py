#!/usr/local/bin/python3

import platform
import sys
import os
import atexit

# Supported flags:
#   resetdb
#       - Adding the resetdb flag triggers the code to delete the account.db file
#   demo
#       - Adding the demo flag triggers the code to load demo data into the account.db file
#   requirements
#       - Adding the requirements flag avoids triggering the code to install the requirements

FILENAME = ""
SYSTEM = platform.system()
WINDOWS = SYSTEM == "Windows"

def log(msg):
    print(f"[ENV] {msg}")


def err(msg):
    print(f"[ERROR] {msg}")
    sys.exit(1)


def cmd(command):
    try:
        res = os.system(command)
        if res != 0:
            raise Exception
    except:
        log(f"Error running command: {command}")
        sys.exit(1)


def usage():
    global FILENAME
    print(f"Usage: python3 {filename} [options]")
    print("Options:")
    print("    -h, --help: display this message")
    print("    -i, --install: install requirements")
    print("    -r, --reset: reset database")
    print("    -d, --demo: load the database with demo data")
    print("    -s, --start: start server")


def install_reqs():
    global WINDOWS
    log("Installing requirements...")
    if WINDOWS:
        cmd("pip install -r requirements.txt")
    else:
        cmd("pip3 install -r requirements.txt")
    log("Requirements installed.")


def load_demo():
    global WINDOWS
    log("Loading demo data...")
    if WINDOWS:
        cmd("python dbcreate.py demo")
    else:
        cmd("python3 dbcreate.py demo")
    log("Demo data loaded.")


def start_server():
    global WINDOWS
    log("Starting server...")
    if WINDOWS:
        os.system("python run.py")
    else:
        os.system("python3 run.py")


def reset_db():
    global WINDOWS
    log("Resetting database...")
    db_filepath = "./instance/account.db"
    if os.path.exists(db_filepath):
        os.remove(db_filepath)
    if WINDOWS:
        cmd("python dbcreate.py")
    else:
        cmd("python3 dbcreate.py")
    log("Database reset.")


def eat(args, argc):
    if len(args) == 0:
        usage()
        sys.exit(1)
    arg = args[argc]
    single = False

    try:
        if arg[0] == '-' and arg[1] != '-':
            arg = arg[1:]
            single = True
        elif arg[0:2] == '--':
            arg = arg[2:]
        else:
            raise Exception
    except:
        err(f"Invalid argument: {arg}")

    return (arg, single)


if __name__ == "__main__":
    args = sys.argv
    filename = args[0]

    if len(args) == 1:
        usage()
        sys.exit(0)

    funclst = {
        "h": usage,
        "help": usage,
        "i": install_reqs,
        "install": install_reqs,
        "r": reset_db,
        "reset": reset_db,
        "d": load_demo,
        "demo": load_demo,
        "s": start_server,
        "start": start_server,
    }

    idx = 1

    while idx < len(args):
        arg, single = eat(args, idx)
        idx += 1

        if single:
            for c in arg:
                try:
                    funclst[c]()
                except:
                    err(f"Invalid argument: {c}")
        else:
            try:
                funclst[arg]()
            except:
                err(f"Invalid argument: {arg}")


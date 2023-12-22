#!/usr/local/bin/python3

import platform
import sys
import os

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
    log("Installing requirements...")
    cmd("pip3 install -r requirements.txt")
    log("Requirements installed.")


def load_demo():
    log("Loading demo data...")
    cmd("python3 dbcreate.py demo")
    log("Demo data loaded.")


def start_server():
    global SYSTEM
    log("Starting server...")
    if SYSTEM == "Darwin":
        cmd("brew services start redis")
    else:
        cmd("systemctl start redis-server.service")
    os.system("python3 run.py")


def reset_db():
    log("Resetting database...")
    db_filepath = "./instance/account.db"
    if os.path.exists(db_filepath):
        os.remove(db_filepath)
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
    if WINDOWS:
        err("Windows is no longer supported for development! :((")
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


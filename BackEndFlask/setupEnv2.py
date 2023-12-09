#!/bin/python3

from typing import List, Tuple
import platform
import sys
import os

FILENAME = ""
SYSTEM = platform.system()

def log(msg: str) -> None:
    print(f"[ENV] {msg}")


def err(msg: str) -> None:
    print(f"[ERROR] {msg}")
    sys.exit(1)


def cmd(command: str) -> None:
    try:
        res = os.system(command)
        if res != 0:
            raise Exception
    except:
        log(f"Error running command: {command}")
        sys.exit(1)


def usage() -> None:
    global FILENAME
    print(f"Usage: python3 {filename} [options]")
    print("Options:")
    print("    -h, --help: display this message")
    print("    -i, --install: install requirements")
    print("    -r, --reset: reset database")
    print("    -d, --demo: reset database with demo data")
    print("    -s, --start: start server")


def install_reqs() -> None:
    global SYSTEM
    log("Installing requirements...")
    if SYSTEM == "Windows":
        cmd("pip install -r requirements.txt")
    else:
        cmd("pip3 install -r requirements.txt")
    log("Requirements installed.")


def load_demo() -> None:
    global SYSTEM
    log("Loading demo data...")
    if SYSTEM == "Windows":
        cmd("python dbcreate.py demo")
    else:
        cmd("python3 dbcreate.py demo")
    log("Demo data loaded.")


def start_server() -> None:
    global SYSTEM
    log("Starting server...")
    if SYSTEM == "Windows":
        os.system("python run.py")
    else:
        os.system("python3 run.py")


def reset_db() -> None:
    global SYSTEM
    log("Resetting database...")
    db_filepath = "./instance/account.db"
    if os.path.exists(db_filepath):
        os.remove(db_filepath)
    if SYSTEM == "Windows":
        cmd("python dbcreate.py")
    else:
        cmd("python3 dbcreate.py")
    log("Database reset.")


def eat(args: List[str], argc: int) -> Tuple[str, bool]:
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
    args: List[str] = sys.argv
    filename: str = args[0]

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


#!/usr/local/bin/python3

import subprocess
import platform
import sys
import os

FILENAME = ""

SYSTEM = platform.system()

def log(msg):
    print(f"[ENV] {msg}")


def err(msg):
    print(f"[ERROR] {msg}")


is_docker = os.getenv('DOCKER_BUILD', 'false').lower() == 'true'

pip_cmd = "pip" if is_docker else "pip3"

python_cmd = "python" if is_docker else "python3"


def cmd(command, parent_function):
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)

        log(f"Command output:\n{result.stdout}")

        return result.returncode

    except subprocess.CalledProcessError as e:
        err(f"Currently running in Docker: {is_docker}")

        err(f"Pip command used: {pip_cmd}")

        err(f"Python command used: {python_cmd}")

        err(f"Error running command: {command} in function: {parent_function}")

        err(f"Return code: {e.returncode}")

        err(f"Output: {e.output}")

        err(f"Error output: {e.stderr}")

        sys.exit(1)


def usage():
    global FILENAME

    print(f"Usage: {python_cmd} {FILENAME} [options]")

    print("Options:")

    print("    -h, --help: display this message")

    print("    -i, --install: install requirements")

    print("    -r, --reset: reset database")

    print("    -d, --demo: load the database with demo data")

    print("    -s, --start: start server")

    print("    -t, --test: run tests")


def install_reqs():
    log("Installing requirements...")

    exit_code = cmd(f"{pip_cmd} install -r requirements.txt", "install_reqs()")

    if exit_code != 0:
        err(f"Failed to install requirements with {pip_cmd}. Is it installed?")

        err(f"Process exited with exit code {exit_code}")

        sys.exit(1)

    exit_code = cmd(f"{python_cmd} dbcreate.py", "install_reqs()")

    if exit_code != 0:
        err(f"{python_cmd} failed to run. Is it installed?")

        err(f"Process exited with exit code {exit_code}")

        sys.exit(1)


    log("Requirements installed.")


def load_demo():
    log("Loading demo data...")

    exit_code = cmd(f"{python_cmd} dbcreate.py demo", "load_demo()")

    if exit_code != 0:
        err(f"Failed to load demo data.")

        err(f"Process exited with exit code {exit_code}")

        sys.exit(1)

    log("Demo data loaded.")


def start_server():
    global SYSTEM

    log("Starting server...")

    if is_docker:
        log("Running inside Docker. Skipping Redis server start.")
    else:
        if SYSTEM == "Darwin":
            exit_code = cmd("brew services start redis", "start_server()")
        else:
            is_active = cmd("systemctl is-active redis-server.service > /dev/null", "start_server()")

            if is_active != 0:  # 0 = active
                exit_code = cmd("systemctl start redis-server.service", "start_server()")

                if exit_code != 0:
                    err(f"Failed to start redis server. Exit code: {exit_code}")
                    sys.exit(1)

    exit_code = os.system(f"{python_cmd} run.py")

    if exit_code != 0 and exit_code != 2:
        err(f"{python_cmd} failed to run. Is it installed?")
        err(f"Process exited with exit code {exit_code}")
        sys.exit(1)


def reset_db():
    log("Resetting database...")

    db_filepath = "./instance/account.db"

    if os.path.exists(db_filepath):
        os.remove(db_filepath)

    exit_code = cmd(f"{python_cmd} dbcreate.py", "reset_db()")

    if exit_code != 0:
        err(f"{python_cmd} failed to run. Is it installed?")

        err(f"Process exited with exit code {exit_code}")

        sys.exit(1)

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
        err(f"Invalid argument `{arg}`")

        sys.exit(1)

    return (arg, single)


def start_tests():
    log("Starting tests...")

    cmd(f"{python_cmd} -m pytest", "start_tests()")

    log("Finished tests")


if __name__ == "__main__":
    if SYSTEM == "Windows":
        err("Windows is no longer supported for development. :((")

        sys.exit(1)

    args = sys.argv

    filename = args[0]

    if len(args) == 1:
        usage()

        sys.exit(0)

    # To add a new argument,
    #  1. add the shorthand version (1 char)
    #  2. add the longer version (full word)
    #  3. create the appropriate function
    # No other steps are required.

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
        "t": start_tests,
        "test": start_tests,
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
                    err(f"could not read argument: `{arg}` either because a previous command failed, or it is invalid. See -h for help.")

        else:
            try:
                funclst[arg]()

            except:
                err(f"could not read argument: `{arg}` either because a previous command failed, or it is invalid. See -h for help.")

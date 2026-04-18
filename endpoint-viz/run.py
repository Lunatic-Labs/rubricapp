#!/usr/bin/env python3

import os
import sys
from pathlib import Path

def cmd(c: str) -> int:
    print(f'>>> {c}')
    return os.system(c)


def usage():
    print()
    print('=== run.py Wrapper Script ===')
    print()
    print('Usage: python3 run.py [COMMAND] -- <PASSED_ARGS>')
    print()
    print('Wrapper Commands:')
    print('  help      Show this help message')
    print('  install   Install dependencies (creates .env venv)')
    print()
    print('Any arguments after "--" are passed directly to endpoint-viz')
    sys.exit(0)


def install():
    """Install dependencies in a virtual environment."""
    req = 'tree-sitter tree-sitter-python tree-sitter-typescript'
    print("Creating virtual environment and installing dependencies...")

    cmd('python3 -m venv .env')
    activate_cmd = '. .env/bin/activate && pip install --upgrade pip'
    install_cmd = f'. .env/bin/activate && pip install {req}'

    if cmd(activate_cmd) != 0 or cmd(install_cmd) != 0:
        print("Installation failed")
        sys.exit(1)


def main():
    if len(sys.argv) <= 1:
        usage()

    if '--' in sys.argv:
        sep_index = sys.argv.index('--')
        wrapper_args = sys.argv[1:sep_index]
        main_args = sys.argv[sep_index + 1:]
    else:
        wrapper_args = sys.argv[1:]
        main_args = []

    if len(wrapper_args) == 1:
        action = wrapper_args[0].lower()
        if action in ('help', '-h', '--help'):
            usage()
        elif action == 'install':
            install()
            sys.exit(0)

    if not Path('.env/bin/python3').exists():
        print("Error: Virtual environment not found.")
        print("Run: python3 run.py install")
        sys.exit(1)

    python_cmd = '.env/bin/python3 ./main.py'
    if main_args:
        python_cmd += ' ' + ' '.join(main_args)

    exit_code = cmd(python_cmd)
    sys.exit(exit_code)


if __name__ == '__main__':
    main()

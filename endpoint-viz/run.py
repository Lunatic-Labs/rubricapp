#!/usr/bin/env python3

import os
import sys


def usage():
    print('Usage: python3 run.py [OPTION]')
    print('Options:')
    print('  help    - show this message')
    print('  install - install dependencies')
    sys.exit(0)


def install():
    req = 'tree-sitter tree-sitter-python tree-sitter-typescript'
    os.system('python3 -m venv .env')
    os.system(f'. .env/bin/activate && pip3 install {req}')

def run():
    return os.system('.env/bin/python3 ./main.py')

if __name__ == '__main__':
    if len(sys.argv) <= 1:
        if run() != 0: usage()
    elif sys.argv[1] == 'install':
        install()
    else:
        usage()

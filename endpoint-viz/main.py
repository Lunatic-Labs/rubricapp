#!/usr/bin/env python3

import tree_sitter_python as tspython
from tree_sitter import Language, Parser

import sys

PY_LANGUAGE = Language(tspython.language())

def load_file(path):
    try:
        src = None
        with open(path, 'r', encoding='utf8') as f:
            src = f.read()
            assert src is not None
            return bytes(src, encoding='utf8')
    except Exception as e:
        print(f'error: {e}', file=sys.stderr)
        return None

def main():
    try:
        src       = load_file('1.py.in')
        parser    = Parser(PY_LANGUAGE)
        tree      = parser.parse(src)

        root_node = tree.root_node
    except Exception as e:
        print(f'error: {e}', file=sys.stderr)

if __name__ == '__main__': main()

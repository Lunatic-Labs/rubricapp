import sys
import os

try:
    import tree_sitter_python as tspython
    import tree_sitter_typescript as tstypescript
    from tree_sitter import Language, Parser
except Exception as e:
    print('Could not import dependencies, call `python3 run.py install` then `python3 run.py`', file=sys.stderr)
    sys.exit(1)

import endpoint
import endpointcall


PY_LANGUAGE  = Language(tspython.language())
TSX_LANGUAGE = Language(tstypescript.language_tsx())


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


def parse_python():
    path      = '1.in.py'
    src       = load_file(path)
    parser    = Parser(PY_LANGUAGE)
    tree      = parser.parse(src)
    root_node = tree.root_node
    endpoints = list(endpoint.find(root_node, src, path))

    for ep in endpoints:
        print(ep)


def parse_tsx():
    path      = '2.in.tsx'
    src       = load_file(path)
    parser    = Parser(TSX_LANGUAGE)
    tree      = parser.parse(src)
    root_node = tree.root_node
    calls     = list(endpointcall.find(root_node, src, path))

    for call in calls:
        print(call)


def main():
    try:
        parse_python()
        parse_tsx()
    except Exception as e:
        print(f'error: {e}', file=sys.stderr)


if __name__ == '__main__':
    main()

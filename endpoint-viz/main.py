import sys
import os
import argparse
from pathlib import Path
from typing import List

try:
    import tree_sitter_python as tspython
    import tree_sitter_typescript as tstypescript
    from tree_sitter import Language, Parser
except Exception as e:
    print('Could not import dependencies, call `python3 run.py install` then `python3 run.py`', file=sys.stderr)
    sys.exit(1)

import endpoint
import endpointcall
import inout
import utils
import glconf


PY_LANGUAGE  = Language(tspython.language())
TSX_LANGUAGE = Language(tstypescript.language_tsx())


def parse_python(path):
    src       = inout.load_file(path)
    parser    = Parser(PY_LANGUAGE)
    tree      = parser.parse(src)
    endpoints = list(endpoint.find(tree.root_node, src, path))
    return endpoints


def parse_tsx(path):
    src       = inout.load_file(path)
    parser    = Parser(TSX_LANGUAGE)
    tree      = parser.parse(src)
    calls     = list(endpointcall.find(tree.root_node, src, path))
    return calls


def parse_args():
    parser = argparse.ArgumentParser(
        prog='endpoint-viz',
        description='Visualize endpoints called throughout Rubricapp',
    )

    parser.add_argument(
        '--nocolor',
        action='store_true',
        help='Disable colored output'
    )

    parser.add_argument(
        '--nogui',
        action='store_true',
        help='Disable GUI (run in headless mode)'
    )

    parser.add_argument(
        '-e',
        '--exportmap',
        action='store_true',
        help='Export map/data'
    )

    parser.add_argument(
        '--py',
        required=True,
        type=Path,
        metavar='PATH',
        help='Path to Python files directory'
    )

    parser.add_argument(
        '--tsx',
        required=True,
        type=Path,
        metavar='PATH',
        help='Path to TypeScript/React (.tsx) files directory'
    )

    args = parser.parse_args()

    return args


def link_calls(endpoints:      List[endpoint.Endpoint],
               endpoint_calls: List[endpointcall.EndpointCall]):
    for e in endpoints:
        print(e)
    for c in endpoint_calls:
        print(c)


def main():
    try:
        pyfiles        = inout.collect_files_by_extension(glconf.state.pypath, 'py')
        tsxfiles       = inout.collect_files_by_extension(glconf.state.tsxpath, 'tsx')
        endpoints      = []
        endpoint_calls = []

        for f in pyfiles:  endpoints      += parse_python(f)
        for f in tsxfiles: endpoint_calls += parse_tsx(f)

        link_calls(endpoints, endpoint_calls)

    except Exception as e:
        print(f'error: {e}', file=sys.stderr)


if __name__ == '__main__':
    args                 = parse_args()
    glconf.state.pypath  = args.py
    glconf.state.tsxpath = args.tsx
    main()

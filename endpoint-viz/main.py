import sys
import os
from enum import Enum

try:
    import tree_sitter_python as tspython
    import tree_sitter_typescript as tstypescript
    from tree_sitter import Language, Parser
except Exception as e:
    print('Could not import dependencies, call `python3 run.py install` then `python3 run.py`', file=sys.stderr)
    sys.exit(1)


PY_LANGUAGE  = Language(tspython.language())
TSX_LANGUAGE = Language(tstypescript.language_tsx())


class Location:
    def __init__(self, r, c, path):
        self.r    = r
        self.c    = c
        self.path = path


class Endpoint:
    def __init__(self, func_name, endpoint_str, location):
        self.func_name    = func_name
        self.endpoint_str = endpoint_str
        self.location     = location

    def __str__(self):
        return f'{self.func_name} -> {self.endpoint_str} @ line {self.location.r}, column {self.location.c}'


class EndpointCall:
    class Kind(Enum):
        GET  = 0
        POST = 1
        PUT  = 2

    def __init__(self, kind, dst, args, location):
        self.kind     = kind
        self.dst      = dst
        self.args     = args
        self.location = location

    def __str__(self):
        return f'{self.kind.name} -> {self.dst}, args = {self.args} @ line {self.location.r}, column {self.location.c}'



def find_api_endpoints(node, src, path):
    if node.type == 'decorated_definition':
        decorators = [child for child in node.children if child.type == 'decorator']
        for d in decorators:
            text = src[d.start_byte:d.end_byte].decode('utf8')
            if text.startswith('@bp.route'):
                # Get underlying function node
                func_node = next((c for c in node.children if c.type == 'function_definition'), None)
                if func_node:
                    name_node = next((c for c in func_node.children if c.type == 'identifier'), None)
                    func_name = src[name_node.start_byte:name_node.end_byte].decode('utf8') if name_node else '<unknown>'
                    start     = text.find('(')
                    end       = text.rfind(')')
                    route_str = text[start+1:end].strip() if start != -1 and end != -1 else ''
                    loc       = Location(func_node.start_point[0]+1, func_node.start_point[1]+1, path)
                    yield Endpoint(func_name, route_str, loc)
                # already found @bp.route
                break

    for child in node.children:
        yield from find_api_endpoints(child, src, path)


def find_endpoint_calls(node, src, path):
    if node.type == 'call_expression':
        func_node = next((c for c in node.children if c.type == 'identifier'), None)
        if func_node:
            func_name = src[func_node.start_byte:func_node.end_byte].decode('utf8')
            kind = None

            if func_name == 'genericResourcePOST':
                kind = EndpointCall.Kind.POST
            elif func_name == 'genericResourcePUT':
                kind = EndpointCall.Kind.PUT
            elif func_name == 'genericResourceGET':
                kind = EndpointCall.Kind.GET

            if kind is not None:
                args_node = next((c for c in node.children if c.type == 'arguments'), None)
                args = []
                if args_node:
                    for arg in args_node.children:
                        # filtering punctuation
                        if arg.type != ',':
                            arg_text = src[arg.start_byte:arg.end_byte].decode('utf8')
                            args.append(arg_text)

                loc = Location(node.start_point[0]+1, node.start_point[1]+1, path)
                yield EndpointCall(kind, func_name, args, loc)

    for child in node.children:
        yield from find_endpoint_calls(child, src, path)


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
    endpoints = list(find_api_endpoints(root_node, src, path))

    for ep in endpoints:
        print(ep)


def parse_tsx():
    path      = '2.in.tsx'
    src       = load_file(path)
    parser    = Parser(TSX_LANGUAGE)
    tree      = parser.parse(src)
    root_node = tree.root_node
    calls     = list(find_endpoint_calls(root_node, src, path))

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

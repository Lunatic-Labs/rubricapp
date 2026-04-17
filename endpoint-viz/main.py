import sys
import os

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
        pypath    = '1.in.py'
        src       = load_file(pypath)
        parser    = Parser(PY_LANGUAGE)
        tree      = parser.parse(src)

        root_node = tree.root_node

        endpoints = list(find_api_endpoints(root_node, src, pypath))
        for ep in endpoints:
            print(f'{ep.func_name} -> {ep.endpoint_str} @ line {ep.location.r}, column {ep.location.c}')

    except Exception as e:
        print(f'error: {e}', file=sys.stderr)


if __name__ == '__main__':
    main()

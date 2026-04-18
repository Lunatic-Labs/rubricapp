from enum import Enum

import tree_sitter_typescript as tstypescript

from location import Location

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
        return f'{self.kind.name} -> {self.dst}, args = {self.args} @ {self.location}'

    def to_dict(self):
        return {
            "from": self.location.path,  # Origin location path
            "to": self.dst,  # Destination endpoint string
            "kind": self.kind.name,
            "args": self.args
        }


def trimdst(s):
    s = s.strip()
    if s[0] == '`' or s[0] == '\'' or s[0] == '"':
        s = s[1:]
        end   = s.find('?')
        s = s[0:end if end != -1 else len(s)]
    if s[-1] == '`' or s[-1] == '\'' or s[-1] == '"':
        s = s[0:-1]
    return s


def find(node, src, path):
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
                args      = []
                dst       = None
                if args_node:
                    real_args = [c for c in args_node.children if c.type not in (',', '(', ')')]

                    for i, arg in enumerate(real_args):
                        arg_text = src[arg.start_byte:arg.end_byte].decode('utf8')
                        args.append(arg_text)
                        if i == 0:
                            dst = arg_text

                loc = Location(node.start_point[0]+1, node.start_point[1]+1, path)
                yield EndpointCall(kind, trimdst(dst), args, loc)

    for child in node.children:
        yield from find(child, src, path)


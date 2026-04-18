import tree_sitter_python as tspython

from location import Location

class Endpoint:
    def __init__(self, func_name, endpoint_str, location):
        self.func_name    = func_name
        self.endpoint_str = endpoint_str
        self.location     = location

    def __str__(self):
        return f'{self.func_name} -> {self.endpoint_str} @ {self.location}'

    def to_dict(self):
        return {
            "id": self.endpoint_str,
            "label": self.endpoint_str,
            "data": {
                "func_name": self.func_name,
                "location": str(self.location)
            }
        }


def find(node, src, path):
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
                    #end       = text.rfind(')')
                    end       = text.rfind(',')
                    route_str = text[start+1:end].strip() if start != -1 and end != -1 else ''
                    if route_str[0] == '\'' or route_str[0] == '"':
                        route_str = route_str[1:]
                    if route_str[-1] == '\'' or route_str[-1] == '"':
                        route_str = route_str[0:-1]
                    loc       = Location(func_node.start_point[0]+1, func_node.start_point[1]+1, path)
                    yield Endpoint(func_name, route_str, loc)
                # already found @bp.route
                break

    for child in node.children:
        yield from find(child, src, path)

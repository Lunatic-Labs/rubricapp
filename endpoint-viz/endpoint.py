import tree_sitter_python as tspython
from glconf import GET, PUT, POST

from location import Location

class Endpoint:
    def __init__(self, func_name, endpoint_str, location, kind):
        self.func_name    = func_name
        self.endpoint_str = endpoint_str
        self.location     = location
        self.kind         = kind

    def __str__(self):
        return f'{self.func_name} -> {self.endpoint_str} @ {self.location}'


def find(node, src, path):
    method_map = {
        'GET': GET,
        'POST': POST,
        'PUT': PUT
    }
    UNKNOWN = -1

    if node.type == 'decorated_definition':
        decorators = [child for child in node.children if child.type == 'decorator']
        for d in decorators:
            text = src[d.start_byte:d.end_byte].decode('utf8')

            if text.startswith('@bp.route'):
                # Find function
                func_node = next((c for c in node.children if c.type == 'function_definition'), None)
                if not func_node:
                    continue

                # Get function name
                name_node = next((c for c in func_node.children if c.type == 'identifier'), None)
                func_name = src[name_node.start_byte:name_node.end_byte].decode('utf8') if name_node else '<unknown>'

                # Get route string
                start = text.find('(')
                end   = text.find(',')
                route_str = ''
                if start != -1 and end != -1:
                    route_str = text[start+1:end].strip()
                    if route_str[0] in ("'", '"'):
                        route_str = route_str[1:]
                    if route_str[-1] in ("'", '"'):
                        route_str = route_str[:-1]

                methods = ['GET']

                methods_pos = text.find('methods=')
                if methods_pos != -1:
                    methods_start = text.find('[', methods_pos)
                    methods_end   = text.find(']', methods_pos)
                    if methods_start != -1 and methods_end != -1:
                        methods_list = text[methods_start+1:methods_end].split(',')
                        methods = []
                        for m in methods_list:
                            m_clean = m.strip().strip("'\"").upper()
                            if m_clean in method_map:
                                methods.append(m_clean)
                            else:
                                methods.append('UNKNOWN')

                loc = Location(func_node.start_point[0]+1, func_node.start_point[1]+1, path)
                for m in methods:
                    kind = method_map.get(m, UNKNOWN)
                    yield Endpoint(func_name, route_str, loc, kind)

                # Already found @bp.route
                break

    for child in node.children:
        yield from find(child, src, path)

import sys
import os
import argparse
import json

from pathlib import Path
from typing import List, Any, Dict

try:
    import tree_sitter_python     as tspython
    import tree_sitter_typescript as tstypescript
    from tree_sitter import Language, Parser
except Exception as e:
    print('Could not import dependencies, either call `python3 run.py install` then `python3 run.py -- <ARGS...>`', file=sys.stderr)
    print('or manage the virtual environment manually.', file=sys.stderr)
    sys.exit(1)

import endpoint
import endpointcall
import inout
import utils
import glconf


PY_LANGUAGE  = Language(tspython.language())
TSX_LANGUAGE = Language(tstypescript.language_tsx())


def create_graph(elements: List[Dict], output_path: str = "graph.html"):
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Endpoint Graph</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.33.1/cytoscape.min.js"></script>
    <style>
        body {{ margin:0; font-family: system-ui, sans-serif; background:#1e1e1e; color:#eee; }}
        #header {{ padding:12px 20px; background:#2d2d2d; border-bottom:1px solid #444; display:flex; align-items:center; gap:20px; }}
        #cy {{ width:100%; height:calc(100vh - 56px); }}
        .modal {{ display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); align-items:center; justify-content:center; z-index:1000; }}
        .modal-content {{ background:#2d2d2d; padding:24px; border-radius:8px; max-width:600px; width:90%; max-height:90vh; overflow:auto; box-shadow:0 10px 30px rgba(0,0,0,0.5); }}
        .close {{ float:right; font-size:28px; cursor:pointer; }}
        button {{ padding:8px 16px; background:#4A90E2; color:white; border:none; border-radius:4px; cursor:pointer; }}
        button:hover {{ background:#357ABD; }}
        .legend {{ display:flex; gap:16px; font-size:14px; }}
        .legend-item {{ display:flex; align-items:center; gap:6px; }}
        .dot {{ width:16px; height:16px; border-radius:50%; }}
        .rect {{ width:20px; height:12px; border-radius:2px; }}
    </style>
</head>
<body>
    <div id="header">
        <h1 style="margin:0;font-size:20px;">Endpoint -> Call Graph</h1>
        <button onclick="resetLayout()">Reset Layout</button>
        <div class="legend">
            <div class="legend-item"><div class="rect" style="background:#4A90E2;"></div> Endpoint</div>
            <div class="legend-item"><div class="dot" style="background:#F39C12;"></div> Endpoint Call</div>
            <div class="legend-item">-> calls endpoint</div>
        </div>
        <div style="margin-left:auto;font-size:14px;color:#aaa;">Drag nodes; Pan with mouse; Scroll to zoom; Click for details</div>
    </div>
    <div id="cy"></div>

    <!-- Modal -->
    <div id="modal" class="modal" onclick="if(event.target.id==='modal')hideModal()">
        <div class="modal-content" onclick="event.stopImmediatePropagation()">
            <span class="close" onclick="hideModal()">&times;</span>
            <div id="modal-content"></div>
        </div>
    </div>

    <script>
        const elements = {json.dumps(elements)};

        const cy = cytoscape({{
            container: document.getElementById('cy'),
            elements: elements,
            style: [
                {{
                    selector: 'node',
                    style: {{
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'font-size': '13px',
                        'font-family': 'monospace',
                        'width': '50px',
                        'height': '50px',
                        'text-wrap': 'wrap',
                        'text-max-width': '120px',
                        'color': '#ffffff'
                    }}
                }},
                {{
                    selector: 'node[type="endpoint"]',
                    style: {{ 'background-color': '#4A90E2', 'shape': 'round-rectangle' }}
                }},
                {{
                    selector: 'node[type="call"]',
                    style: {{ 'background-color': '#F39C12', 'shape': 'ellipse' }}
                }},
                {{
                    selector: 'edge',
                    style: {{
                        'width': 3,
                        'line-color': '#7F8C8E',
                        'target-arrow-color': '#7F8C8E',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'arrow-scale': 1.2
                    }}
                }}
            ],
            layout: {{
                name: 'cose',
                animate: true,
                animationDuration: 800,
                nodeRepulsion: 8000,
                idealEdgeLength: 120
            }}
        }});

        // Click handler
        cy.on('tap', 'node', function(evt) {{
            const node = evt.target;
            const data = node.data();
            showModal(data);
        }});

        function showModal(data) {{
            let html = `<h2>${{data.label}}</h2><p><strong>Type:</strong> ${{data.type}}</p>`;

            if (data.type === 'endpoint') {{
                html += `
                    <p><strong>Function name:</strong> ${{data.func_name}}</p>
                    <p><strong>Endpoint:</strong> <code>${{data.endpoint_str}}</code></p>
                    <p><strong>Location:</strong> <code>${{data.location.path}}:${{data.location.r}}:${{data.location.c}}</code></p>
                `;
            }} else {{
                html += `
                    <p><strong>Method:</strong> ${{data.kind}}</p>
                    <p><strong>Destination:</strong> <code>${{data.dst}}</code></p>
                    <p><strong>Args:</strong> <code>${{JSON.stringify(data.args)}}</code></p>
                    <p><strong>Location:</strong> <code>${{data.location.path}}:${{data.location.r}}:${{data.location.c}}</code></p>
                `;
            }}

            document.getElementById('modal-content').innerHTML = html;
            document.getElementById('modal').style.display = 'flex';
        }}

        function hideModal() {{
            document.getElementById('modal').style.display = 'none';
        }}

        function resetLayout() {{
            cy.layout({{ name: 'cose', animate: true, animationDuration: 800 }}).run();
            setTimeout(() => cy.fit(), 900);
        }}

        // Initial fit
        cy.ready(() => cy.fit());
    </script>
</body>
</html>
"""
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_template)
    print(f"Graph written to {output_path}")


def generate_graph_elements(endpoints:      List[endpoint.Endpoint],
                            endpoint_calls: List[endpointcall.EndpointCall]) -> List[Dict[str, Any]]:
    elements: List[Dict[str, Any]] = []

    endpoint_map: Dict[tuple[str, int], str] = {}  # (endpoint_str, kind) -> node_id

    # endpoints
    for idx, point in enumerate(endpoints):
        node_id = f"ep_{idx}"
        key = (point.endpoint_str, point.kind)
        endpoint_map[key] = node_id

        elements.append({
            "data": {
                "id": node_id,
                "label": f"{point.func_name} ({point.endpoint_str} [{glconf.KIND_NAME[point.kind]}])",
                "type": "endpoint",
                "func_name": point.func_name,
                "endpoint_str": point.endpoint_str,
                "kind": glconf.KIND_NAME[point.kind],
                "location": point.location.to_dict(),
            }
        })

    # calls
    for idx, call in enumerate(endpoint_calls):
        kind_name = glconf.KIND_NAME[call.kind]
        node_id = f"call_{idx}"

        elements.append({
            "data": {
                "id": node_id,
                "label": f"{kind_name} {call.dst}",
                "type": "call",
                "kind": kind_name,
                "dst": call.dst,
                "args": call.args,
                "location": call.location.to_dict(),
            }
        })

        # link to correct endpoint
        key = (call.dst, call.kind)
        if key in endpoint_map:
            elements.append({
                "data": {
                    "id": f"edge_{idx}",
                    "source": node_id,
                    "target": endpoint_map[key],
                }
            })

    return elements


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
        help='Disable colored output (unimplemented)'
    )

    parser.add_argument(
        '--nogui',
        action='store_true',
        help='Disable GUI (run in headless mode) (unimplemented)'
    )

    parser.add_argument(
        '-e',
        '--exportmap',
        action='store_true',
        help='Export map/data (unimplemented)'
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
        help='Path to TypeScript/React files directory'
    )

    args = parser.parse_args()

    return args


def link_calls(endpoints:      List[endpoint.Endpoint],
               endpoint_calls: List[endpointcall.EndpointCall]):
    linked, unlinked = [], []

    for call in endpoint_calls:
        found = False
        for point in endpoints:
            if point.endpoint_str == call.dst \
               and point.kind == call.kind:
                found = True
                break
        if found:
            linked.append((call, point))
        else:
            unlinked.append(call)

    return linked, unlinked


def main():
    pyfiles        = inout.collect_files_by_extension(glconf.state.pypath, 'py')
    tsxfiles       = inout.collect_files_by_extension(glconf.state.tsxpath, 'tsx')
    endpoints      = []
    endpoint_calls = []

    for f in pyfiles:  endpoints      += parse_python(f)
    for f in tsxfiles: endpoint_calls += parse_tsx(f)

    linked, unlinked = link_calls(endpoints, endpoint_calls)

    elements = generate_graph_elements(endpoints, endpoint_calls)
    create_graph(elements, "index.html")

    for l in linked:   print(f'Linked: {l}')
    for u in unlinked: print(f'Unlinked: {u}')

    print('\n*** OPEN `index.html\' IN A WEB BROWSER TO VIEW THE CALL GRAPH ***')

    sys.exit(0)


if __name__ == '__main__':
    args                 = parse_args()
    glconf.state.pypath  = args.py
    glconf.state.tsxpath = args.tsx
    main()

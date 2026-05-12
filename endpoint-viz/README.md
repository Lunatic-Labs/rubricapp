# Endpoint Viz

## About

This is a small python application to help with visualization of the codebase which is at the time of writing this, ~200,000 LOC
(*hint*: `find . -type f -regex '.*\.\(py\|tsx\)$' -exec cat {} + | wc -l` in the project root if you are curious).

## Setup

This project is composed of a runner script and the actual application. While a virtual environment is needed, it is managed for you automatically.

Set up the environment and get the dependencies via:

```py
python3 run.py install
```

This will install (__locally__):
- `tree-sitter`
- `tree-sitter-python`
- `tree-sitter-typescript`

*Note*: `tree-sitter` is a parsing library.

Once this is done, you can now issue commands to the endpoint visualizer with `python3 run.py -- <ENDPOINT-VIZ ARGS>`.

## Usage

The application requires two directories, one with Python files and one with Typescript files.
It searches the directories recursively, so you only need to provide a starting parent directory for each.

Do the following:

```py
python3 run.py -- --tsx=../FrontEndReact --py=../BackEndFlask
```

It will then scour the codebase for any endpoints (backend) and endpoint calls (frontend) and build
a call graph in a HTML file.

When this is running, STDOUT can be ignored (unless an error occurred), as the important part is the HTML file.
Open this file in a web browser of your choice where URL = `file://</PATH/TO/HTML/FILE>`.

From here, you can pan, move nodes around, zoom in/out, and click on any of the nodes for information. It shows the specific location
where each endpoint and endpoint call occurs.


#-----------------------------------------------------------------------
# This is a file that is run by Github actions to ensure we are running
# the correct dependencies.
#
# Date last modified: Tue Jun  3 12:30:35 PM CDT 2025
#-----------------------------------------------------------------------

import difflib

req_file = open('BackEndFlask/requirements.txt')
current_file = open('test.txt')

with open('BackEndFlask/requirements.txt', 'r') as req_file:
    req = [line.replace(" ", "").strip() for line in req_file if line.strip() and not line.startswith("#")]
with open('test.txt', 'r') as current_file:
    current = [line.strip() for line in current_file if line.strip()]

delta = difflib.ndiff(req, current)
missing_deps = [line[2:] for line in delta if line.startswith('- ')]

print(missing_deps)

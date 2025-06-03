#-----------------------------------------------------------------------
# This is a file that is run by Github actions to ensure we are running
# the correct dependencies.
#
# Date last modified: Tue Jun  3 12:30:35 PM CDT 2025
#-----------------------------------------------------------------------

import difflib

req_file = open('BackEndFlask/requirements.txt')
current_file = open('temp_dependencies.txt')

with open('BackEndFlask/requirements.txt', 'r') as req_file:
    req = [line.replace(" ", "").strip() for line in req_file if line.strip() and not line.startswith("#")]
with open('test.txt', 'r') as current_file:
    current = [line.strip() for line in current_file if line.strip()]

diff = difflib.ndiff(req, current)
delta = ''.join([x for x in diff if x.startswith('-')])

print(delta)

#-----------------------------------------------------------------------
# This is a file that is run by Github actions to ensure we are running
# the correct dependencies.
#
# Date last modified: Tue Jun  3 03:00:58 PM CDT 2025
#-----------------------------------------------------------------------

import difflib

with open('BackEndFlask/requirements.txt', 'r') as req_file:
    req = [line.replace(" ", "").strip().lower() for line in req_file if line.strip() and not line.startswith("#")]
with open('temp_dependencies.txt', 'r') as current_file:
    current = [line.strip().lower() for line in current_file if line.strip()]

diff = difflib.ndiff(req, current)
delta = ''.join([x for x in diff if x.startswith('-')])

if delta:
    print(delta)
    print("currently:")
    print(current)
else:
    print("Full match")

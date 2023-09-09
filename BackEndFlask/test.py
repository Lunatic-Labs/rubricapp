import sys
import os

try:
    # if (os.system("sudo-apt install redis-server") != 0):
    if (os.system("brew --version") != 0):
        raise Exception
except Exception:
        # print("Running sudo-apt install redis-server failed...")
        print("Running brew --version failed...")
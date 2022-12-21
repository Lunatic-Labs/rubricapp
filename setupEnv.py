import os
from sys import platform

# short script to get environment running before running tests

accountFile = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")
def main():
    try:
        if os.system("rm " + accountFile) != 0:
            pass
    except:
        pass
    try:
        if os.system("rm -r users") != 0:
            pass
    except:
        pass
    os.system("mkdir users")
    if platform == "linux" or platform == "linux2":
        os.system("python3 dbcreate.py .")
        os.system("python3 run.py .")
    elif platform == "darwin":
        os.system("python3 dbcreate.py .")
        os.system("python3 run.py .")
    elif platform == "win32":
        os.system("python dbcreate.py .")
        os.system("python run.py .")

if __name__ == "__main__":
    main()
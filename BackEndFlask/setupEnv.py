from sys import platform
import os

# short script to get environment running before running tests

def main():
    if platform == "linux" or platform == "linux2":
        accountFile = os.getcwd() + os.path.join(os.path.sep, "instance") + os.path.join(os.path.sep, "account.db")
        try:
            os.system("rm " + accountFile)
        except:
            pass
        os.system("python3 dbcreate.py .")
        os.system("python3 run.py .")
    elif platform == "darwin":
        accountFile = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")
        try:
            os.system("rm " + accountFile)
        except:
            pass
        os.system("python3 dbcreate.py .")
        os.system("python3 run.py .")
    elif platform == "win32":
        accountFile = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")
        try:
            os.system("del " + "\"" + accountFile + "\"")
        except:
            pass
        os.system("python dbcreate.py .")
        os.system("python run.py .")

if __name__ == "__main__":
    main()
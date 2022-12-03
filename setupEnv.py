import os

# short script to get environment running before running tests

def main():
    accountFile = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")
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
    os.system("python3 dbcreate.py .")
    os.system("python3 run.py .")


if __name__ == "__main__":
    main()

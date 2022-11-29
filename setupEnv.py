import os

# short script to get environment running before running tests


def main():
    accountFile = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")
    os.system("rm " + accountFile)
    os.system("rm -r users")
    os.system("mkdir users")
    os.system("python3 dbcreate.py .")
    os.system("python3 run.py .")


if __name__ == "__main__":
    main()

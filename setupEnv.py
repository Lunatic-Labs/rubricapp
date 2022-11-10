import os

# short script to get environment running before running tests


def main():
    os.system("rm account.db")
    os.system("rm -r users")
    os.system("mkdir users")
    os.system("python3 dbcreate.py .")
    os.system("python3 run.py .")


if __name__ == "__main__":
    main()

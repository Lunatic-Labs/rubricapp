import os

# short script to get environment running before running tests


def main():
    os.system("rm account.db")
    os.system("python3 dbcreate.py .")
    os.system("python3 app.py .")


if __name__ == "__main__":
    main()

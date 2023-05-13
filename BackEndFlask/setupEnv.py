from sys import platform
import time
import sys
import os

def main():
    sleepTime = 0.5
    print("[Server] starting...")
    time.sleep(sleepTime/2)
    if len(sys.argv) == 2 and sys.argv[1]=="resetdb":
        accountDBPath = os.path.join(os.sep, "account.db")
        coreFile = os.getcwd() + os.path.join(os.sep, "core")
        instanceFile = os.getcwd() + os.path.join(os.sep, "instance")
        print("[Server] locating instance folder...")
        time.sleep(sleepTime)
        if os.path.exists(instanceFile):
            print("[Server] instance folder found")
            time.sleep(sleepTime)
            accountDBPath = instanceFile + accountDBPath
        else:
            print("[Server] instance folder not found...")
            time.sleep(sleepTime)
            print("[Server] locating core folder...")
            time.sleep(sleepTime)
            print("[Server] core folder found")
            accountDBPath = coreFile + accountDBPath
        if os.path.exists(accountDBPath):
            print("[Server] account.db file exists...")
            time.sleep(sleepTime)
            try:
                print(f"[Server] attempting rm account.db...")
                time.sleep(sleepTime)
                os.system("rm " + accountDBPath)
                print(f"[Server] successfully rm account.db")
                time.sleep(sleepTime)
            except:
                print(f"[Server] attempting rm account.db failed...")
                time.sleep(sleepTime)
                try:
                    print(f"[Server] attempting to del account.db...")
                    time.sleep(sleepTime)
                    os.system("del " + "\"" + accountDBPath + "\"")
                    print(f"[Server] successfully del account.db")
                    time.sleep(sleepTime)
                except:
                    print("[Server] attempting del account.db failed...")
                    time.sleep(sleepTime)
        else:
            print("[Server] account.db file does not exist therefore does not need to be removed")
            time.sleep(sleepTime)
    try:
        print("[Server] attempting to run dbcreate.py...\n")
        time.sleep(sleepTime)
        os.system("python3 dbcreate.py")
        time.sleep(sleepTime)
    except Exception:
        print("[Server] attempting to create new account.db failed...")
        time.sleep(sleepTime)
        print("[Server] exiting...")
        time.sleep(sleepTime)
        os.abort()
    try:
        print("\n[Server] attempting to run python3 run.py...\n")
        time.sleep(sleepTime)
        os.system("python3 run.py")
    except:
        print("[Server] attempting to run python3 run.py failed...")
        time.sleep(sleepTime)
        try:
            print("\n[Server] attempting to run python run.py...\n")
            time.sleep(sleepTime)
            os.system("python run.py")
        except:
            print("[Server] attempting to run python run.py failed...")
            time.sleep(sleepTime)
            print("[Server] exiting...")
            time.sleep(sleepTime)
            os.abort()

    # if platform == "linux" or platform == "linux2" or platform == "win64":
    #     accountFile = os.getcwd() + os.path.join(os.path.sep, "instance") + os.path.join(os.path.sep, "account.db")
    #     try:
    #         os.system("rm " + accountFile)
    #     except:
    #         pass
    #     os.system("python3 dbcreate.py")
    #     os.system("python3 run.py")
    # elif platform == "darwin":
    #     accountFile = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")
    #     try:
    #         os.system("rm " + accountFile)
    #     except:
    #         pass
    #     os.system("python3 dbcreate.py")
    #     os.system("python3 run.py")
    # elif platform == "win32":
    #     accountFile = os.getcwd() + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "account.db")
    #     if not os.path.exists(accountFile):
    #         accountFile = os.getcwd() + os.path.join(os.path.sep, "instance") + os.path.join(os.path.sep, "account.db")
    #     try:
    #         os.system("del " + "\"" + accountFile + "\"")
    #     except:
    #         pass
    #     os.system("python dbcreate.py")
    #     os.system("python run.py")

if __name__ == "__main__":
    main()
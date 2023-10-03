import time
import sys
import os
import atexit

def main():
    sleepTime = 0.5
    print("[Server] starting...")
    time.sleep(sleepTime/2)
    print('[Server] attempting to run pip3 install requirements...')
    try:
        if(os.system("pip3 install -r requirements.txt") != 0):
            raise Exception
        time.sleep(sleepTime)
    except Exception:
        print("[Server] attempting to run pip3 install requirements failed...")
        time.sleep(sleepTime)
        print('[Server] attempting to run pip install requirements...')
        try:
            if(os.system("pip install -r requirements.txt") != 0):
                raise Exception
            time.sleep(sleepTime)
        except:
            print("[Server] attempting to run pip install requirements failed...")
            print("[Server] exiting...")
            os.abort()
    if (len(sys.argv) == 2 and sys.argv[1]=="resetdb") or (len(sys.argv) == 3 and sys.argv[1]=="resetdb" and sys.argv[2]=="demo"):
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
                if os.system("rm " + accountDBPath) != 0:
                    raise Exception
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
        if (len(sys.argv) == 3 and sys.argv[1]=="resetdb" and sys.argv[2]=="demo"):
            print("[Server] attempting to run python3 dbcreate.py demo...\n")
            time.sleep(sleepTime)
            if os.system("python3 dbcreate.py demo") != 0:
                raise Exception
            time.sleep(sleepTime)
        else:
            print("[Server] attempting to run python3 dbcreate.py...\n")
            time.sleep(sleepTime)
            if os.system("python3 dbcreate.py") != 0:
                raise Exception
            time.sleep(sleepTime)
    except Exception:
        print("[Server] attempting to run python3 dbcreate.py failed...")
        time.sleep(sleepTime)
        try:
            print("[Server] attempting to run python dbcreate.py...")
            time.sleep(sleepTime)
            os.system("python dbcreate.py")
            time.sleep(sleepTime)
        except:
            print("[Server] attempting to run python dbcreate.py failed...")
            print("[Server] exiting...")
            os.abort()
    # Here is where the code will go to automatically install redis-server
    #   for MacOS
    try:
        print("\n[Server] attempting to install Homebrew using setupHomebrew.sh...\n")
        if(os.system("chmod 755 setupHomebrew.sh") != 0):
            raise Exception
        if(os.system("./setupHomebrew.sh") != 0):
            raise Exception
        if(os.system("brew --version") != 0):
            raise Exception
        if(os.system("brew install redis") != 0):
            raise Exception
        if(os.system("brew services start redis") != 0):
            raise Exception
        if(os.system("brew services info redis") != 0):
            raise Exception
        time.sleep(sleepTime)
    except Exception:
        # Here is where the code will go to automatically install redis-server
        # for Linux
        try:
            print("[Server] attempting to run Homebrew install requirements failed, attempting Linux Install...")
            time.sleep(sleepTime)
            if(os.system('sudo apt install lsb-release curl gpg') != 0):
                raise Exception
            if(os.system('curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg') != 0):
                raise Exception
            if(os.system('echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list') != 0):
                raise Exception
            if(os.system('sudo apt-get update') != 0):
                raise Exception
            if(os.system('sudo apt-get install redis') != 0):
                raise Exception
            if(os.system('redis-server &') != 0):
                raise Exception
        except:
            # Here is where the code would go to automatically install redis-server.
            # However, Redis is not supported on Windows!
            # Therefore, from here on out, Windows cannot be used for development.
            # Only WSL can be used to allow Windows users to install redis-server!
            print("[Server] attempting to install Redis-Server for Linux failed...")
            time.sleep(sleepTime)
    try:
        print("\n[Server] attempting to run python3 run.py...\n")
        time.sleep(sleepTime)
        if os.system("python3 run.py") != 0:
            raise Exception
    except:
        print("[Server] attempting to run python3 run.py failed...")
        time.sleep(sleepTime)
        try:
            print("\n[Server] attempting to run python run.py...\n")
            time.sleep(sleepTime)
            os.system("python run.py")
        except:
            print("[Server] attempting to run python run.py failed...")
            print("[Server] exiting...")
            os.abort()
            
    def exit_handler():
        os.system("brew services stop redis") != 0
        os.system("redis-cli shutdown") != 0
    atexit.register(exit_handler)

if __name__ == "__main__":
    main()
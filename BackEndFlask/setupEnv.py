import time
import sys
import os
import atexit

def main():
    sleepTime = 0.5
    print("[Server] starting...")
    time.sleep(sleepTime)

    if sys.platform.startswith('win32'):
        # Redis is not supported on Windows!
        # Therefore, from here on out, Windows cannot be used for development.
        # Only WSL can be used to allow Windows users to install redis-server!
        print("[Server] Windows is no longer supported for development...")
        os.abort()

    # Logic for installing requirements
    try:
        print('[Server] attempting to run pip3 install requirements...')
        time.sleep(sleepTime)
        if(os.system("pip3 install -r requirements.txt") != 0):
            raise Exception
        print('[Server] requirements successfully installed.')
        time.sleep(sleepTime)
    except:
        print('[Server] attempting to run pip3 install requirements failed.')
        os.abort()

    # Logic for installing Redis-Server for MacOS 
    if sys.platform.startswith('darwin'):
        try:
            print("\n[Server] attempting to install Redis-Server for MacOS...\n")
            time.sleep(sleepTime)
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
        except:
            print("[Server] attempting to install Redis-Server for MacOS failed...")
            os.abort()

    # Logic for installing Redis-Server for Linux 
    elif sys.platform.startswith('linux'):
        try:
            print("[Server] attempting to install Redis-Server for Linux...")
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
            print("[Server] attempting to install Redis-Server for Linux failed...")
            os.abort()

    # Logic for resetting the database
    if (len(sys.argv) == 2 or len(sys.argv) == 3) and sys.argv[1]=="resetdb":
        accountDBPath = os.path.join(os.sep, "account.db")
        print("[Server] locating instance folder...")
        time.sleep(sleepTime)
        instanceFile = os.getcwd() + os.path.join(os.sep, "instance")

        if os.path.exists(instanceFile):
            print("[Server] instance folder found")
            time.sleep(sleepTime)
            accountDBPath = instanceFile + accountDBPath
        else:
            print("[Server] instance folder not found...")

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
                os.abort()
        else:
            print("[Server] account.db file does not exist therefore does not need to be removed")
            time.sleep(sleepTime)

    # Logic for loading demo data to the database
    try:
        if ((len(sys.argv) == 2 and sys.argv[1]=="demo") or (len(sys.argv) == 3 and sys.argv[2]=="demo")):
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
        os.abort()

    # Logic for running run.py
    try:
        print("\n[Server] attempting to run python3 run.py...\n")
        time.sleep(sleepTime)
        if os.system("python3 run.py") != 0:
            raise Exception
    except:
        print("[Server] attempting to run python3 run.py failed...")
        os.abort()
            
    # Logic for when os.abort() is called
    def exit_handler():
        print("[Server] exiting...")
        os.system("brew services stop redis") != 0
        os.system("redis-cli shutdown") != 0
    atexit.register(exit_handler)

if __name__ == "__main__":
    main()
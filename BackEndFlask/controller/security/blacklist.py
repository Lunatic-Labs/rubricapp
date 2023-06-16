import redis
import subprocess
import time

#starts a Redis server as a subprocess using the subprocess.Popen function
#redirects the standard output and standard error streams to subprocess.DEVNULL to get rid of them
def startRedis()->None:
    subprocess.Popen(
        'redis-server',
        stdout=subprocess.DEVNULL, 
        stderr=subprocess.DEVNULL
    )
#checks if a given token exists in a Redis database and returns True if it is blacklisted
def isTokenBlacklisted(token:str)->bool:
    try:
        r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        return True if r.get(token) else False
    except ConnectionError:
        print('connection error')
    except:
        print('key error')

def blacklistToken(token:str, time:int=15):
    return 1

startRedis()
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
r.set('thing', 2, ex=1)
time.sleep(5)
print(isTokenBlacklisted('thing'))

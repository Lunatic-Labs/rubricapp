import redis
import subprocess
from flask_jwt_extended import create_access_token, decode_token
from flask import current_app
from core import app
import math
import time
from jwt.exceptions import ExpiredSignatureError


#starts a Redis server as a subprocess using the subprocess.Popen function
#redirects the standard output and standard error streams to subprocess.DEVNULL to get rid of them
def startRedis() -> None:
    subprocess.Popen(
        'redis-server',
        stdout=subprocess.DEVNULL, 
        stderr=subprocess.DEVNULL
    )
#checks if a given token exists in a Redis database and returns True if it is blacklisted
def isTokenBlacklisted(token: str) -> bool:
    try:
        r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        found = r.get(token)
        r.close()
        return True if found else False
    except ConnectionError:
        print('connection error')
    except:
        print('key error')

def blacklistToken(token: str, time: int = 15) -> None:
    with app.app_context():
        try:
            r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
            r.set(token, r.dbsize+1, exp=math.ceil(decode_token(token)['exp'] - time.time()))
            r.close() 
        except ExpiredSignatureError:
            return
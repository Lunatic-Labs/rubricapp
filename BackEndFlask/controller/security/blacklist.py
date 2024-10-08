import math
import time
import redis
import subprocess
from core import app
from flask_jwt_extended import decode_token
from jwt.exceptions import ExpiredSignatureError
import os

redis_host = os.environ.get('REDIS_HOST', 'localhost')

# Starts a Redis server as a subprocess using the subprocess.Popen function
# Redirects the standard output and standard error streams to subprocess.DEVNULL to get rid of them
def start_redis() -> None:
    subprocess.Popen(
        'redis-server',
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

# Checks if a given token exists in a Redis database and returns True if it is blacklisted
def is_token_blacklisted(token: str) -> bool:
    try:
        r = redis.Redis(host=redis_host, port=6379, db=0, decode_responses=True)
        found = r.get(token)
        r.close()
        return True if found else False
    except ConnectionError:
        print('connection error')
    except:
        print('key error')

def blacklist_token(token: str) -> None:
    with app.app_context():
        try:
            r = redis.Redis(host=redis_host, port=6379, db=0, decode_responses=True)
            expiration = math.ceil(decode_token(token)['exp'] - time.time())
            r.set(token, r.dbsize()+1, ex=expiration)
            r.close()
        except ExpiredSignatureError:
            return


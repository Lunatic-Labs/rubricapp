import math
import time
import subprocess
from core import app, red
from flask_jwt_extended import decode_token
from jwt.exceptions import ExpiredSignatureError
from models.logger import logger
import os

# Starts a Redis server as a subprocess using the subprocess.Popen function
# Redirects the standard output and standard error streams to subprocess.DEVNULL to get rid of them
def start_redis() -> None:
    subprocess.Popen(
        'redis-server',
    )

# Checks if a given token exists in a Redis database and returns True if it is blacklisted
def is_token_blacklisted(token: str) -> bool:
    try:
        found = red.get(token)
        return True if found else False
    except ConnectionError:
        # Fails open (treats the token as not blacklisted) rather than
        # locking every user out when Redis is unreachable, but that's a
        # real security-relevant degradation worth an error-level log.
        logger.error("Blacklist check failed: could not reach Redis; treating token as not blacklisted (fail-open)")
        return False
    except Exception as e:
        logger.error(f"Blacklist check failed: {e}; treating token as not blacklisted (fail-open)")
        return False

def blacklist_token(token: str) -> None:
    with app.app_context():
        try:
            expiration = math.ceil(decode_token(token)['exp'] - time.time())
            red.set(token, red.dbsize()+1, ex=expiration)
        except ExpiredSignatureError:
            return


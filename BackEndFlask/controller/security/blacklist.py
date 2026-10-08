import math
import time
import subprocess
from core import app, red
from flask_jwt_extended import decode_token
from jwt.exceptions import ExpiredSignatureError
from models.logger import security_logger
import os

# Whether an unreachable blacklist lets tokens through (True) or rejects
# them (False). Failing open keeps a Redis outage from locking every user
# out, at the cost of honouring tokens that may have been revoked.
FAIL_OPEN = True

# Starts a Redis server as a subprocess using the subprocess.Popen function
# Redirects the standard output and standard error streams to subprocess.DEVNULL to get rid of them
def start_redis() -> None:
    subprocess.Popen(
        'redis-server',
    )

def is_token_blacklisted(token: str) -> bool:
    """
    Description:
    Reports whether `token` has been blacklisted in Redis.

    When Redis cannot answer, the outcome is FAIL_OPEN rather than an
    exception: a security-relevant degradation, so it is logged at error
    level.

    Parameters:
    token: str: The encoded JWT to look up.

    Returns:
    True if the token is blacklisted, False if it is not, and not
    FAIL_OPEN if the blacklist is unreachable.
    """
    try:
        return bool(red.get(token))
    except Exception as e:
        # One handler for RedisError and anything unexpected: both mean the
        # blacklist can't be consulted, and the exception type in the
        # message is enough to tell them apart.
        security_logger.error(f"Blacklist check unavailable, {type(e).__name__}: {e}; fail-open={FAIL_OPEN}")
        return not FAIL_OPEN

def blacklist_token(token: str) -> None:
    with app.app_context():
        try:
            expiration = math.ceil(decode_token(token)['exp'] - time.time())
            red.set(token, red.dbsize()+1, ex=expiration)
        except ExpiredSignatureError:
            return


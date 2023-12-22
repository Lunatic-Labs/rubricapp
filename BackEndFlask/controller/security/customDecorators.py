from flask import request, current_app
from functools import wraps
from .utility  import toInt
from .blacklist import isTokenBlacklisted
from flask_jwt_extended import decode_token
from flask_jwt_extended.exceptions import (
    NoAuthorizationError, InvalidQueryParamError
    )

#-----------------------------------------------------
# Please note that online documentation may not be up
# to date. Click on the links for github locations.
# https://github.com/vimalloc/flask-jwt-extended/tree/master/docs
#-----------------------------------------------------

#-----------------------------------------------------
# To understand decorators: look them up on google
# Once you have the foundaions, look at the link:
# https://github.com/vimalloc/flask-jwt-extended/blob/master/flask_jwt_extended/view_decorators.py#L125
#-----------------------------------------------------

# Adding a decorator to act as middleware to block bad tokens
def badTokenCheck() -> any:
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args):
            verifyAgainstBlacklist()
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

# Checks if a token obtained from the request headers is present in the blacklist, and raises a NoAuthorizationError exception if it is, otherwise it returns None.
def verifyAgainstBlacklist() -> any:
    token = request.headers.get('Authorization').split()[1]
    if isTokenBlacklisted(token):
        raise NoAuthorizationError('BlackListed')
    return

# Another decorator to verify the user_id is also the same in the token
def AuthCheck(refresh: bool = False):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args):
            verifyToken(refresh)
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

# Another decorator that checks if the user_id from the request matches the decoded id from the token, and raises an exception if they don't match.
def verifyToken(refresh: bool):
    id = request.args.get("user_id")
    if not id: raise InvalidQueryParamError("Missing user_id")
    token = request.headers.get('Authorization').split()[1]
    try:
        decodedId = decode_token(token)['sub'] if refresh else decode_token(token)['sub'][0]
    except:
        raise NoAuthorizationError("No Authorization")
    id = toInt(id, "user_id")
    if id == decodedId : return
    raise NoAuthorizationError("No Authorization")
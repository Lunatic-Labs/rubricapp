from flask import request, current_app
from functools import wraps
from .utility  import to_int
from .blacklist import is_token_blacklisted
from typing     import Callable 
from models.queries import is_admin_by_user_id
from flask_jwt_extended import decode_token
from flask_jwt_extended.exceptions import (
    NoAuthorizationError,
    InvalidQueryParamError
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

# NOTE: THIS FUNCTION SHOULD BE DELETED AFTER THE COURSE PROBLEM IS RESOLVED.
def course_redis_out(data:str) -> None:
    with open("redis_course_issue.txt", 'a') as out:
        print(data, file=out)

# Adding a decorator to act as middleware to block bad tokens
def bad_token_check() -> any:
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args):
            verify_against_blacklist()
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

# Checks if a token obtained from the request headers is present in the blacklist, and raises a NoAuthorizationError exception if it is, otherwise it returns None.
def verify_against_blacklist() -> any:
    redis_feature = False
    try:
        token = request.headers.get('Authorization').split()[1]
        if is_token_blacklisted(token):
            redis_feature = True
            raise NoAuthorizationError('BlackListed')
    except Exception as e:
        course_redis_out(e)
        course_redis_out("\nI am: Verify_against_blacklist.")
        course_redis_out("\nI failed a to connect to a redis instance for tokens.\n")
        course_redis_out(redis_feature)
        course_redis_out("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n")
        raise e
    return

# Another decorator to verify the user_id is also the same in the token
def AuthCheck(refresh: bool = False):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args):
            verify_token(refresh)
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

# Another decorator that checks if the user_id from the request matches the decoded id from the token, and raises an exception if they don't match.
def verify_token(refresh: bool):
    id = request.args.get("user_id")
    if not id: raise InvalidQueryParamError("Missing user_id")
    token = request.headers.get('Authorization').split()[1]
    try:
        decoded_id = int(decode_token(token)['sub'])
    except Exception as e:
        course_redis_out(e)
        course_redis_out("\nI am: verify_token")
        course_redis_out("\nI failed to decode the token and see if it was valid\n")
        course_redis_out(id, decoded_id, token)
        course_redis_out("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n")
        raise NoAuthorizationError("No Authorization")
    id = to_int(id, "user_id")
    if id == decoded_id : return
    course_redis_out("\n I am: verify_token")
    course_redis_out("\nI do not match the id recived to the token id.\n")
    course_redis_out(id, decoded_id)
    raise NoAuthorizationError("No Authorization")

def admin_check(refresh: bool = False) -> Callable:
    """
    Description:
    This is a decorator that checks to make sure that the route was called by an admin permisions.
    I think it is best to use the decorator as the last decorator since it hits the db.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args):
            verify_admin(refresh)
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

def verify_admin(refresh: bool) -> None:
    """
    Description:
    Uses token user_id to check user permisions.

    Exceptions: 
    Raises NoAuthorizationError if at any instance it can not be reliably determined if
    the individual that called the route has admin level permissions.
    """
    try:
        # Figuring out the user_id from token.
        # Assumes authcheck() has already concluded token_user_id == user_id from parameters.
        token = request.headers.get('Authorization').split()[1]
        decoded_id = decode_token(token)['sub'] if refresh else decode_token(token)['sub'][0]
        if is_admin_by_user_id(decoded_id) == False:
            course_redis_out("\nI am: is_admin_by_user_id in verify_admin")
            course_redis_out("\nI saw the user was not an admin in the db\n")
            course_redis_out(decoded_id)
            raise NoAuthorizationError("No Authorization")
    except Exception as e:
        course_redis_out(e)
        course_redis_out("\nI am: verify_admin")
        course_redis_out("\nIf the other inner function is not present then i failed to decode.")
        course_redis_out("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n")
        raise NoAuthorizationError("No Authorization")
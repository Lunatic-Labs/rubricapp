from flask import request, current_app
from functools import wraps
from .utility  import to_int, PASSWORD_VERSION_CLAIM
from .blacklist import is_token_blacklisted
from typing     import Callable
from enums.roles import Roles
from models.queries import is_admin_by_user_id, is_super_admin_by_user_id
from models.user import get_password_version
from models.user_course import get_role_from_usercourse_by_userid_courseid
from flask_jwt_extended import decode_token, get_jwt, get_jwt_identity
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
            verify_token_matches_password_version()
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

# Rejects tokens minted before the owner last changed their password.
#
# The Redis blacklist can only refuse token strings we were handed back, which
# covers a deliberate logout. A password reset has to refuse sessions nobody
# handed us, so every token carries the password generation it was minted under
# and anything behind the user's current generation is refused here.
#
# Raises NoAuthorizationError('Token revoked'), which the frontend already
# treats as unrecoverable, so the browser clears its cookies and returns to the
# login screen rather than retrying.
def verify_token_matches_password_version() -> None:
    claims = get_jwt()
    current_version = get_password_version(to_int(claims.get('sub'), 'user_id'))

    # Tokens issued before this claim existed carry no value and belong to
    # generation 0, which is where users who have never reset a password sit.
    token_version = claims.get(PASSWORD_VERSION_CLAIM, 0)

    if token_version != current_version:
        raise NoAuthorizationError('Token revoked')

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
        course_redis_out(f"id={id}, token={token}")  # no decoded_id
        course_redis_out("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n")
        raise NoAuthorizationError("No Authorization")
    id = to_int(id, "user_id")
    if id == decoded_id : return
    course_redis_out("\n I am: verify_token")
    course_redis_out("\nI do not match the id recived to the token id.\n")
    course_redis_out(f"ID mismatch: {id} vs {decoded_id}")
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
        decoded_id = decode_token(token)['sub'] if not refresh else decode_token(token)['sub'][0]
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
    
def privilege_check(desired_privilege_level: list[Roles], refresh: bool = False) -> Callable:
    """
    Description:
    This is a decorator that checks to make sure that the route was called by a user with the desired privilege level.
    It is best to use the decorator as the last decorator since it hits the db.
    NOTE: The course_id must be provided.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args):
            sufficent_privilege(desired_privilege_level, refresh)
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

def sufficent_privilege(desired_privilege_level: list[Roles], refresh: bool) -> None:
    """
    Description:
    Uses token user_id to check user permisions.

    Exceptions: 
    Raises NoAuthorizationError if at any instance it can not be reliably determined if
    the individual that called the route has the desired level permissions.
    """
    try:
        # Figuring out the user_id from token.
        # Assumes authcheck() has already concluded token_user_id == user_id from parameters.
        token = request.headers.get('Authorization').split()[1]
        course_id = request.args.get('course_id')
        decoded_id = decode_token(token)['sub'] if not refresh else decode_token(token)['sub'][0]
        course_role = get_role_from_usercourse_by_userid_courseid(decoded_id, course_id)
        if course_role not in desired_privilege_level:
            course_redis_out("\nI am: sufficient_privilege in privilege_check")
            course_redis_out("\nI saw the user was not of appropriate auth in the db\n")
            course_redis_out(decoded_id)
            raise NoAuthorizationError("No Authorization")
    except Exception as e:
        course_redis_out(e)
        course_redis_out("\nI am: verify_admin")
        course_redis_out("\nIf the other inner function is not present then i failed to decode.")
        course_redis_out("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n")
        raise NoAuthorizationError("No Authorization")

def super_admin_check(refresh: bool = False) -> Callable:
    """
    Description:
    This is a decorator that checks to make sure that the route was called by the super admin.
    Use this decorator as the last decorator since it hits the db.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args):
            verify_super_admin(refresh)
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

def verify_super_admin(refresh: bool) -> None:
    """
    Description:
    Uses token user_id to check if the caller is the super admin (user_id == 1).

    Exceptions: 
    Raises NoAuthorizationError if the caller is not the super admin.
    """
    try:
        # Use get_jwt_identity() provided by @jwt_required() instead of
        # manually decoding the token. This avoids double-decoding issues
        # that can cause exceptions to bypass the route handler and trigger
        # the JWT error handler (which logs the user out on the frontend).
        decoded_id = int(get_jwt_identity())
        if is_super_admin_by_user_id(decoded_id) == False:
            course_redis_out("\nI am: is_super_admin_by_user_id in verify_super_admin")
            course_redis_out("\nI saw the user was not the super admin\n")
            course_redis_out(decoded_id)
            raise NoAuthorizationError("No Authorization")
    except NoAuthorizationError:
        raise
    except Exception as e:
        course_redis_out(e)
        course_redis_out("\nI am: verify_super_admin")
        course_redis_out("\nI failed to get the JWT identity.\n")
        course_redis_out("\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n")
        raise NoAuthorizationError("No Authorization")
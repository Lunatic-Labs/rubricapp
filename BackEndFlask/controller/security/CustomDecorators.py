from flask import request, current_app
from functools import wraps
from .utility  import to_int
from .blacklist import is_token_blacklisted
from typing     import Callable
from enums.roles import Roles
from models.logger import logger
from models.log_context import set_user_id
from models.queries import is_admin_by_user_id, is_super_admin_by_user_id
from models.user_course import get_role_from_usercourse_by_userid_courseid
from flask_jwt_extended import decode_token, get_jwt_identity
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
    try:
        token = request.headers.get('Authorization').split()[1]
        if is_token_blacklisted(token):
            raise NoAuthorizationError('BlackListed')
    except Exception as e:
        logger.warning(f"Blacklist check denied request: user_id={request.args.get('user_id')}, path={request.path}, reason={e}")
        raise e
    logger.debug(f"Blacklist check passed: user_id={request.args.get('user_id')}, path={request.path}")
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
    if not id:
        logger.warning(f"AuthCheck denied: missing user_id query param, path={request.path}")
        raise InvalidQueryParamError("Missing user_id")
    token = request.headers.get('Authorization').split()[1]
    try:
        decoded_id = int(decode_token(token)['sub'])
    except Exception as e:
        logger.warning(f"AuthCheck denied: could not decode token, path={request.path}, reason={e}")
        raise NoAuthorizationError("No Authorization")
    id = to_int(id, "user_id")
    if id == decoded_id:
        # Now verified, so it's safe to tag the rest of this request's log
        # lines with it (core/__init__.py leaves it unset until here). The
        # teardown hook's reset restores the pre-request value.
        set_user_id(str(id))
        logger.debug(f"AuthCheck passed: user_id={id}, path={request.path}")
        return
    logger.warning(f"AuthCheck denied: user_id mismatch, claimed={id}, token_identity={decoded_id}, path={request.path}")
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
            raise NoAuthorizationError("No Authorization")
        logger.debug(f"admin_check passed: user_id={decoded_id}, path={request.path}")
    except NoAuthorizationError:
        logger.warning(f"admin_check denied: user_id={decoded_id}, reason=not an admin, path={request.path}")
        raise
    except Exception as e:
        logger.warning(f"admin_check denied: path={request.path}, reason={e}")
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
            raise NoAuthorizationError("No Authorization")
        logger.debug(f"privilege_check passed: user_id={decoded_id}, course_id={course_id}, role={course_role}, path={request.path}")
    except NoAuthorizationError:
        required = [r.name for r in desired_privilege_level]
        logger.warning(f"privilege_check denied: user_id={decoded_id}, course_id={course_id}, role={course_role}, required={required}, path={request.path}")
        raise
    except Exception as e:
        logger.warning(f"privilege_check denied: path={request.path}, reason={e}")
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
            raise NoAuthorizationError("No Authorization")
        logger.debug(f"super_admin_check passed: user_id={decoded_id}, path={request.path}")
    except NoAuthorizationError:
        logger.warning(f"super_admin_check denied: user_id={decoded_id}, reason=not the super admin, path={request.path}")
        raise
    except Exception as e:
        logger.warning(f"super_admin_check denied: path={request.path}, reason={e}")
        raise NoAuthorizationError("No Authorization")
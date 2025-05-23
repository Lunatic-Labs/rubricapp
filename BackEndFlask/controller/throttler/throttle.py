#--------------------------------------------------------
# This file features some a decorator that can be used
# to limit the number of requests that hit certain 
# routes.
#--------------------------------------------------------

from core import request_checker
from functools import wraps
from flask import request, current_app
from controller.Route_response import *

def throttler(seconds:int = 3):
    """
    Description:
        This decorator allows certain routes to throttle requests coming in.
        NOTE: This decorator always comes after verifiying the users id.
    Parameters:
        seconds: <class 'int'> (number of time that must pass before another request is allowed through) 
    Usage:
        @throttle()
    Exceptions:
        None
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            user_id = request.args.get("user_id")

            key = str(user_id) + fn.__name__
            
            try:
                if request_checker.get(key) is not None:
                    return create_bad_response(f"Previous request still still in progress.{key} {request_checker.get(key)}", "team", 202)
                
                request_checker.set(key, '', ex=seconds)

            except Exception as e:
                return create_bad_response(f"Failed to retive needed work.{e}", "team", 400)
            
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper
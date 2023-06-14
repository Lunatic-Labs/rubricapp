from flask import jsonify, request, Response
from flask import current_app, g
from flask_login import login_required
from models.blacklist import *
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema
from core import app
from functools import wraps
from jwt import ExpiredSignatureError
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token, get_jwt
from flask_jwt_extended.exceptions import NoAuthorizationError,InvalidQueryParamError

#-----------------------------------------------------
#Please note that online documentation may not be up
#to date. Click on the links for github locations.
#https://github.com/vimalloc/flask-jwt-extended/tree/master/docs
#-----------------------------------------------------

#adding a decorator to act as middleware to block bad tokens
def badTokenCheck():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args):
            verifyAgainstBlacklist()
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

def verifyAgainstBlacklist():
    token = request.headers.get('Authorization').split()[1]
    if get_token(token):
        raise NoAuthorizationError('BlackListed')
    return

#another decorator to compare token against the 
def AuthCheck(refresh=False):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args):
            verifyToken(refresh)
            return current_app.ensure_sync(fn)(*args)
        return decorator
    return wrapper

def verifyToken(refresh:bool):
    print(refresh)
    id = request.args.get("user_id")
    if not id: raise InvalidQueryParamError("Missing user_id")
    token = request.headers.get('Authorization').split()[1]
    print('---------------------------------------')
    decodedId = decode_token(token)['sub'] if refresh else decode_token(token)['sub'][0]
    id = toInt(id, "user_id")
    if id == decodedId : return
    raise NoAuthorizationError("No Authorization")

#creates both a jwt and refresh token
def createTokens(userID, roleID):
    with app.app_context():
        jwt = create_access_token([userID, roleID])
        refresh = request.args.get('refresh_token')
        if not refresh:
            refresh = create_refresh_token(userID)
    return jwt, refresh

#takes away jwt and refresh tokens from response
def revokeTokens():
    with app.app_context():
        if response.get('access_token') : response.pop('access_token')
        if response.get('refresh_token'): response.pop('refresh_token')

#returns true if token is expired
def tokenExpired(thing):
    with app.app_context():
        try:
            decode_token(thing)
        except ExpiredSignatureError:
            return True
    return False

#Note that the following two functions assume that the token has been checked for expiration

#function returns the userId from the sub of the jwt
def tokenUserId(thing):
    with app.app_context:
        return decode_token(thing)['sub'][0]
#function returns the roleId from the sub of the jwt
def tokenRoleID(thing):
    with app.app_context:
        return decode_token(thing)['sub'][1]
    
#handles conversion issues and warns front end of problems
def toInt(thing:str , subject:str):
    if(thing.isnumeric()):
        return int(thing)
    raise InvalidQueryParamError(f"{subject} is not purely numeric")
from flask import request
from core  import app
from jwt   import ExpiredSignatureError
from controller.Route_response import *
from flask_jwt_extended.exceptions import InvalidQueryParamError
from flask_jwt_extended import (
    create_access_token, create_refresh_token, decode_token
)

#-----------------------------------------------------
#Please note that online documentation may not be up
#to date. Click on the links for github locations.
#https://github.com/vimalloc/flask-jwt-extended/tree/master/docs
#useful examples:https://github.com/vimalloc/flask-jwt-extended/tree/master/examples
#-----------------------------------------------------

#creates both a jwt and refresh token
#jwt expires in 15mins; refresh token expires in 30days
def createTokens(userID: any, roleID: any) -> 'tuple[str, str]':
    with app.app_context():
        jwt = create_access_token([userID, roleID])
        refresh = request.args.get('refresh_token')
        if not refresh:
            refresh = create_refresh_token(userID)
    return jwt, refresh

#takes away jwt and refresh tokens from response
def revokeTokens() -> None:
    with app.app_context():
        if response.get('access_token') : response.pop('access_token')
        if response.get('refresh_token'): response.pop('refresh_token')

#returns true if token is expired
def tokenExpired(thing: str) -> bool:
    with app.app_context():
        try:
            decode_token(thing)
        except ExpiredSignatureError:
            return True
    return False

#Note that the following two functions assume that the token has been checked for expiration

#function returns the userId from the sub of the jwt
def tokenUserId(thing: str, refresh: bool = False) -> int:
    with app.app_context():
        if refresh: return decode_token(thing)['sub']
        return decode_token(thing)['sub'][0]
#function returns the roleId from the sub of the jwt
def jwtRoleID(thing: str) -> int:
    with app.app_context():
        return decode_token(thing)['sub'][1]
    
#handles conversion issues and warns front end of problems
def toInt(thing: str , subject: str) -> int:
    if(thing.isnumeric()):
        return int(thing)
    raise InvalidQueryParamError(f"{subject} is not purely numeric")
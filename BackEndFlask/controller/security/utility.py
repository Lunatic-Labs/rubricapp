from flask import jsonify, request, Response
from flask import current_app, g
from flask_login import login_required
from models.blacklist import *
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema
from core import app
from jwt import ExpiredSignatureError
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token

#adding a decorator to act as middleware to block bad tokens
def badTokenCheck(route):
    def blacklistCheck():
        with app.app_context():
            token = request.args.get('access_token')
            createBadResponse("Access denied:", "invalid authorization", None, 401)
            if token and not(get_token(token)):
                route()
            else:
                return response
        return blacklistCheck()

#authenticates a jwt token
def authenticateViajwt(route):
    def check(route):
        with app.app_context():
            token = request.args.get('access_token')

#creates both a jwt and refresh token
def createTokens(userID, roleID):
    with app.app_context():
        jwt = create_access_token([userID, roleID])
        refresh = request.args.get('refresh_token')
        if not refresh:
            refresh = create_refresh_token([userID, roleID])
    return jwt, refresh

#function used to create a new jwt based on refresh token
def refreshJwt():
    return 3

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

#function returns the userId from the sub of the jwt and refresh token
def tokenUserId(thing):
    with app.app_context:
        return decode_token(thing)['sub'][0]
#function returns the roleId from the sub of the jwt and refreshtokens
def tokenRoleID(thing):
    with app.app_context:
        return decode_token(thing)['sub'][1]
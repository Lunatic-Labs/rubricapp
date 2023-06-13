from flask import jsonify, request, Response
from flask import current_app, g
from flask_login import login_required
from models.blacklist import *
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema
from core import app
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity

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

def authenticateViajwt(route):
    def check(route):
        with app.app_context():
            token = request.args.get('access_token')

def createTokens(userID, roleID):
    with app.app_context():
        jwt = create_access_token([userID, roleID])
        refresh = request.args.get('refresh_token')
        if not refresh:
            refresh = create_refresh_token([userID, roleID])
    return jwt, refresh

def refreshJwt():
    return 3

def revokeTokens():
    with app.app_context():
        if response.get('access_token') : response.pop('access_token')
        if response.get('refresh_token'): response.pop('refresh_token')
from flask import jsonify, request, Response
from functools import wraps
from flask_login import login_required
from models.blacklist import *
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema
from core import app

#adding a decorator to act as middle ware to block bad tokens
def badTokenCheck(route):
    @wraps(route)
    def blacklistCheck():
        token = request.args.get('auth_token')
        createBadResponse("Access denied:", "invalid authorization", None, 401)
        if token and not(get_token(token)):
            route()
        else:
            return response
    return blacklistCheck()
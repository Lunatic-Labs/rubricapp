from flask import jsonify, request, Response
from flask import current_app, g
from flask_login import login_required
from models.blacklist import *
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema
from core import app

#adding a decorator to act as middleware to block bad tokens
def badTokenCheck(route):
    def blacklistCheck():
        with app.app_context():
            token = request.args.get('auth_token')
            createBadResponse("Access denied:", "invalid authorization", None, 401)
            if token and not(get_token(token)):
                route()
            else:
                return response
        return blacklistCheck()
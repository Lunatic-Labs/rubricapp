from flask import jsonify,  request, Response
from flask_login import login_required
from models.blacklist import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema
from controller.security.utility import revokeTokens, tokenExpired, tokenUserId
from flask_jwt_extended import jwt_required
from flask_jwt_extended.view_decorators import jwt_required

@bp.route('/Refresh', methods=['GET'])
@jwt_required(refresh=True)
def refreshToken():
    return response

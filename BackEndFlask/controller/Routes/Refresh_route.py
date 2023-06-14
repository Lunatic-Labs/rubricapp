from flask import jsonify,  request, Response
from flask_login import login_required
from models.blacklist import *
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema
from controller.security.utility import badTokenCheck, AuthCheck
from flask_jwt_extended import jwt_required, create_access_token

@bp.route('/Refresh', methods=['GET'])
@jwt_required(refresh=True)
@badTokenCheck()
@AuthCheck()
def refreshToken():
    id = request.args.get('user_id')
    if id:
        user = get_user(int(id))
        user = userSchema.dump(user)
        createGoodResponse("New access token generated", id, 200, 'Token refreshing', create_access_token([id, user['role_id']]))
    else: createBadResponse ("Bad request:", "user_id must be provided", None, 400)
    return response

userSchema = UserSchema()
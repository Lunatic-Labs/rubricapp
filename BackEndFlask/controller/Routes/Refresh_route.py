from flask import request
from models.user import get_user
from controller  import bp
from .User_routes import UserSchema
from controller.Route_response import *
from flask_jwt_extended import jwt_required, create_access_token
from controller.security.customDecorators import AuthCheck, badTokenCheck
from controller.security.customDecorators import AuthCheck, badTokenCheck

@bp.route('/Refresh', methods=['POST'])
@jwt_required(refresh=True)
@badTokenCheck()
@AuthCheck(refresh=True)
def refreshToken():
    id = request.args.get('user_id')
    if id:
        user = get_user(int(id))
        user = userSchema.dump(user)
        createGoodResponse("New access token generated", id, 200, 'Token refreshing', create_access_token([id, user['role_id']]))
    else: createBadResponse ("Bad request:", "user_id must be provided", None, 400)
    return response, response.get('status')

userSchema = UserSchema()
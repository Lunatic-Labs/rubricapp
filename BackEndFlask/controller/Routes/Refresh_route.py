from flask import request
from models.user import get_user
from controller  import bp
from .User_routes import UserSchema
from controller.Route_response import *
from flask_jwt_extended import jwt_required, create_access_token
from controller.security.customDecorators import AuthCheck, badTokenCheck
from controller.security.customDecorators import AuthCheck, badTokenCheck

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@badTokenCheck()
@AuthCheck(refresh=True)
def refreshToken():
    if _id:
        _id = request.args.get('user_id')
        user = get_user(int(_id))
        user = userSchema.dump(user)
        createGoodResponse("New access token generated", _id, 200, 'Token refreshing', create_access_token([_id]))
        response = create_good_response(user, 200, "user")
    else:
        response = create_bad_response("Bad request: user_id must be provided", "user", 400)
    return response

userSchema = UserSchema()

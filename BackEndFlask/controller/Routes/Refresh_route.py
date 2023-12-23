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
    try:
        user_id = int(request.args.get('user_id'))
        user = userSchema.dump(get_user(user_id))
        jwt = create_access_token([user_id])
        return create_good_response(user, 200, "user", jwt)
    except:
        return create_bad_response("Bad request: user_id must be provided", "user", 400)

userSchema = UserSchema()

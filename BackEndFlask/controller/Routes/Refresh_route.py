from flask import request
from models.user import get_user
from controller  import bp
from .User_routes import UserSchema
from controller.Route_response import *
from flask_jwt_extended import jwt_required, create_access_token
from controller.security.customDecorators import AuthCheck, bad_token_check
from controller.security.customDecorators import AuthCheck, bad_token_check

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@bad_token_check()
@AuthCheck(refresh=True)
def refresh_token():
    try:
        user_id = int(request.args.get('user_id'))
        user = user_schema.dump(get_user(user_id))
        jwt = create_access_token([user_id])
        return create_good_response(user, 200, "user", jwt)
    except:
        return create_bad_response("Bad request: user_id must be provided", "user", 400)

user_schema = UserSchema()
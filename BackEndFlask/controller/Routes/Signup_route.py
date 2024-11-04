from flask import request
from controller  import bp
from models.user import get_user_by_email
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check

@bp.route('/signup', methods=['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def register_user():
    try:
        email, password = request.args.get('email'), request.args.get('password')
        if not email or not password:
            response = create_bad_response("bad request: Both email and password required", "user", 400)
        else:
            if not get_user_by_email(email):
                response = create_good_response([], 200, "user")
            else:
                response = create_bad_response("Conflict: Email already exists", "user", 400)
        return response

    except Exception as e:
        return create_bad_response(f"Error occurred while registering user: {e}", "user", 400)

user_schema = UserSchema()
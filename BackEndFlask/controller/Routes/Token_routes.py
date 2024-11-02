from flask import request
from controller import bp
from controller.Route_response import *
from controller.security.short_lived_tokens import create_short_lived_token
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check

@bp.route('/get_short_lived_token', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_short_lived_token():
    try:
        jwt_token = request.headers.get('Authorization').split()[1]
        short_lived_token = create_short_lived_token(jwt_token)
        
        result = {
            "token": short_lived_token,
        }
        
        return create_good_response(result, 200, "short_lived_token")
    except Exception as e:
        return create_bad_response(f"An error occurred generating short lived token: {e}", "short_lived_token", 400)

from flask import request
from models.user import get_user
from controller import bp
from .User_routes import UserSchema
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check
import datetime
from controller.security.blacklist import is_token_blacklisted, blacklist_token
from controller.security.utility import create_new_tokens

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@bad_token_check()
@AuthCheck(refresh=True)
def refresh_token():
    try:
        user_id = int(request.args.get('user_id'))
        user = user_schema.dump(get_user(user_id))
        
        # What: This is blacklisting feature for refresh tokens.
        # Once refresh tokens are expired, they are pushed to a blacklist.
        # Why: The reason is to ensure that tokens can not be reused for security purposes.
        
        # Get old token and check/blacklist it
        old_token = request.headers.get('Authorization').split()[1]
        if is_token_blacklisted(old_token):
            return create_bad_response("Refresh token has been revoked", "user", 401)
        blacklist_token(old_token)
        
        # Convert user_id to string for JWT identity
        user_id_str = str(user_id)
        
        access_token, new_refresh_token = create_new_tokens(user_id_str)
        
        return create_good_response(
            user, 
            200, 
            "user", 
            jwt=access_token,
            refresh=new_refresh_token
        )
    except Exception as e:
        print(f"Refresh error: {e}")
        return create_bad_response(f"Bad request: {e}", "user", 400)

user_schema = UserSchema()
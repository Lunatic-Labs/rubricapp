from flask import request
from models.user import get_user
from controller import bp
from .User_routes import UserSchema
from controller.Route_response import *
from flask_jwt_extended import jwt_required, create_access_token, create_refresh_token
from controller.security.CustomDecorators import AuthCheck, bad_token_check
import datetime

@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@bad_token_check()
@AuthCheck(refresh=True)
def refresh_token():
    try:
        user_id = int(request.args.get('user_id'))
        user = user_schema.dump(get_user(user_id))
        
        # Convert user_id to string for JWT identity
        user_id_str = str(user_id)
        
        # Create new access token (60 minutes)
        access_token = create_access_token(
            identity=user_id_str, 
            expires_delta=datetime.timedelta(minutes=60)
        )
        
        # Create new refresh token (7 days)
        new_refresh_token = create_refresh_token(
            identity=user_id_str, 
            expires_delta=datetime.timedelta(days=7)
        )
        
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
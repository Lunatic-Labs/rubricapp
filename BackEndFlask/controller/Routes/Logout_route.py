from flask import request
from controller import bp
from controller.Route_response import *
from controller.security.blacklist import blacklist_token
from controller.security.CustomDecorators import AuthCheck, bad_token_check
from controller.security.utility import(
    revoke_tokens,
    token_expired,
    token_user_id,
    to_int
)

@bp.route('/logout', methods=['POST'])
def logout():
    try:
        _id, jwt, refresh = request.args.get('user_id'), request.json.get('access_token'), request.json.get('refresh_token')
        _id = to_int(_id, 'user_id')

        if jwt and not token_expired(jwt):
            if _id == token_user_id(jwt):
                if refresh and not token_expired(refresh):
                    blacklist_token(refresh)
            if _id == token_user_id(refresh, refresh=True): 
                blacklist_token(refresh)

        revoke_tokens()
        return create_good_response([], 200, "user")

    except Exception as e:
        revoke_tokens()
        return create_bad_response(f"An error occurred logging out: {e}", "logout", 400)
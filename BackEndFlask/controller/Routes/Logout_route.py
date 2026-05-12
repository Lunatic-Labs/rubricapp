from flask import request
from controller import bp
from controller.Route_response import *
from controller.security.blacklist import blacklist_token
from controller.security.utility import(
    revoke_tokens,
    token_expired,
    token_user_id,
    to_int
)

@bp.route('/logout', methods=['POST'])
def logout():
    try:
        json_body = request.get_json(silent=True)
        if not json_body:
            raise ValueError("Request body with access_token and refresh_token is required")

        _id = request.args.get('user_id')
        jwt, refresh = json_body.get('access_token'), json_body.get('refresh_token')
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
        return create_bad_response(f"An error occurred during logout: {e}", "user", 400)
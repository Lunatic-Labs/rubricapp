from flask import request
from controller import bp
from controller.Route_response import *
from controller.security.blacklist import blacklistToken
from controller.security.customDecorators import AuthCheck, badTokenCheck
from controller.security.utility import(
    revokeTokens,
    tokenExpired,
    tokenUserId,
    toInt
)

@bp.route('/logout', methods=['POST'])
def logout():
    try:
        _id, jwt, refresh = request.args.get('user_id'), request.args.get('access_token'), request.args.get('refresh_token')
        _id = toInt(_id, 'user_id')

        if jwt and not tokenExpired(jwt):
            if _id == tokenUserId(jwt):
                if refresh and not tokenExpired(refresh):
                    blacklistToken(refresh)
            if _id == tokenUserId(refresh, refresh=True): 
                blacklistToken(refresh)

        revokeTokens()
        return create_good_response([], 200, "user")

    except Exception as e:
        revokeTokens()
        createBadResponse(f"An error occurred logging out: {e}", "logout", 400)
        return create_bad_response(f"An error occurred logging out: {e}", "logout", 400)

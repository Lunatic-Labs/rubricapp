from flask import request
from controller import bp
from controller.Route_response import *
from controller.security.blacklist import blacklistToken 
from controller.security.customDecorators import AuthCheck, badTokenCheck
from controller.security.utility import(
    revokeTokens, tokenExpired, tokenUserId, 
    toInt
    ) 

@bp.route('/logout', methods=['POST'])
def logout():
    id, jwt, refresh = request.args.get('user_id'), request.args.get('access_token'), request.args.get('refresh_token')
    id = toInt(id, 'user_id')
    if jwt and not tokenExpired(jwt):
        if id == tokenUserId(jwt): 
            blacklistToken(jwt)
    if refresh and not tokenExpired(refresh):
        if id == tokenUserId(refresh, refresh=True): blacklistToken(refresh)
    revokeTokens()
    createGoodResponse("Successfully logged out", id, 200, 'user')
    return response, response.get('status')
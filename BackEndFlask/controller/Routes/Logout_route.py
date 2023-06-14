from flask import request
from controller import bp
from controller.Route_response import *
from models.blacklist import blackListToken
from flask_jwt_extended import decode_token
from controller.security.utility import(
    revokeTokens, tokenExpired, tokenUserId, 
    toInt
    ) 

@bp.route('/Logout', methods=['POST'])
def logout():
    id, jwt, refresh = request.args.get('user_id'), request.args.get('access_token'), request.args.get('refresh_token')
    id = toInt(id, 'user_id')
    if jwt and not tokenExpired(jwt): 
        if id == tokenUserId(jwt): blackListToken(jwt)
    if refresh and not tokenExpired(refresh):
        if id == decode_token(refresh)['sub']: blackListToken(refresh)
    revokeTokens()
    createGoodResponse("Successfully logged out", id, 200, 'user')
    return response, response.get('status')
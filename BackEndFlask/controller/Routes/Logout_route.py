from flask import jsonify,  request, Response
from flask_login import login_required
from models.blacklist import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema
from controller.security.utility import revokeTokens, tokenExpired, tokenUserId

@bp.route('/Logout', methods=['POST'])
def logout():
    id, jwt, refresh = request.args.get('user_id'), request.args.get('access_token'), request.args.get('refresh_token')
    if jwt and not tokenExpired(jwt): 
        if id == tokenUserId(jwt): blackListToken(jwt)
    if refresh and not tokenExpired(refresh):
        if id == tokenUserId(refresh): blackListToken(refresh)
    revokeTokens()
    createGoodResponse("Successfully logged out", id, 200, 'user')
    return response
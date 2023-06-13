from flask import jsonify,  request, Response
from flask_login import login_required
from models.blacklist import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema


@bp.route('/Logout', methods=['POST'])
def logout():
    id, token = request.args.get('user_id'), request.args.get('auth_token')
    if token:
        id, token = request.args.get('user_id'), request.args.get('auth_token')
        #payload = decodeAuthToken(token)
        if id.isnumeric():
            id = int(id)
        #if payload != -1 and payload == id:
        #    blackListToken(token)
        #revokeToken()
    createGoodResponse("Successfully logged out", id, 200, 'user')
    return response
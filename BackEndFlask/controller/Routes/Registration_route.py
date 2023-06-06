from flask import jsonify,  request, Response
from flask_login import login_required
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from rubricapp.BackEndFlask.controller.token.encryption import decodeAuthToken, encodeAuthToken
from User_routes import UserSchema

@bp.route('/Registration', methods=['POST'])
def registerUser():
    if request.method == 'POST':
        email = request.args.get('email')
        password = request.args.get('password')
    

    return response

userSchema = UserSchema()
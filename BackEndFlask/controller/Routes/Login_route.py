from flask import jsonify,  request, Response
from flask_login import login_required
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.token.encryption import encodeAuthToken
from controller.token.tokenUtil import revokeToken 
from controller.Routes.User_routes import UserSchema
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

@bp.route('/Login', methods=['POST'])
@jwt_required()
def login():
    print("----------------------------------------")
    print(create_access_token(identity=1))
    print("----------------------------------------")
    createBadResponse(f"Unable to verify log in information:", "Please retry", None, 401)
    email, password = request.args.get('email'), request.args.get('password')
    if email == None or password == None:
        createBadResponse(f'Bad request:', 'Both email and password required', None, 400)
    else:
        user = get_user_by_email(email)
        if not user:
            return response
        user = userSchema.dump(user)
        if check_password_hash(get_user_password(user['user_id']), password):
            authToken = encodeAuthToken(user['user_id'], user['role_id'])
            print(f"[Login_route /user/<str:email> GET] Successfully varfied user: {email}!")
            createGoodResponse(f"Successfully verified log in information: {email}!", email, 200, "user", authToken)
    if(response.get("status") != 200):
        revokeToken()
    return response

userSchema = UserSchema()
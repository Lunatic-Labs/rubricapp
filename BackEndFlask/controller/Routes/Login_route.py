from flask import jsonify,  request, Response
from flask_login import login_required
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from controller.security.utility import createTokens, revokeTokens, badTokenCheck, AuthCheck
from controller.Routes.User_routes import UserSchema
from werkzeug.security import check_password_hash
from flask_jwt_extended import jwt_required

@bp.route('/Login', methods=['POST'])
def login():
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
            jwt, refresh = createTokens(user['user_id'], user['role_id'])
            print(f"[Login_route /user/<str:email> GET] Successfully varfied user: {email}!")
            createGoodResponse(f"Successfully verified log in information: {email}!", email, 200, "user", jwt, refresh)
    if(response.get("status") != 200):
        revokeTokens()
    return response

userSchema = UserSchema()
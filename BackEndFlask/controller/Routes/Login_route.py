from flask import request
from models.user import get_user_by_email, get_user_password
from controller  import bp
from .User_routes import UserSchema
from controller.Route_response import *
from controller.security.utility import createTokens, revokeTokens
from werkzeug.security import check_password_hash

@bp.route('/Login', methods=['POST'])
def login():
    email, password = request.args.get('email'), request.args.get('password')
    if email == None or password == None:
        createBadResponse(f'Bad request:', 'Both email and password required', None, 400)
        revokeTokens()
        return response, response.get('status')
    else:
        user = get_user_by_email(email)
        if not user:
            return response, response.get('status')
        user = userSchema.dump(user)
        if check_password_hash(get_user_password(user['user_id']), password):
            jwt, refresh = createTokens(user['user_id'], user['role_id'])
            print(f"[Login_route /user/<str:email> GET] Successfully varfied user: {email}!")
            createGoodResponse(f"Successfully verified log in information: {email}!", email, 200, "user", jwt, refresh)
    if(response.get("status") != 200):
        createBadResponse(f"Unable to verify log in information:", "Please retry", None, 401)
        revokeTokens()
    return response, response.get('status')

userSchema = UserSchema()
from flask import request
from controller  import bp
from .User_routes import UserSchema
from controller.Route_response import *
from models.user import get_user_by_email, get_user_password
from werkzeug.security import check_password_hash
from controller.security.utility import createTokens, revokeTokens

@bp.route('/login', methods=['POST'])
def login():
    email, password = request.args.get('email'), request.args.get('password')
    if email == None or password == None:
        createBadResponse(f'Bad request:', 'Both email and password required', None, 400)
        revokeTokens()
        return response, response.get('status')
    else:
        user = get_user_by_email(email)
        if not user:
            createBadResponse(f'Bad request:', 'Invalid Email', email, 400)
            revokeTokens()
            return response, response.get('status')
        isAdmin = user.isAdmin
        user = userSchema.dump(user)
        if check_password_hash(get_user_password(user['user_id']), password):
            jwt, refresh = createTokens(user['user_id'])
            print(f"[Login_route /user/<str:email> GET] Successfully verified user: {email}!")
            createGoodResponse(f"Successfully verified log in information: {email}!", {"email": email, "user_id": user["user_id"], "isAdmin": isAdmin}, 200, "user", jwt, refresh)
            return response, response.get('status')
    if(response.get("status") != 200):
        createBadResponse(f"Unable to verify log in information:", "Please retry", None, 401)
        revokeTokens()
    return response, response.get('status')

userSchema = UserSchema()
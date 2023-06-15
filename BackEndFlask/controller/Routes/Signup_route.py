from flask import request
from controller  import bp
from models.user import get_user_by_email
from controller.Route_response import *
from controller.Routes.User_routes import UserSchema

@bp.route('/Signup', methods=['POST'])
def registerUser():
    email, password = request.args.get('email'), request.args.get('password')
    if not email or not password:
        createBadResponse(f'Bad request:', 'Both email and password required', None, 400)
    else:
        createBadResponse(f'Conflict:', 'Email already exists', None, 409)
        if not get_user_by_email(email):
            createGoodResponse(f'Successfully registered: {email}', email, 200, 'user')
    return response

userSchema = UserSchema()
from flask import request
from controller  import bp
from .User_routes import UserSchema
from controller.Route_response import *
from models.user import get_user_by_email, get_user_password
from werkzeug.security import check_password_hash, generate_password_hash
from controller.security.utility import createTokens, revokeTokens
from flask_jwt_extended import jwt_required
from controller.security.customDecorators import AuthCheck, badTokenCheck
from models.user import update_password, has_changed_password, set_reset_code, get_user_by_email
from models.utility import generate_random_password, send_reset_code_email

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
        user = userSchema.dump(user)
        if check_password_hash(get_user_password(user['user_id']), password):
            jwt, refresh = createTokens(user['user_id'])
            print(f"[Login_route /user/<str:email> GET] Successfully verfied user: {email}!")
            # TODO: Pass newly created attribute of isAdmin from the User table!
            createGoodResponse(f"Successfully verified log in information: {email}!", {"email": email, "user_id": user["user_id"], "has_set_password": user["has_set_password"] }, 200, "user", jwt, refresh)
            return response, response.get('status')
        else: 
            createBadResponse(f"Unable to verify log in information:", "Please retry", None, 401)
            revokeTokens()
            return response, response.get('status')

@bp.route('/password', methods = ['PUT'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def set_new_password(): 
    user_id = int(request.args.get("user_id"))
    password = request.json["password"]

    try: 
        pass_hash = update_password(user_id, password)
        has_changed_password(user_id, True)
    except: 
        print(f"[User_routes /password PUT] An error occurred setting new password for: {user_id}")
        createBadResponse(f'Bad request:', 'Failed to set password', {}, 400)
        return response
    createGoodResponse(f"Successfully set new password for user {user_id}!", {}, 201, "password")
    return response

@bp.route('/reset_code', methods = ['GET'])
def send_reset_code(): 
    email = request.args.get("email")
    user = get_user_by_email(email)

    if user is None: 
        print(f"[User_routes /reset_code GET] An occurred sending reset code, no such email: {email}")
        createBadResponse(f'Bad request:', f'invalid email {email}', email, 400)
        return response

    code = generate_random_password(6) 
    code_hash = generate_password_hash(code)

    try:
        set_reset_code(user.user_id, code_hash)
        send_reset_code_email(email, code)
    except: 
        print(f"[User_routes /reset_code GET] An occurred sending reset code")
        createBadResponse(f'Bad request:', f' failed to send code to {email}', email, 400)
        return response

    createGoodResponse(f"Successfully sent reset code to {email}!", {}, 201, "reset_code")
    return response

@bp.route('/reset_code', methods = ['POST'])
def check_reset_code(): 
    email = request.args.get("email")
    code = request.args.get("code")

    print("CODE IS", code)
    user = get_user_by_email(email)

    if user is None: 
        print(f"[User_routes /reset_code POST] An occurred sending reset code, no such email: {email}")
        createBadResponse(f'Bad request:', f'invalid email {email}', email, 400)
        return response

    
    if check_password_hash(user.reset_code, code): #  if code match, log the user in 
        jwt, refresh = createTokens(user.user_id)
        print(f"[Login_route /reset_code POST] Successfully verified code and logged in ")
        # TODO: Pass newly created attribute of isAdmin from the User table!

        createGoodResponse(f"Successfully verified log in information: {email}!", {"email": email, "user_id": user.user_id, "has_set_password": user.has_set_password }, 200, "user", jwt, refresh)
        print(f"[Login_routes /reset_code POST] validated code and logged user in")
        print(response)
        return response, response.get('status')
        
    print(f"[Login_routes /reset_code POST] invalid code!:")
    createBadResponse(f'Bad request:', f'invalid code!', 'user', 400)
    return response

userSchema = UserSchema()
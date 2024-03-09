from flask import request
from controller  import bp
from .User_routes import UserSchema
from controller.Route_response import *
from models.user import get_user_by_email, get_user_password
from werkzeug.security import check_password_hash, generate_password_hash
from controller.security.utility import create_tokens, revoke_tokens
from models.user import update_password, has_changed_password, set_reset_code, get_user_by_email
from models.utility import generate_random_password, send_reset_code_email



@bp.route('/login', methods=['POST'])
def login():
    try:
        email, password = request.args.get('email'), request.args.get('password')

        if email is None or password is None or email == "" or password == "" or email == "undefined" or password == "undefined":
            raise Exception("Missing Email or Password")

        user = get_user_by_email(email)

        if user is None or not check_password_hash(get_user_password(user.user_id), password):
            raise Exception("Invalid Credentials")

        JSON = {
            "email": email,
            "user_id": user.user_id,
            "isSuperAdmin": user.user_id==1,
            "isAdmin": user.is_admin,
            "has_set_password": user.has_set_password,
            "user_name": user.first_name + " " + user.last_name
        }

        jwt, refresh = create_tokens(user.user_id)

        return create_good_response(JSON, 200, "login", jwt, refresh)

    except Exception as e:
        revoke_tokens()

        return create_bad_response(f"{e}", "login", 400)


@bp.route('/password', methods = ['PUT'])
def set_new_password():
    try:
        email, password = request.args.get('email'), request.args.get('password')

        if email is None or password is None or email == "" or password == "" or email == "undefined" or password == "undefined":
            raise Exception("Missing Email or Password")

        user = get_user_by_email(email)

        if user is None:
            raise Exception("Invalid Credentials")

        update_password(user.user_id, password)

        has_changed_password(user.user_id, True)

        return create_good_response(f"Successfully set new password for user {user.user_id}!", {}, 201, "password")

    except Exception as e:
        return create_bad_response(f"{e}", "password", 400)


@bp.route('/reset_code', methods = ['GET'])
def send_reset_code():
    try:
        email = request.args.get("email")

        if email is None or email == "" or email == "undefined":
            raise Exception("Missing Email")

        print("             email: ", email)

        user = get_user_by_email(email)

        if user is None:
            raise Exception("Invalid Credentials")

        code = generate_random_password(6)

        print("             reset_code:", code)

        set_reset_code(user.user_id, generate_password_hash(code))

        send_reset_code_email(email, code)

        return create_good_response(f"Successfully sent reset code to {email}!", {}, 201, "reset_code")

    except Exception as e:
        return create_bad_response(f"{e}", "reset_code", 400)


@bp.route('/reset_code', methods = ['POST'])
def check_reset_code():
    try:
        email, code = request.args.get("email"), request.args.get("code")

        if email is None or code is None or email == "" or code == "" or email == "undefined" or code == "undefined":
            raise Exception("Missing Email or Code")

        user = get_user_by_email(email)

        if user is None or not check_password_hash(user.reset_code, code):
            raise Exception("Invalid Credentials")

        return create_good_response(f"Successfully matched passed in code with stored code for email: {email}!", {}, 200, 'reset_code')

    except Exception as e:
        return create_bad_response(f"{e}", "reset_code", 400)



user_schema = UserSchema()
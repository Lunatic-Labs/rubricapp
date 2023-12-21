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
    try:
        email, password = request.args.get('email'), request.args.get('password')
        if email is None or password is None:
            print("----------------- 1")
            revokeTokens()
            return create_bad_response("Bad request: Both email and password required", "login", 400)
        else:
            user = get_user_by_email(email)
            if not user:
                print("----------------- 2")
                revokeTokens()
                return create_bad_response("Bad request: Invalid Email", "login", 400)

            isAdmin = user.isAdmin
            user = userSchema.dump(user)
            if check_password_hash(get_user_password(user['user_id']), password):
                jwt, refresh = createTokens(user['user_id'])
                JSON = {
                    "user": {
                        "email": email,
                        "user_id": user['user_id'],
                        "isSuperAdmin": user['user_id']==1,
                        "isAdmin": isAdmin,
                        "has_set_password": user['has_set_password'],
                    }
                }
                print("----------------- 3")
                return create_good_response(JSON, 200, "login", jwt, refresh)

            else:
                print("----------------- 4")
                revokeTokens()
                return create_bad_response(f"Unable to verify log in information: Please retry", "login", 400)

    except Exception as e:
        print("----------------- 5")
        revokeTokens()
        return create_bad_response(f"An error occurred logging in: {e}", "login", 400)


@bp.route('/password', methods = ['PUT'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def set_new_password():
    try:
        user_id = int(request.args.get("user_id"))
        password = request.json["password"]
        update_password(user_id, password)
        has_changed_password(user_id, True)
    except:
        return create_bad_response(f"Bad request: Failed to set password", "password", 400)

    return create_good_response(f"Successfully set new password for user {user_id}!", {}, 201, "password")


@bp.route('/reset_code', methods = ['GET'])
def send_reset_code():
    email = request.args.get("email")
    try:
        user = get_user_by_email(email)

        if user is None:
            create_bad_response(f"Bad request: No such email {email}", "reset_code", 400)
            return response

        code = generate_random_password(6)
        code_hash = generate_password_hash(code)

        try:
            set_reset_code(user.user_id, code_hash)
            send_reset_code_email(email, code)
        except:
            return create_bad_response(f"Bad request: Failed to send code to {email}", "reset_code", 400)

        return create_good_response(f"Successfully sent reset code to {email}!", {}, 201, "reset_code")

    except Exception as e:
        return create_bad_response(f"An error occurred sending reset code: {e}", "reset_code", 400)

@bp.route('/reset_code', methods = ['POST'])
def check_reset_code():
    email = request.args.get("email")
    code = request.args.get("code")

    try:
        user = get_user_by_email(email)

        if user is None:
            return create_bad_response(f"Bad request: No such email {email}", "reset_code", 400)

        isAdmin = user.isAdmin

        if check_password_hash(user.reset_code, code): #  if code match, log the user in
            jwt, refresh = createTokens(user.user_id)
            # TODO: Pass newly created attribute of isAdmin from the User table!
            JSON = {
                "email": email,
                "user_id": user.user_id,
                "isSuperAdmin": user.user_id==1,
                "isAdmin": isAdmin,
                "has_set_password": user.has_set_password,
                "access_token": jwt,
                "refresh_token": refresh
            }
            return create_good_response(f"Successfully verified log in information: {email}!", JSON, 200, "user")

        return create_bad_response(f"Bad request: Invalid code!", "user", 400)

    except Exception as e:
        return create_bad_response(f"An error occurred checking reset code: {e}", "reset_code", 400)

userSchema = UserSchema()

from flask import request
from controller  import bp
from .User_routes import UserSchema
from controller.Route_response import *
from models.user import get_user_by_email, get_user_password, get_user
from werkzeug.security import check_password_hash, generate_password_hash
from controller.security.utility import create_new_tokens, revoke_tokens
from controller.security.CustomDecorators import bad_token_check
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import (
    update_password,
    has_changed_password,
    set_reset_code,
    reset_code_is_expired,
    invalidate_issued_tokens
)
from models.utility import generate_random_password, send_reset_code_email
from controller.Routes.RouteUtilities import is_any_variable_in_array_missing
from controller.Routes.RouteExceptions import MissingException, InvalidCredentialsException
from datetime import datetime, timedelta, timezone


# How long a mailed reset code stays usable. Short enough that a code sitting in
# an old inbox is not a standing key to the account, long enough to survive mail
# delivery and someone walking back to their desk.
RESET_CODE_LIFETIME = timedelta(minutes=15)


@bp.route('/login', methods=['POST'])
def login():
    try:
        email, password = request.json.get('email'), request.json.get('password')

        if is_any_variable_in_array_missing([email, password]):
            raise MissingException(["Email", "Password"])

        user = get_user_by_email(email)

        if user is None or not check_password_hash(get_user_password(user.user_id), password):
            raise InvalidCredentialsException

        JSON = {
            "email": email,
            "user_id": user.user_id,
            "isSuperAdmin": user.user_id == 1,
            "isAdmin": user.is_admin,
            "has_set_password": user.has_set_password,
            "user_name": user.first_name + " " + user.last_name
        }

        jwt, refresh = create_new_tokens(user.user_id)

        return create_good_response(JSON, 200, "login", jwt, refresh)

    except Exception as e:
        revoke_tokens()

        return create_bad_response(f"{e}", "login", 400)


@bp.route('/password', methods = ['PUT'])
def set_new_password():
    try:
        email, password, code = request.json.get('email'), request.json.get('password'), request.json.get('code')

        if is_any_variable_in_array_missing([password]):
            return create_bad_response("Missing Password", "password", 400)

        if is_any_variable_in_array_missing([email, code]):
            return create_bad_response("Missing Email or Code", "password", 400)

        user = get_user_by_email(email)

        if user is None or reset_code_is_expired(user) or not check_password_hash(user.reset_code, code):
            return create_bad_response("Invalid Credentials", "password", 400)

        update_password(user.user_id, password)

        has_changed_password(user.user_id, True)

        set_reset_code(user.user_id, None)

        # Whoever prompted this reset may already hold a live session. Retire
        # every token issued so far, so the reset actually locks them out.
        invalidate_issued_tokens(user.user_id)

        return create_good_response(f"Successfully set new password for user {user.user_id}!", 201, "password")

    except Exception:
        return create_bad_response("Unable to set new password", "password", 400)


@bp.route('/password/change', methods = ['PUT'])
@jwt_required()
@bad_token_check()
def change_password():
    """Authenticated password change for an already-logged-in user (not the forgot-password flow)."""
    try:
        password = request.json.get('password')

        if is_any_variable_in_array_missing([password]):
            return create_bad_response("Missing Password", "password", 400)

        user = get_user(int(get_jwt_identity()))

        if user is None:
            return create_bad_response("Invalid Credentials", "password", 400)

        update_password(user.user_id, password)

        has_changed_password(user.user_id, True)

        # Same reasoning as the reset path: any other session for this account
        # stops working. The caller keeps working because the pair handed back
        # below is minted against the new generation.
        invalidate_issued_tokens(user.user_id)

        access_token, refresh_token = create_new_tokens(user.user_id)

        return create_good_response(
            f"Successfully set new password for user {user.user_id}!",
            201,
            "password",
            access_token,
            refresh_token
        )

    except Exception:
        return create_bad_response("Unable to set new password", "password", 400)


@bp.route('/reset_code', methods = ['GET'])
def send_reset_code():
    try:
        email = request.args.get("email")

        if is_any_variable_in_array_missing([email]):
            raise MissingException(["Email"])

        print("             email: ", email)

        user = get_user_by_email(email)

        if user is None:
            raise InvalidCredentialsException

        code = generate_random_password(6)

        print("             reset_code:", code)

        set_reset_code(
            user.user_id,
            generate_password_hash(code),
            datetime.now(timezone.utc) + RESET_CODE_LIFETIME
        )

        send_reset_code_email(email, code)

        return create_good_response("Successfully sent reset code!", 201, "reset_code")

    except Exception as e:
        return create_bad_response(f"{e}", "reset_code", 400)


@bp.route('/reset_code', methods = ['POST'])
def check_reset_code():
    try:
        email, code = request.args.get("email"), request.args.get("code")

        if is_any_variable_in_array_missing([email, code]):
            raise MissingException(["Email", "Code"])

        user = get_user_by_email(email)

        if user is None or reset_code_is_expired(user) or not check_password_hash(user.reset_code, code):
            raise InvalidCredentialsException

        return create_good_response("Successfully validated reset code!", 200, 'reset_code')

    except Exception as e:
        return create_bad_response(f"{e}", "reset_code", 400)



user_schema = UserSchema()
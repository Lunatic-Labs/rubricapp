import traceback
import datetime
from flask import request
from core  import app
from jwt   import ExpiredSignatureError
from enums.roles import Roles
from models.user import get_password_version
from controller.Route_response import *
from flask_jwt_extended.exceptions import InvalidQueryParamError
from flask_jwt_extended import (
    create_access_token, create_refresh_token, decode_token
)

#-----------------------------------------------------
# Please note that online documentation may not be up
# to date. Click on the links for github locations.
# https://github.com/vimalloc/flask-jwt-extended/tree/master/docs
# useful examples:https://github.com/vimalloc/flask-jwt-extended/tree/master/examples
#-----------------------------------------------------

"""
Returns new access and refresh tokens based on the given user_id.

Args:
    user_id (str): The target user id.

Returns:
    tuple[str, str]: First index is the access token and the second index will be a refresh token. 
"""
def create_new_tokens(user_id: str)-> tuple[str, str]:
    existing_refresh = request.args.get('refresh_token')

    # Stamped into both tokens so a later password change can retire them. See
    # password_version_claims for why this is a counter and not a timestamp.
    claims = password_version_claims(get_password_version(user_id))

    with app.app_context():
        access_token = create_access_token(
            identity=str(user_id),
            fresh=True,
            expires_delta=datetime.timedelta(minutes=15),
            additional_claims=claims
        )

        if existing_refresh:
            refresh_token = existing_refresh
        else:
            refresh_token = create_refresh_token(
                identity=str(user_id),
                expires_delta=datetime.timedelta(days=30),
                additional_claims=claims
            )

    return access_token, refresh_token


# Claim name for the password generation a token was minted under. Kept short
# because it rides in every request. A token without it predates the column and
# is read as generation 0, which is what those users still carry.
PASSWORD_VERSION_CLAIM = "pv"


def password_version_claims(version: int) -> dict:
    return {PASSWORD_VERSION_CLAIM: version}


# Takes away jwt and refresh tokens from response
def revoke_tokens() -> None:
    with app.app_context():
        # if response.get('access_token') : response.pop('access_token')
        # if response.get('refresh_token'): response.pop('refresh_token')
        # if request.get('access_token'):
        #     request.pop('access_token')
        # if request.get('refresh_token'):
        #     request.pop('refresh_token')
        if request.headers.get('access_token'):
            request.headers.pop('access_token')
        if request.headers.get('refresh_token'):
            request.headers.pop('refresh_token')

# Returns true if token is expired
def token_expired(thing: str) -> bool:
    with app.app_context():
        try:
            decode_token(thing)
        except ExpiredSignatureError:
            return True
    return False

# Note that the following two functions assume that the token has been checked for expiration

# Function returns the user_id from the sub of the jwt
def token_user_id(thing: str, refresh: bool = False) -> int:
    with app.app_context():
        return int(decode_token(thing)['sub'])

# Handles conversion issues and warns front end of problems
def to_int(thing: str , subject: str) -> int:
    if(thing.isnumeric()):
        return int(thing)
    raise InvalidQueryParamError(f"{subject} is not purely numeric")

import traceback
import datetime
from flask import request
from core  import app
from jwt   import ExpiredSignatureError
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

# Creates both a jwt and refresh token
# jwt expires in 15mins; refresh token expires in 30days
from flask import request
from flask_jwt_extended import create_access_token, create_refresh_token
import datetime
from your_flask_app import app  # replace with your actual app import

def create_tokens(user_id: any) -> tuple[str, str]:
    with app.app_context():
        # Create access token (short-lived)
        jwt = create_access_token(
            identity=str(user_id),
            fresh=True,  # token is fresh because it comes from login
            expires_delta=datetime.timedelta(minutes=15)  # adjust as needed
        )

        # Try to get existing refresh token from request args
        refresh = request.args.get('refresh_token')
        if not refresh:
            # Create new refresh token (long-lived)
            refresh = create_refresh_token(
                identity=str(user_id),
                expires_delta=datetime.timedelta(days=30)
            )

    return jwt, refresh


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
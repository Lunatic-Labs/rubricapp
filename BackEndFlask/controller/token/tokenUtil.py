from flask import jsonify, request, Response
from flask_marshmallow import Marshmallow
from controller.Route_response import response
from controller.token.encryption import decodeAuthToken

def tokenExists():
    return True if response.get("auth_token") else False

def revokeToken():
    response.pop("auth_token") if tokenExists() else None

def authenticate(token, given):
    payload = decodeAuthToken(token)
    return (payload, payload == token)
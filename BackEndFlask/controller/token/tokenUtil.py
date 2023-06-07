from flask import jsonify, request, Response
from flask_marshmallow import Marshmallow
from controller.Route_response import response

def revokeToken():
    if response.get("auth_token"):
        response.pop("auth_token")
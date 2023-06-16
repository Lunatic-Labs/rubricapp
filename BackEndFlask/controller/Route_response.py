from flask import jsonify, request, Response
from flask_marshmallow import Marshmallow

ma = Marshmallow()

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage, content_type):
    JSON = {content_type: []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, entire_JSON, status, content_type):
    JSON = {content_type: []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON[content_type].append(entire_JSON)
    response["content"] = JSON
    JSON = {content_type: []}
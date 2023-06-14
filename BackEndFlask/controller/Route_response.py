from flask_marshmallow import Marshmallow

ma = Marshmallow()

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage, content_type, status=500):
    JSON = {content_type: []}
    response['status'] = status
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, entire_JSON, status, content_type , jwt=None, refresh=None):
    JSON = {content_type: []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON[content_type].append(entire_JSON)
    response["access_token"] = jwt
    if refresh: response["refresh_token"] = refresh
    response["content"] = JSON
    JSON = {content_type: []}
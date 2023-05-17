from flask import jsonify, request, Response
from flask_login import login_required
from models.user import *
from controller import bp
import json
from flask_marshmallow import Marshmallow

ma = Marshmallow()
response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage):
    JSON = {"users": []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, entire_users, status):
    JSON = {"users": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["users"].append(entire_users)
    response["content"] = JSON
    JSON = {"users": []}

@bp.route('/user/<int:id>', methods=['GET'])
def getUser(id):
    user = get_user(id)
    if type(user)==type(""):
        createBadResponse("An error occured fetching all users!", (user))
        return response
    createGoodResponse("Successfully retrieved user!", user_schema.dump(user), 200)
    return response


@bp.route('/user', methods = ['GET'])
def getAllUsers():
    all_users = get_users()
    if type(all_users)==type(""):
        print("User_routes /user GET] An error occurred fetching all users!", all_users)
        createBadResponse("An error occured fetching all users!", all_users)
        return response
    print("[User_routes /user GET] Successfully retrieved all users!")
    createGoodResponse("Successfully retrieved all users!", users_schema.dump(all_users), 200)
    return response

# @bp.route('/user/password/<id>', methods = ['GET'])
# def getUserPassword(id):
#     try:
#         return jsonify(get_user_password(id))
#     except Exception:
#         response = Response(response=json.dumps({'status': 400, 'message': 'Error: User does not exist', 'success': False}), status=400, mimetype='application/json')
#         return response

@bp.route('/user', methods = ['POST'])
def add_user():
    new_user = create_user(request.json)
    if type(new_user)==type(""):
        createBadResponse("An error occured creating a new user!", new_user)
        return response
    createGoodResponse("Successfully created a new user!", {}, 201)
    return response
    
@bp.route('/user/<int:id>', methods = ['PUT'])
def updateUser(id):
    user_data = request.json
    user_data["password"] = get_user_password(id)
    user = replace_user(user_data,id)
    if type(user)==type(""):
        createBadResponse("An error occured creating a new user!", user)
        return response
    createGoodResponse("Successfully created a new user!", {}, 201)
    return response

class UserSchema(ma.Schema):
    class Meta:
        fields = ('user_id','first_name','last_name', 'email', 'password','role_id', 'lms_id', 'consent', 'owner_id')

user_schema = UserSchema()
users_schema = UserSchema(many=True)
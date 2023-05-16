from flask import jsonify, request, Response
from flask_login import login_required
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow

ma = Marshmallow()

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
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

@bp.route('/user', methods = ['GET'])
def get_all_users():
    all_users = get_users()
    if type(all_users)==type(""):
        print("[User_routes /user GET] An error occurred fetching all users!", all_users)
        createBadResponse("An error occurred fetching all users!", all_users)
        return response
    results = users_schema.dump(all_users)
    print("[User_routes /user GET] Successfully retrieved all users!")
    createGoodResponse("Successfully retrieved all users!", results, 200)
    return response

@bp.route('/user/<int:id>', methods = ['GET'])
def get_one_user(id):
    one_user = get_user(id)
    if type(one_user)==type(""):
        print("[User_routes /user/<int:id> GET] An error occurred fetching one user!", one_user)
        createBadResponse("An error occurred fetching a user!", one_user)
    results = user_schema.dump(one_user)
    totalUsers = 0
    for user in results:
        totalUsers += 1
    if(totalUsers == 0):
        print(f"[User_routes /user/<int:id> GET] User_id: {id} does not exist!")
        createBadResponse("An error occurred fetching user!", f"User_id: {id} does not exist")
        return response
    print("[User_routes /user/<id> GET] Successfully fetched one user!")
    createGoodResponse("Successfully fetched user!", results, 200)
    return response

@bp.route('/user', methods = ['POST'])
def add_user():
    new_user = create_user(request.json)
    if type(new_user)==type(""):
        print("[User_routes /user POST] An error occurred creating a new user!", new_user)
        createBadResponse("An error occurred creating a new user!", new_user)
        return response
    results = user_schema.jsonify(new_user)
    print("[User_routes /user POST] Successfully created a new user!")
    createGoodResponse("Successfully created a new user!", {}, 201)
    return response

@bp.route('/user/<int:id>', methods = ['PUT'])
def update_user(id):
    updated_user = replace_user(request.json, id)
    if type(updated_user)==type(""):
        print("[User_routes /user/<int:id> PUT] An error occurred replacing user!", updated_user)
        createBadResponse("An error occurred updating the existing user!", updated_user)
        return response
    results = user_schema.dump(updated_user)
    print("[User_routes /user/<int:id> PUT] Successfully updated user!")
    createGoodResponse("Sucessfully updated existing user!", results, 201)
    return response

"""
Delete route below! Not to be implemented until the fall semester!
"""

# @bp.route('/delete/<id>/', methods = ['DELETE'])
# def user_delete(id):
#     user = User.query.get(id)
#     db.session.delete(user)
#     db.session.commit()
#     return user_schema.jsonify(user)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('user_id', 'fname', 'lname', 'email', 'password', 'role_id', 'lms_id', 'consent', 'consent_is_null', 'owner_id')

user_schema = UserSchema()
users_schema = UserSchema(many=True)
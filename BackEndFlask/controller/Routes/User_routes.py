from controller import bp
from flask import jsonify, request, redirect, url_for
from flask_login import login_required
from models.user import *
import json

def convertSQLQueryToJSON(all_users):
    entire_users = []
    for user in all_users:
        new_user = {}
        new_user["user_id"] = user.user_id
        new_user["first_name"] = user.fname
        new_user["last_name"] = user.lname
        new_user["email"] = user.email
        # Still not sure whether or not to return user passwords!
        # new_user["password"] = user.password
        new_user["role"] = user.role
        new_user["lms_id"] = user.lms_id
        new_user["consent"] = user.consent
        new_user["owner_id"] = user.owner_id
        entire_users.append(new_user)
    return entire_users

JSON = {
    "users": []
}

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

def extractData(user):
    return [user["first_name"], user["last_name"], user["email"], user["password"], user["role"], user["lms_id"], user["consent"], user["owner_id"]]

@bp.route('/user', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        all_users = get_users()
        if type(all_users)==type(""):
            print("[User_routes /user GET] An error occured fetching all users!!! ", all_users)
            createBadResponse("An error occured fetching all users!", all_users)
            return response
        entire_users = convertSQLQueryToJSON(all_users)
        print("[User_routes /user GET] Successfully retrieved all users!!!")
        createGoodResponse("Successfully retrieved all users!", entire_users, 200)
        return response
    elif request.method == 'POST':
        data = request.data
        data = data.decode()
        data = json.loads(data)
        user = extractData(data)
        one_user = create_user(user)
        if type(one_user)==type(""):
            print("[User_routes /user POST] An error occured creating a new user!!! ", one_user)
            createBadResponse("An error occured creating a new user!", one_user)
            return response
        print("[User_routes /user POST] Successfully created a new user!!!")
        createGoodResponse("Successfully created a new user!", {}, 201)
        return response

response["Access-Control-Allow-Origin"] = "http://127.0.0.1:5500, http://127.0.0.1:3000, *"
# response["Access-Control-Allow-Methods"] = ['GET', 'PUT', 'PATCH', 'DELETE']
response["Access-Control-Allow-Methods"] = ['GET', 'PUT']

# @bp.route('/user/<int:id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
@bp.route('/user/<int:id>', methods=['GET', 'PUT'])
def user(id):
    if request.method == 'GET':
        one_user = get_user(id)
        if type(one_user)==type(""):
            print("[User_routes /user/<int:id> GET] An error occured fetching one user!!! ", one_user)
            createBadResponse("An error occured fetching user!", one_user)
            return response
        entire_users = convertSQLQueryToJSON(one_user)
        totalUsers = 0
        for user in entire_users:
            totalUsers += 1
        if(totalUsers == 0):
            print(f"[User_routes /user/<int:id> GET] User_id: {id} does not exist!")
            createBadResponse("An error occured fetching user!", f"User_id: {id} does not exist!")
            return response
        print("[User_routes /user/<int:id> GET] Successfully fetched one user!!!")
        createGoodResponse("Successfully fetched user!!!", entire_users, 200)
        return response
    elif request.method == 'PUT':
        data = request.data
        data = data.decode()
        data = json.loads(data)
        password = get_user_password(id)
        if(password.find("sha")==-1):
            print("[User_routes /user PUT] An error occured retrieving user password!!! ", password)
            createBadResponse("An error occured updating existing user!", password)
            return response
        data["password"] = password
        user = extractData(data)
        all_users = replace_user(user, id)
        if type(all_users)==type(""):
            print("[User_routes /user PUT] An error occured replacing user!!! ", all_users)
            createBadResponse("An error occured updating existing user!", all_users)
            return response
        entire_users = []
        entire_users.append(all_users)
        entire_users = convertSQLQueryToJSON(entire_users)
        print("[User_routes /user PUT] Successfully updated user!!!")
        createGoodResponse("Successfully updated existing user!", entire_users, 201)
        return response
    # elif request.method == 'PATCH':
    #     user_id = request.form.get("userID")
    #     new_first_name = request.form.get("newFirstName")
    #     new_last_name = request.form.get("newLastName")
    #     new_email = request.form.get("newEmail")
    #     new_password = request.form.get("newPassword")
    #     new_role = request.form.get("newRole")
    #     new_institution = request.form.get("newInstitution")
    #     new_consent = request.form.get("newConsent")
    #     all_users = get_users()
    #     if new_first_name is not False:
    #         all_users = update_user_first_name(user_id, new_first_name)
    #         if all_users is False:
    #             response["status"] = 400
    #             response["success"] = False
    #             response["message"] = "An error occured updating user's first name!"
    #             return response
    #     if new_last_name is not False:
    #         all_users = update_user_last_name(user_id, new_first_name)
    #         if all_users is False:
    #             response["status"] = 400
    #             response["success"] = False
    #             response["message"] = "An error occured updating user's last name!"
    #             return response
    #     if new_email is not False:
    #         all_users = update_user_email(user_id, new_email)
    #         if all_users is False:
    #             response["status"] = 500
    #             response["success"] = False
    #             response["message"] = "An error occured updating user's email!"
    #             return response 
    #     if new_password is not False:
    #         all_users = update_user_password(user_id, new_password)
    #         if all_users is False:
    #             response["status"] = 500
    #             response["success"] = False
    #             response["message"] = "An error occured updating user's password!"
    #             return response 
    #     if new_role is not False:
    #         all_users = update_user_role(user_id, new_role)
    #         if all_users is False:
    #             response["status"] = 500
    #             response["success"] = False
    #             response["message"] = "An error occured updating user's role!" 
    #     if new_institution is not False:
    #         all_users = update_user_institution(user_id, new_institution)
    #         if all_users is False:
    #             response["status"] = 500
    #             response["success"] = False
    #             response["message"] = "An error occured updating user's institution!"
    #             return response
    #     if new_consent is not False:
    #         all_users = update_user_consent(user_id, new_consent)
    #         if all_users is False:
    #             response["status"] = 500
    #             response["success"] = False
    #             response["message"] = "An error occured updating user's consent!"
    #             return response 
    #     entire_users = convertSQLQueryToJSON(all_users)
    #     JSON["users"].append(entire_users) 
    #     response["content"] = JSON
    #     response["status"] = 201
    #     response["status"] = True
    #     response["message"] = "Successfully updated user {user_id} requested attributes!" 
    #     return response
    # elif request.method == 'DELETE':
    #     all_users = delete_user(id)
    #     if type(all_users)==type(""):
    #         print("[User_routes /user DELETE] An error occured deleting user!!!", all_users)
    #         createBadResponse(f"An error occured deleting user_id: {id}!!!", all_users)
    #         return response
    #     print(f"[User_routes /user DELETE] Successfully deleted user_id: {id}!!!")
    #     createGoodResponse(f"Successfully deleted user_id: {id}!!!", {}, 200)
    #     return response
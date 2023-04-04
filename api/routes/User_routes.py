from api import bp
from flask import jsonify, request, redirect, url_for
from flask_login import login_required
from models.User import *
import json

def convertSQLQueryToJSON(all_users):
    entire_users = []
    for user in all_users:
        new_user = {}
        # id attribute was changed to user_id
        new_user["user_id"] = user.user_id
        new_user["first_name"] = user.fname
        new_user["last_name"] = user.lname
        new_user["email"] = user.email
        # Still not sure whether or not to return user passwords!
        # new_user["password"] = user.password
        new_user["role"] = user.role
        # Institution attribute was removed!!!
        # new_user["institution"] = user.institution
        # lms_id attribute was added!!!
        new_user["lms_id"] = user.lms_id
        new_user["consent"] = user.consent
        # owner_id attribute was added!!!
        new_user["owner_id"] = user.owner_id
        entire_users.append(new_user)
    return entire_users

JSON = {
    "users": []
}

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message):
    response['status'] = 500
    response["success"] = False
    response["message"] = message
    response["content"] = JSON

def createGoodResponse(message, entire_users, status):
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["users"].append(entire_users)
    response["content"] = JSON

def extractData(user):
    return (user["user_id"], user["fname"], user["lname"], user["email"], user["password"], user["role"], user["lms_id"], user["consent", user["owner_id"]])

@bp.route('/user', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        all_users = get_users()
        if all_users==False:
            print("[User_routes -> /user -> GET] An error occured fetching all users!!!")
            createBadResponse("An error occured fetching all users!")
            return response
        entire_users = convertSQLQueryToJSON(all_users)
        print("[User_routes -> /user -> GET] Successfully retrieved all users!!!")
        createGoodResponse("Successfully retrieved all users!", entire_users, 200)
        return response
    elif request.method == 'POST':
        data = request.data
        data = data.decode()
        data = json.loads(data)
        user = extractData(data)
        print(user)
        new_first_name = data["first_name"]
        new_last_name = data["last_name"] 
        new_email = data["email"]
        new_password = data["password"]
        new_role = data["role"]
        new_institution = data["institution"]
        new_consent = data["consent"]
        one_users = create_user(new_first_name=new_first_name, new_last_name=new_last_name, new_email=new_email, new_password=new_password, new_role=new_role, new_institution=new_institution, new_consent=new_consent)
        if one_users == False:
            createBadResponse("An error occured creating a new user!")
            return response
        createGoodResponse("Successfully created a new user!", one_users, 201)
        return response

@bp.route('/user/<int:id>', methods=['GET', 'PUT', 'PATCH', 'DELETE'])
def user(id):
    JSON = {
        "users": []
    }
    response = {
        "contentType": "application/json",
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
        "Access-Control-Allow-Methods": ['GET', 'PUT', 'PATCH', 'DELETE'],
        "Access-Control-Allow-Headers": "Content-Type"
    }
    if request.method == 'GET':
        one_user = get_user(id)
        if one_user is False:
            response["status"] = 400
            response["success"] = False
            response["message"] = "An error occured fetching user!"
            return response
        entire_users = convertSQLQueryToJSON(one_user)
        JSON["users"].append(entire_users)
        response["content"] = JSON
        response["status"] = 200
        response["success"] = True
        response["message"] = "Successfully fetched user!"
        return response
    elif request.method == 'PUT':
        data = request.data
        data = data.decode()
        data = json.loads(data.data)
        # new_first_name = data["first_name"]
        # new_last_name = data["last_name"] 
        # new_email = data["email"]
        # new_password = data["password"]
        # new_role = data["role"]
        # new_institution = data["institution"]
        # new_consent = data["consent"]
        # all_users = replace_user(id=id, new_first_name=new_first_name, new_last_name=new_last_name, new_email=new_email, new_password=new_password, new_role=new_role, new_institution=new_institution, new_consent=new_consent)
        # if all_users == False:
        #     response["status"] = 400
        #     response["success"] = False
        #     response["message"] = "An error occured replacing user {user_id}!"
        #     return response
        response["status"] = 201
        response["status"] = True
        response["message"] = "Successfully replaced user {user_id}!" 
        return response
        # user_id = request.form.get("userID")
        # new_first_name = request.form.get("newFirstName")
        # new_last_name = request.form.get("newLastName")
        # new_email = request.form.get("newEmail")
        # new_password = request.form.get("newPassword")
        # new_role = request.form.get("newRole")
        # new_institution = request.form.get("newInstitution")
        # new_consent = request.form.get("newConsent")
        # all_users = replace_user(user_id, new_first_name, new_last_name, new_email, new_password, new_role, new_institution, new_consent) 
        # if all_users is False:
        #     response["status"] = 400
        #     response["success"] = False
        #     response["message"] = "An error occured replacing a new user!"
        # entire_users = convertSQLQueryToJSON(all_users)
        # JSON["users"].append(entire_users) 
        # response["content"] = JSON
        # response["status"] = 201
        # response["status"] = True
        # response["message"] = "Successfully replaced user {user_id}" 
        # return response
    elif request.method == 'PATCH':
        user_id = request.form.get("userID")
        new_first_name = request.form.get("newFirstName")
        new_last_name = request.form.get("newLastName")
        new_email = request.form.get("newEmail")
        new_password = request.form.get("newPassword")
        new_role = request.form.get("newRole")
        new_institution = request.form.get("newInstitution")
        new_consent = request.form.get("newConsent")
        all_users = get_users()
        if new_first_name is not False:
            all_users = update_user_first_name(user_id, new_first_name)
            if all_users is False:
                response["status"] = 400
                response["success"] = False
                response["message"] = "An error occured updating user's first name!"
                return response
        if new_last_name is not False:
            all_users = update_user_last_name(user_id, new_first_name)
            if all_users is False:
                response["status"] = 400
                response["success"] = False
                response["message"] = "An error occured updating user's last name!"
                return response
        if new_email is not False:
            all_users = update_user_email(user_id, new_email)
            if all_users is False:
                response["status"] = 500
                response["success"] = False
                response["message"] = "An error occured updating user's email!"
                return response 
        if new_password is not False:
            all_users = update_user_password(user_id, new_password)
            if all_users is False:
                response["status"] = 500
                response["success"] = False
                response["message"] = "An error occured updating user's password!"
                return response 
        if new_role is not False:
            all_users = update_user_role(user_id, new_role)
            if all_users is False:
                response["status"] = 500
                response["success"] = False
                response["message"] = "An error occured updating user's role!" 
        if new_institution is not False:
            all_users = update_user_institution(user_id, new_institution)
            if all_users is False:
                response["status"] = 500
                response["success"] = False
                response["message"] = "An error occured updating user's institution!"
                return response
        if new_consent is not False:
            all_users = update_user_consent(user_id, new_consent)
            if all_users is False:
                response["status"] = 500
                response["success"] = False
                response["message"] = "An error occured updating user's consent!"
                return response 
        entire_users = convertSQLQueryToJSON(all_users)
        JSON["users"].append(entire_users) 
        response["content"] = JSON
        response["status"] = 201
        response["status"] = True
        response["message"] = "Successfully updated user {user_id} requested attributes!" 
        return response
    elif request.method == 'DELETE':
        all_users = delete_user(id)
        if all_users is False:
            response["status"] = 500
            response["success"] = False
            response["message"] = "An error occured replacing a new user!"
            return response
        response["status"] = 200
        response["success"] = True
        response["message"] = "Successfully delete a user!"
        return response
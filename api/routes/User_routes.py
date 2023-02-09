from api import bp
from flask import jsonify, request, redirect, url_for
from flask_login import login_required
from models.User import *

def convertSQLQueryToJSON(all_users):
    entire_users = []
    for user in all_users:
        new_user = {}
        new_user["user_id"] = user.user_id
        new_user["first_name"] = user.first_name
        new_user["last_name"] = user.last_name
        new_user["email"] = user.email
        # Still not sure whether or not to return user passwords!
        # new_user["password"] = user.password
        new_user["role"] = user.role
        new_user["institution"] = user.institution
        new_user["consent"] = user.consent
        entire_users.append(new_user)
    return entire_users

@bp.route('/user', methods=['GET', 'POST', 'DELETE'])
def users():
    JSON = {
        "users": []
    }
    response = {
        "contentType": "application/json",
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500, *",
        "Access-Control-Allow-Methods": ['GET', 'POST', 'DELETE'],
        "Access-Control-Allow-Headers": "Content-Type"
    } 
    if request.method == 'GET':
        all_users = get_users()
        if all_users is False:
            response["status"] = 500
            response["success"] = False
            response["message"] = "An error occured fetching all users!"
            return response
        entire_users = convertSQLQueryToJSON(all_users)
        JSON["users"].append(entire_users) 
        response["content"] = JSON
        response["status"] = 200
        response["status"] = True
        response["message"] = "Successfully retrieved all users!" 
        return response
    elif request.method == 'POST':
        new_first_name = request.form.get("newFirstName")
        new_last_name = request.form.get("newLastName")
        new_email = request.form.get("newEmail")
        new_password = request.form.get("newPassword")
        new_role = request.form.get("newRole")
        new_institution = request.form.get("newInstitution")
        new_consent = request.form.get("newConsent")
        all_users = create_user(new_first_name, new_last_name, new_email, new_password, new_role, new_institution, new_consent)
        if all_users is False:
            response["status"] = 400
            response["success"] = False
            response["message"] = "An error occured creating a new user!"
        entire_users = convertSQLQueryToJSON(all_users)
        JSON["users"].append(entire_users) 
        response["content"] = JSON
        response["status"] = 201
        response["status"] = True
        response["message"] = "Successfully created a new user!" 
        return redirect(url_for("admin"))
    elif request.method == 'DELETE':
        print("DELETE request made!!!")
        user_id = request.form.get("userID")
        print(user_id)
        if user_id is None:
            print("missing")
        else:
            # all_users = delete_user(user_id)
            all_users = get_users()
            if all_users is False:
                response["status"] = 500
                response["success"] = False
                response["message"] = "An error occured replacing a new user!"
                return response
        # all_users = delete_all_users()
        # if all_users is False:
        #     response["status"] = 500
        #     response["success"] = False
        #     response["message"] = "An error occured deleting all users!"
        #     return response
        # entire_users = convertSQLQueryToJSON(all_users)
        # JSON["users"].append(entire_users)
        # response["content"] = JSON
        # response["status"] = 200
        # response["success"] = True
        # response["message"] = "Successfully deleted all users!"
        # return response

@bp.route('/user/<int:id>', methods=['GET', 'PUT', 'PATCH'])
def user(id):
    JSON = {
        "users": []
    }
    response = {
        "contentType": "application/json",
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
        "Access-Control-Allow-Methods": ['GET', 'PUT', 'PATCH'],
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
        user_id = request.form.get("userID")
        new_first_name = request.form.get("newFirstName")
        new_last_name = request.form.get("newLastName")
        new_email = request.form.get("newEmail")
        new_password = request.form.get("newPassword")
        new_role = request.form.get("newRole")
        new_institution = request.form.get("newInstitution")
        new_consent = request.form.get("newConsent")
        all_users = replace_user(user_id, new_first_name, new_last_name, new_email, new_password, new_role, new_institution, new_consent) 
        if all_users is False:
            response["status"] = 400
            response["success"] = False
            response["message"] = "An error occured replacing a new user!"
        entire_users = convertSQLQueryToJSON(all_users)
        JSON["users"].append(entire_users) 
        response["content"] = JSON
        response["status"] = 201
        response["status"] = True
        response["message"] = "Successfully replaced user {user_id}" 
        return response
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
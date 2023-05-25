from flask import jsonify, request, Response
from flask_login import login_required
from models.user import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/user', methods = ['GET'])
def getAllUsers():
    if(request.args):
        print(request.args)

    all_users = get_users()
    if type(all_users)==type(""):
        print("[User_routes /user GET] An error occurred retrieving all users: ", all_users)
        createBadResponse("An error occurred retrieving all users!", all_users, "users")
        return response
    print("[User_routes /user GET] Successfully retrieved all users!")
    createGoodResponse("Successfully retrieved all users!", users_schema.dump(all_users), 200, "users")
    return response

@bp.route('/user/<int:id>', methods=['GET'])
def getUser(id):
    user = get_user(id)
    if type(user)==type(""):
        print(f"[User_routes /user/<int:id> GET] An error occured fetching user_id: {id}, ", user)
        createBadResponse(f"An error occurred fetching user_id: {id}!", (user), "users")
        return response
    print(f"[User_routes /user/<int:id> GET] Successfully fetched user_id: {id}!")
    createGoodResponse(f"Successfully fetched user_id: {id}!", user_schema.dump(user), 200, "users")
    return response

@bp.route('/user', methods = ['POST'])
def add_user():
    new_user = create_user(request.json)
    if type(new_user)==type(""):
        print("[User_routes /user POST] An error occurred creating a new user: ", new_user)
        createBadResponse("An error occurred creating a new user!", new_user, "users")
        return response
    print("[User_routes /user POST] Successfully create a new user!")
    createGoodResponse("Successfully created a new user!", user_schema.dump(new_user), 201, "users")
    return response
    
@bp.route('/user/<int:id>', methods = ['PUT'])
def updateUser(id):
    user_data = request.json
    user_data["password"] = get_user_password(id)
    user = replace_user(user_data,id)
    if type(user)==type(""):
        print(f"[User_routes /user/<int:id> PUT] An error occurred replacing user_id: {id}, ", user)
        createBadResponse(f"An error occurred replacing user_id: {id}!", user, "users")
        return response
    print(f"[User_routes /user/<int:id> PUT] Successfully replacing user_id: {id}!")
    createGoodResponse(f"Successfully replacing user_id: {id}!", user_schema.dump(user), 201, "users")
    return response

class UserSchema(ma.Schema):
    class Meta:
        fields = ('user_id','first_name','last_name', 'email', 'password','role_id', 'lms_id', 'consent', 'owner_id')

user_schema = UserSchema()
users_schema = UserSchema(many=True)
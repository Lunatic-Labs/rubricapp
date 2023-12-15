from flask import request
from controller  import bp
from models.team import get_team 
from models.course import get_course
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from models.team_user   import get_team_users_by_team_id
from controller.security.customDecorators import AuthCheck, badTokenCheck
from models.user_course import(
    create_user_course, 
    get_user_course_by_user_id_and_course_id
)
from models.user import(
    get_users,
    get_user,
    user_already_exists,
    create_user,
    get_user_password,
    replace_user,
    makeAdmin
)
from models.utility import (
    get_users_by_course_id,
    get_users_by_course_id_and_role_id,
    get_users_by_role_id,
    get_user_admins
)

@bp.route('/user', methods = ['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def getAllUsers():
    if(request.args and request.args.get("team_id")):
        team_id = int(request.args.get("team_id"))
        team = get_team(team_id)
        if type(team)==type(""):
            print(f"[User_routes /user?team_id=<int:team_id> GET] An error occurred retrieving team_id: {team_id}, ", team)
            createBadResponse(f"An error occurred retrieving team_id: {team_id}!", team, "users")
            return response
        team_users = get_team_users_by_team_id(team_id)
        if type(team_users)==type(""):
            print(f"[User_routes /user?team_id=<int:team_id> GET] An error occurred retrieving all users assigned to team_id: {team_id}, ", team_users)
            createBadResponse(f"An error occurred retrieving all users assigned to team_id: {team_id}!", team_users, "users")
            return response
        all_users = []
        for team_user in team_users:
            user = get_user(team_user.user_id)
            if type(user)==type(""):
                print(f"[User_routes /user?team_id=<int:team_id> GET] An error occurred retrieving all users assigned to team_id: {team_id}, ", user)
                createBadResponse(f"An error occurred retrieving all users assigned to team_id: {team_id}!", user, "users")
                return response
            all_users.append(user)
        print(f"[User_routes /user?team_id=<int:team_id> GET] Successfully retrieved all users assigned to team_id: {team_id}!")
        createGoodResponse(f"Successfully retrieved all users assigned to team_id: {team_id}!", users_schema.dump(all_users), 200, "users")
        return response

    if(request.args and request.args.get("course_id")):
        course_id = int(request.args.get("course_id"))

        if request.args.get("role_id"):
            all_users = get_users_by_course_id_and_role_id(course_id, request.args.get("role_id"))
        else:
            all_users = get_users_by_course_id(course_id)

        if type(all_users)==type(""):
            print(f"[User_routes /user?course_id=<int:course_id> GET] An error occurred retrieving all users enrolled in course_id: {course_id}, ", all_users)
            createBadResponse(f"An error occurred retrieving all users enrolled in course_id: {course_id}!", all_users, "users")
            return response
        print(f"[User_routes /user?course_id=<int:course_id> GET] Successfully retrieved all users enrolled in course_id: {course_id}!")
        createGoodResponse(f"Successfully retrieved all users enrolled in course_id: {course_id}!", users_schema.dump(all_users), 200, "users")
        return response

    if(request.args and request.args.get("role_id")):
        role_id = int(request.args.get("role_id"))
        all_users = get_users_by_role_id(role_id)
        if type(all_users)==type(""):
            print(f"[User_routes /user?role_id=<int:role_id> GET] An error occurred retrieving all users with role_id: {role_id}, ", all_users)
            createBadResponse(f"An error occurred retrieving all users with role_id: {role_id}!", all_users, "users")
            return response
        print("[User_routes /user?role_id=<int:role_id> GET] Successfully retrieved all users!")
        createGoodResponse("Successfully retrieved all users!", users_schema.dump(all_users), 200, "users")
        return response

    if(request.args and request.args.get("isAdmin")):
        if(int(request.args.get("user_id")) != 1):
            print(f"[User_routes /user?isAdmin=<bool> GET] An error occurred retrieving all admins!", "Only a SuperAdmin can view all Admins!")
            createBadResponse(f"An error occurred retrieving all admins!", "Only a SuperAdmin can view all Admins!", "users")
            return response
        all_admins = get_user_admins()
        if type(all_admins)==type(""):
            print(f"[User_routes /user?isAdmin=<bool> GET] An error occurred retrieving all admins!", all_admins)
            createBadResponse(f"An error occurred retrieving all admins!", all_admins, "users")
            return response
        print("[User_routes /user?isAdmin GET] Successfully retrieved all admins!")
        createGoodResponse("Successfully retrieved all admins!", users_schema.dump(all_admins), 200, "users")
        return response
    all_users = get_users()

    if type(all_users)==type(""):
        print(f"[User_routes /user GET] An error occurred retrieving all users, ", all_users)
        createBadResponse(f"An error occurred retrieving all users!", all_users, "users")
        return response
    print("[User_routes /user GET] Successfully retrieved all users!")
    createGoodResponse("Successfully retrieved all users!", users_schema.dump(all_users), 200, "users")
    return response

@bp.route('/user', methods=['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def getUser():
    user_id = request.args.get("uid") # uid instead of user_id since user_id is used by authenication system 
    user = get_user(user_id)
    if type(user)==type(""):
        print(f"[User_routes /user/<int:user_id> GET] An error occured fetching user_id: {user_id}, ", user)
        createBadResponse(f"An error occurred fetching user_id: {user_id}!", (user), "users")
        return response
    print(f"[User_routes /user/<int:user_id> GET] Successfully fetched user_id: {user_id}!")
    createGoodResponse(f"Successfully fetched user_id: {user_id}!", user_schema.dump(user), 200, "users")
    return response

@bp.route('/user', methods = ['POST'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def add_user():
    if(request.args and request.args.get("course_id")):
        course_id = int(request.args.get("course_id"))
        course = get_course(course_id)
        if type(course)==type(""):
            print(f"[User_routes /user?course_id=<int:id> POST] An error occurred retrieving course_id: {course_id}, ", course)
            createBadResponse(f"An error occurred retrieving course_id: {course_id}!", course, "users")
            return response
        user_exists = user_already_exists(request.json)
        if user_exists:
            user_course_exists = get_user_course_by_user_id_and_course_id(user_exists.user_id, course_id)
            if type(user_course_exists)==type(""):
                print(f"[User_routes /user?course_id=<int:id> POST] An error occurred enrolling existing user in course_id: {course_id}, ", user_exists)
                createBadResponse(f"An error occurred enrolling existing user in course_id: {course_id}!", user_course_exists, "users")
                return response
            if user_course_exists:
                print(f"[User_routes /user?course_id=<int:id> POST] User is already enrolled in course_id: {course_id}!")
                createBadResponse(f"User is already enrolled in course_id: {course_id}!", "", "users")
                return response
            user_course = create_user_course({
                "user_id": user_exists.user_id,
                "course_id": course_id,
                "role_id": request.json["role_id"]
            })
            if type(user_course)==type(""):
                print(f"[User_routes /user?course_id=<int:id> POST] An error occurred enrolling existing user in course_id: {course_id}, ", user_course)
                createBadResponse(f"An error occurred enrolling existing user in course_id: {course_id}!", user_course, "users")
                return response
            newAdmin = makeAdmin(user_exists.user_id)
            if type(newAdmin) is type(""):
                print(f"[User_routes /user?course_id=<int:id> POST] An error occurred enrolling existing user in course_id: {course_id}, ", newAdmin)
                createBadResponse(f"An error occurred enrolling existing user in course_id: {course_id}!", newAdmin, "users")
                return response
            print(f"[User_routes /user?course_id=<int:id> POST] Successfully enrolled existing user in course_id: {course_id}")
            createGoodResponse(f"Successfully enrolled existing user in course_id: {course_id}", user_schema.dump(user_exists), 200, "users")
            return response
        else:
            new_user = create_user(request.json)
            if type(new_user)==type(""):
                print("[User_routes /user?course_id=<int:id> POST] An error occurred creating a new user: ", new_user)
                createBadResponse("An error occurred creating a new user!", new_user, "users")
                return response
            user_course = create_user_course({
                "user_id": new_user.user_id,
                "course_id": course_id,
                "role_id": request.json["role_id"]
            })
            if type(user_course)==type(""):
                print(f"[User_routes /user?course_id=<int:id> POST] An error occurred enrolling newly created user in course_id: {course_id}, ", user_course)
                createBadResponse(f"An error occurred enrolling newly created user in course_id: {course_id}!", user_course, "users")
                return response
            print(f"[User_routes /user?course_id=<int:id> POST] Successfully created a new user and enrolled that user in course_id: {course_id}!")
            createGoodResponse(f"Successfully created a new user and enrolled that user in course_id: {course_id}", user_schema.dump(new_user), 200, "users")
            return response
    new_user = create_user(request.json)
    if(request.args.get("user_id") == 1 and request.json["role_id"] == 3):
        one_admin = makeAdmin(new_user.user_id)
        if type(one_admin)==type(""):
            print("[User_routes /user POST] An error occurred creating a new user: ", one_admin)
            createBadResponse("An error occurred creating a new user!", new_user, "users")
            return response
    if type(new_user)==type(""):
        print("[User_routes /user POST] An error occurred creating a new user: ", new_user)
        createBadResponse("An error occurred creating a new user!", new_user, "users")
        return response
    print("[User_routes /user POST] Successfully create a new user!")
    createGoodResponse("Successfully created a new user!", user_schema.dump(new_user), 201, "users")
    return response
    
@bp.route('/user', methods = ['PUT'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def updateUser():
    user_id = int(request.args.get("uid")) # uid instead of user_id since user_id is used by authenication system 
    if type(user_id)==type(""):
        print(f"[User_routes /user PUT] An error occurred replacing user_id: {user_id}, ", user_id)
        createBadResponse(f"An error occurred replacing a user!", user_id, "users")
        return response
    request.json["password"] = get_user_password(user_id)
    user = replace_user(request.json, user_id)
    if type(user)==type(""):
        print(f"[User_routes /user/<int:user_id> PUT] An error occurred replacing user_id: {user_id}, ", user)
        createBadResponse(f"An error occurred replacing a user!", user, "users")
        return response
    one_user = makeAdmin(user_id)
    if type(one_user)==type(""):
        print(f"[User_routes /user PUT] An error occurred replacing user_id: {user_id}, ", one_user)
        createBadResponse(f"An error occurred replacing user_id: {user_id}!", one_user, "users")
        return response
    print(f"[User_routes /user/<int:user_id> PUT] Successfully replaced user_id: {user_id}!")
    createGoodResponse(f"Successfully replaced user_id: {user_id}!", user_schema.dump(user), 201, "users")
    return response

class UserSchema(ma.Schema):
    class Meta:
        fields = (
            'user_id',
            'first_name',
            'last_name',
            'email',
            'lms_id',
            'consent',
            'owner_id',
            'role_id'
        )

user_schema = UserSchema()
users_schema = UserSchema(many=True)
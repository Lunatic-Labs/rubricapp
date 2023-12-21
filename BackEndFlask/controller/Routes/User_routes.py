from flask import request
from controller  import bp
from models.user_course import get_user_courses_by_course_id, create_user_course, get_user_course_by_user_id_and_course_id, set_active_status_of_user_to_inactive
from models.team import get_team 
from controller.Route_response import *
from flask_jwt_extended import jwt_required
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

from models.queries import (
    get_users_by_course_id,
    get_users_by_course_id_and_role_id,
    get_users_by_role_id,
    get_user_admins,
    get_users_by_team_id,
    get_users_not_in_team_id,
    add_user_to_team,
    remove_user_from_team
)


@bp.route('/user', methods = ['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def getAllUsers():
    try:
        if request.args and request.args.get("isAdmin"):
            return create_good_response(users_schema.dump(get_user_admins()), 200, "users")

        if (request.args and request.args.get("team_id")):
            team_id = int(request.args.get("team_id"))
            team = get_team(team_id)

            if request.args.get("assign"):
                # We are going to remove users!
                # return users that are in the team!
                team_users = get_users_by_team_id(team)
            else:
                # We are going to add users!
                # return users that are not in the team!
                team_users = get_users_not_in_team_id(team)

            return create_good_response(users_schema.dump(team_users), 200, "users")

        if (request.args and request.args.get("course_id")):
            course_id = int(request.args.get("course_id"))

            if request.args.get("role_id"):
                all_users = get_users_by_course_id_and_role_id(course_id, request.args.get("role_id"))
            else:
                all_users = get_users_by_course_id(course_id)

            return create_good_response(users_schema.dump(all_users), 200, "users")

        all_users = get_users()
        return create_good_response(users_schema.dump(all_users), 200, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all users: {e}", "users", 400)


@bp.route('/user', methods=['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def getUser():
    try:
        user_id = request.args.get("uid") # uid instead of user_id since user_id is used by authenication system 
        user = get_user(user_id)
        return create_good_response(user_schema.dump(user), 200, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving a user: {e}", "users", 400)


@bp.route('/user', methods = ['POST'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def add_user():
    try:
        if request.args and request.args.get("team_id"):
            for user_id in request.args.get("user_ids"):
                add_user_to_team(user_id, request.args.get("team_id"))
            
            return create_good_response([], 201, "users")

        if (request.args and request.args.get("course_id")):
            course_id = int(request.args.get("course_id"))
            get_course(course_id)  # Trigger an error if not exists.
            user_exists = user_already_exists(request.json)

            if user_exists is not None:
                user_course_exists = get_user_course_by_user_id_and_course_id(
                    user_exists.user_id, course_id)

                if user_course_exists:
                    raise Exception("User is already enrolled in course")

                create_user_course({
                    "user_id": user_exists.user_id,
                    "course_id": course_id,
                    "role_id": request.json["role_id"]
                })

                return create_good_response(user_schema.dump(user_exists), 200, "users")

            else:
                new_user = create_user(request.json)

                create_user_course({
                    "user_id": new_user.user_id,
                    "course_id": course_id,
                    "role_id": request.json["role_id"],
                })

                return create_good_response(user_schema.dump(user_exists), 200, "users")

        new_user = create_user(request.json)

        return create_good_response(user_schema.dump(new_user), 201, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred creating a user: {e}", "users", 400)


@bp.route('/user', methods = ['PUT'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def updateUser():
    try:
        if (request.args and request.args.get("team_id")):
            team_id = int(request.args.get("team_id"))
            team = get_team(team_id)

            user_ids = request.args.get("user_ids").split(",")

            for user_id in user_ids:
                remove_user_from_team(int(user_id), team_id)

            return create_good_response([], 201, "users")

        user_id = request.args.get("uid")
        user_data = request.json
        user_data["password"] = get_user_password(user_id)
        user = replace_user(user_data, user_id)

        if user_data["role_id"] == 3:
            makeAdmin(user_id)

        return create_good_response(user_schema.dump(user), 201, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred replacing a user_id: {e}", "users")


@bp.route('/userCourse/disable/<int:user_id>/<int:course_id>', methods = ['PUT'])
def disableUserCourse(user_id, course_id):
        if(type(course_id)==type("")):
            print(f"[User_routes /user/<int:user_id> PUT] An error occurred unenrolling user_id: {user_id}!")
            createBadResponse(f"An error occured getting course_id", course_id, "users")
            return response
        deleteUserWorked = set_active_status_of_user_to_inactive(user_id, course_id)
        if(type(deleteUserWorked)==type("")):
            print(f"[User_routes /user/<int:user_id> PUT] An error occurred unenrolling user_id: {user_id}!")
            createBadResponse(f"An error occured unenrolling user_id", deleteUserWorked, "users")
            return response
        print(f"[User_routes /user/<int:user_id> PUT] Successfully unenrolled user_id: {user_id} in course_id: {course_id}!")
        createGoodResponse(f"Successfully unenrolled user_id: {user_id} from course_id: {course_id}!", user_schema.dumps(deleteUserWorked), 201, "userCourses")
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
            'active',
            'has_set_password',
            'reset_code',
            'isAdmin',
            'role_id'
        )


user_schema = UserSchema()
users_schema = UserSchema(many=True)

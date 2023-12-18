from flask import jsonify, request, Response
from models.user import *
from models.course import *
from models.user_course import get_user_courses_by_course_id, create_user_course, get_user_course_by_user_id_and_course_id
from models.team import get_team
from models.team_user import get_team_users_by_team_id
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/user', methods = ['GET'])
def getAllUsers():
    try:
        if(request.args and request.args.get("team_id")):
            team_id = int(request.args.get("team_id"))
            get_team(team_id)  # Trigger an error if not exists.
            team_users = get_team_users_by_team_id(team_id)

            all_users = []

            for team_user in team_users:
                user = get_user(team_user.user_id)
                all_users.append(user)

            createGoodResponse(f"Successfully retrieved all users assigned to team_id: {team_id}!",
                               users_schema.dump(all_users), 200, "users")
            return response

        if(request.args and request.args.get("course_id")):
            course_id = int(request.args.get("course_id"))
            course = get_course(course_id)
            user_courses = get_user_courses_by_course_id(course_id)

            all_users = []

            for user_course in user_courses:
                user = get_user(user_course.user_id)

                if(request.args.getlist("role_id")):
                    if course.use_tas is False:
                        admin_user = get_user(course.admin_id)
                        all_users.append(admin_user)

                    for role in request.args.getlist("role_id"):
                        if user.role_id is int(role):
                            all_users.append(user)
                else:
                    all_users.append(user)

            createGoodResponse(f"Successfully retrieved all users enrolled in course_id: {course_id}!",
                               users_schema.dump(all_users), 200, "users")
            return response

        all_users = get_users()
        createGoodResponse("Successfully retrieved all users!",
                           users_schema.dump(all_users), 200, "users")
        return response

    except Exception as e:
        createBadResponse("An error occurred retrieving all users!", e, "users")
        return response


@bp.route('/user/<int:user_id>', methods=['GET'])
def getUser(user_id):
    try:
        user = get_user(user_id)
        createGoodResponse(f"Successfully fetched user_id: {user_id}!",
                           user_schema.dump(user), 200, "users")
        return response

    except Exception as e:
        createBadResponse(f"An error occurred fetching user_id: {user_id}!", e, "users")
        return response


@bp.route('/user', methods = ['POST'])
def add_user():
    try:
        if(request.args and request.args.get("course_id")):
            course_id = int(request.args.get("course_id"))
            get_course(course_id)  # Trigger an error if not exists.
            user_exists = user_already_exists(request.json)

            if user_exists is not None:
                user_course_exists = get_user_course_by_user_id_and_course_id(user_exists.user_id, course_id)

                if user_course_exists:
                    print(f"[User_routes /user?course_id=<int:id> POST] User is already enrolled in course_id: {course_id}!")
                    createBadResponse(f"User is already enrolled in course_id: {course_id}!", "", "users")
                    return response

                create_user_course({
                    "user_id": user_exists.user_id,
                    "course_id": course_id,
                    "role_id": request.json["role_id"]
                })

                createGoodResponse(f"Successfully enrolled existing user in course_id: {course_id}",
                                   user_schema.dump(user_exists), 200, "users")
                return response

            else:
                new_user = create_user(request.json)

                create_user_course({
                    "user_id": new_user.user_id,
                    "course_id": course_id,
                    "role_id": request.json["role_id"],
                })

                createGoodResponse(f"Successfully created a new user and enrolled that user in course_id: {course_id}",
                                   user_schema.dump(new_user), 200, "users")
                return response

        new_user = create_user(request.json)
        createGoodResponse("Successfully created a new user!",
                           user_schema.dump(new_user), 201, "users")
        return response

    except Exception as e:
        createBadResponse("An error occurred creating a new user!", e, "users")
        return response


@bp.route('/user/<int:user_id>', methods = ['PUT'])
def updateUser(user_id):
    try:
        user_data = request.json
        user_data["password"] = get_user_password(user_id)
        user = replace_user(user_data, user_id)

        createGoodResponse(f"Successfully replaced user_id: {user_id}!",
                           user_schema.dump(user), 201, "users")
        return response

    except Exception as e:
        createBadResponse(f"An error occurred replacing user_id: {user_id}!", e, "users")
        return response


class UserSchema(ma.Schema):
    class Meta:
        fields = (
            'user_id',
            'first_name',
            'last_name',
            'email',
            'password',
            'role_id',
            'lms_id',
            'consent',
            'owner_id'
        )

user_schema = UserSchema()
users_schema = UserSchema(many=True)

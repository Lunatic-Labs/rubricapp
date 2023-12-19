from flask import jsonify, request, Response
from models.user import *
from models.course import *
from models.user_course import get_user_courses_by_course_id, create_user_course, get_user_course_by_user_id_and_course_id
from models.team import get_team
from models.team_user import get_team_users_by_team_id
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *


@bp.route('/user', methods=['GET'])
def getAllUsers():
    try:
        if (request.args and request.args.get("team_id")):
            team_id = int(request.args.get("team_id"))
            get_team(team_id)  # Trigger an error if not exists.
            team_users = get_team_users_by_team_id(team_id)

            all_users = []

            for team_user in team_users:
                user = get_user(team_user.user_id)
                all_users.append(user)

            return create_good_response(users_schema.dump(all_users), 200, "users")

        if (request.args and request.args.get("course_id")):
            course_id = int(request.args.get("course_id"))
            course = get_course(course_id)
            user_courses = get_user_courses_by_course_id(course_id)

            all_users = []

            for user_course in user_courses:
                user = get_user(user_course.user_id)

                if (request.args.getlist("role_id")):
                    if course.use_tas is False:
                        admin_user = get_user(course.admin_id)
                        all_users.append(admin_user)
                else:
                    for role in request.args.getlist("role_id"):
                        if user.role_id is int(role):
                            all_users.append(user)
                    all_users.append(user)

            return create_good_response(users_schema.dump(all_users), 200, "users")

        all_users = get_users()

        return create_good_response(users_schema.dump(all_users), 200, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all users: {e}", "users")


@bp.route('/user/<int:user_id>', methods=['GET'])
def getUser(user_id):
    try:
        user = get_user(user_id)

        return create_good_response(user_schema.dump(user), 200, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving a user: {e}", "users")


@bp.route('/user', methods=['POST'])
def add_user():
    try:
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
        return create_bad_response(f"An error occurred creating a user: {e}", "users")


@bp.route('/user/<int:user_id>', methods=['PUT'])
def updateUser(user_id):
    try:
        user_data = request.json
        user_data["password"] = get_user_password(user_id)
        user = replace_user(user_data, user_id)

        return create_good_response(user_schema.dump(user), 201, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred replacing a user_id: {e}", "users")


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
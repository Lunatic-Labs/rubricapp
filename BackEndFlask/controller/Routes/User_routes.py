from flask import request
from controller  import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check

from models.role import (
    get_role
)

from models.team import (
    get_team
)

from models.team_user import (
    get_team_users_by_team_id
)

from models.user_course import(
    create_user_course,
    get_user_course_by_user_id_and_course_id,
    set_active_status_of_user_to_inactive,
    replace_role_id_given_user_id_and_course_id
)

from models.course import (
    get_course
)

from models.user import(
    get_users,
    get_user,
    get_user_admins,
    user_already_exists,
    create_user,
    get_user_password,
    replace_user,
    make_admin,
    unmake_admin
)

from models.queries import (
    get_users_by_course_id,
    get_users_by_course_id_and_role_id,
    get_users_by_team_id,
    get_users_not_in_team_id,
    add_user_to_team,
    remove_user_from_team, 
)


@bp.route('/user', methods = ['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_all_users():
    try:
        if(request.args and request.args.get("team_ids")):
            team_ids = request.args.get("team_ids").split(",")

            teams_and_team_members = {}

            for team_id in team_ids:
                get_team(team_id)  # Trigger an error if not exists.

                all_users = []

                for team_user in get_team_users_by_team_id(team_id):
                    all_users.append(get_user(team_user.user_id))

                teams_and_team_members[team_id] = users_schema.dump(all_users)

            return create_good_response(teams_and_team_members, 200, "users")

        if(request.args and request.args.get("isAdmin")):
            return create_good_response(users_schema.dump(get_user_admins()), 200, "users")
        
        if(request.args and request.args.get("course_id") and request.args.get("team_id")):
            team_id = request.args.get("team_id")

            get_team(team_id)  # Trigger an error if not exists.

            course_id = get_team(team_id).course_id if not request.args.get("course_id") else request.args.get("course_id")
            
            # We are going to add users by default!
            # Return users that are not in the team!
            all_users =  get_users_not_in_team_id(course_id, team_id)

            if request.args.get("assign") == True:
                # We are going to remove users!
                # Return users that are in the team!
                all_users = get_users_by_team_id(course_id, team_id)
            
            return create_good_response(users_schema.dump(all_users), 200, "users")
        
        if(request.args and request.args.get("course_id")):
            course_id = request.args.get("course_id")

            get_course(course_id)  # Trigger an error if not exists.

            if(request.args.get("role_id")):
                role_id = request.args.get("role_id")

                get_role(role_id)  # Trigger an error if not exists.

                all_users = get_users_by_course_id_and_role_id(course_id, role_id)
            else:
                all_users = get_users_by_course_id(course_id)

            return create_good_response(users_schema.dump(all_users), 200, "users")

        if(request.args and request.args.get("uid")):
            user_id = request.args.get("uid") # uid instead of user_id since user_id is used by authenication system

            user = get_user(user_id)  # Trigger an error if not exists.

            return create_good_response(user_schema.dump(user), 200, "users")

        all_users = get_users()

        return create_good_response(users_schema.dump(all_users), 200, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all users: {e}", "users", 400)


@bp.route('/user', methods = ['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def add_user():
    try:
        if(request.args and request.args.get("team_id")):
            team_id = request.args.get("team_id")

            course_id = get_team(team_id).course_id  # Trigger an error if not exists.

            user_ids = request.args.get("user_ids").split(",")

            for user_id in user_ids:
                get_user(user_id)  # Trigger an error if not exists.

                add_user_to_team(user_id, team_id, course_id)

            return create_good_response([], 201, "users")

        if(request.args and request.args.get("course_id")):
            course_id = request.args.get("course_id")

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
                    "role_id": request.json["role_id"]
                })

                return create_good_response(user_schema.dump(user_exists), 200, "users")

        new_user = create_user(request.json)

        return create_good_response(user_schema.dump(new_user), 201, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred creating a user: {e}", "users", 400)



@bp.route('/user', methods = ['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def update_user():
    try:
        if(request.args and request.args.get("uid") and request.args.get("course_id")):
            uid = request.args.get("uid")

            get_user(uid)  # Trigger an error if not exists.

            course_id = request.args.get("course_id")

            get_course(course_id)  # Trigger an error if not exists.

            if request.args.get("unenroll_user"):
                set_active_status_of_user_to_inactive(uid, course_id)

                return create_good_response([], 201, "users")

            role_id = request.json["role_id"]

            get_role(role_id)  # Trigger an error if not exists.

            replace_role_id_given_user_id_and_course_id(uid, course_id, role_id)

        if(request.args and request.args.get("team_id")):
            team_id = request.args.get("team_id")

            get_team(team_id)  # Trigger an error if not exists.

            user_ids = request.args.get("user_ids").split(",")

            for user_id in user_ids:
                get_user(user_id)  # Trigger an error if not exists.

                remove_user_from_team(user_id, team_id)

            return create_good_response([], 201, "users")

        user_id = request.args.get("uid")

        get_user(user_id)  # Trigger an error if not exists.

        request.json["password"] = get_user_password(user_id)

        user = replace_user(request.json, user_id)

        if request.json["role_id"] == 3:
            make_admin(user_id)
        else:
            unmake_admin(user_id)

        return create_good_response(user_schema.dump(user), 201, "users")

    except Exception as e:
        return create_bad_response(f"An error occurred replacing a user_id: {e}", "users", 400)


class UserSchema(ma.Schema):
    class Meta:
        fields = (
            'user_id',
            'first_name',
            'last_name',
            'email',
            'team_id',
            'team_name',
            'lms_id',
            'consent',
            'owner_id',
            'active',
            'has_set_password',
            'reset_code',
            'is_admin',
            'role_id'
        )


user_schema = UserSchema()
users_schema = UserSchema(many=True)

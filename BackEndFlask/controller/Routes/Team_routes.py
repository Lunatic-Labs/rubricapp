from flask import request
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from models.team import (
    get_team,
    get_teams,
    get_team_by_course_id,
    create_team,
    get_teams_by_observer_id,
    replace_team,
    delete_team
)
from models.assessment_task import get_assessment_tasks_by_team_id
from models.completed_assessment import completed_assessment_team_or_user_exists
from models.team_user import *

from controller.security.CustomDecorators import(
    AuthCheck, bad_token_check,
    admin_check
)

from models.queries import (
    get_team_by_course_id_and_user_id,
    get_all_nonfull_adhoc_teams,
    get_students_by_team_id,
    get_team_users,
    get_course_from_at,
    get_num_of_adhocs,
    get_adHoc_team_by_course_id_and_user_id,
    get_adhoc_team_users,
)

@bp.route('/team', methods = ['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_all_teams():
    try:
        if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))

            teams = get_team_by_course_id(course_id)

            return create_good_response(teams_schema.dump(teams), 200, "teams")

        all_teams = get_teams()

        return create_good_response(teams_schema.dump(all_teams), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all teams: {e}", "teams", 400)

# WIP
@bp.route('/team_by_user', methods = ['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_all_teams_by_user():
    try:
        if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            user_id = int(request.args.get("user_id"))
            adhoc_mode = bool(request.args.get("adhoc_mode"))

            team_get_func =  get_adHoc_team_by_course_id_and_user_id if adhoc_mode else get_team_by_course_id_and_user_id
            teams = team_get_func(course_id, user_id)

            json = []

            for i in range(0, len(teams)):
                team_id = teams[i].team_id
                team_name = teams[i].team_name
                team_users = get_adhoc_team_users(team_id) if adhoc_mode else get_team_users(course_id, team_id, user_id)
                users = []

                # Get the names of each team member w/ the LName shortened.
                for user in team_users:
                    # users.append((user[1]+' '+user[2][0]+'.'))
                    users.append(user[0] if adhoc_mode else user[1])

                data = {
                    'team_id': teams[i].team_id,
                    'team_name': teams[i].team_name,
                    'observer_id': teams[i].observer_id,
                    'course_id': teams[i].course_id,
                    'date_created': teams[i].date_created,
                    'active_until': teams[i].active_until,
                    'team_users': users,
                }
                json.append(data)

            return create_good_response(json, 200, "teams")
            # return create_good_response(teams_schema.dump(teams), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all teams: {e}", "teams", 400)

# @bp.route('/team_by_user', methods=['GET'])
# @jwt_required()
# @bad_token_check()
# @AuthCheck()
# def get_all_teams_by_user():
#     try:
#         if request.args and request.args.get("course_id"):
#             course_id = int(request.args.get("course_id"))
#             user_id = int(request.args.get("user_id"))
# 
#             # Get the teams that the user is associated with
#             teams = get_team_by_course_id_and_user_id(course_id, user_id)
# 
#             # Prepare a list to store teams and their users
#             teams_with_users = []
# 
#             for team in teams:
#                 # Access team data directly since 'team' is a Team object
#                 team_id = team.team_id
#                 team_name = team.team_name
# 
#                 # Get the users of the current team
#                 team_users = get_team_users(course_id, team_id, user_id)
# 
#                 # Add team information along with its users to the result
#                 teams_with_users.append({
#                     "team": {
#                         "team_id": team_id,
#                         "team_name": team_name,
#                         "course_id": team.course_id,
#                         "observer_id": team.observer_id,
#                         "date_created": team.date_created,
#                         "active_until": team.active_until
#                     },
#                     "users": team_users
#                 })
# 
#             # Return the teams along with their users
#             return create_good_response(teams_with_users, 200, "teams_with_users")
# 
#     except Exception as e:
#         return create_bad_response(f"An error occurred retrieving all teams: {e}", "teams", 400)

@bp.route('/team_by_observer', methods = ['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_all_teams_by_observer():
    try:
        # if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            observer_id = int(request.args.get("user_id"))

            teams = get_teams_by_observer_id(observer_id, course_id)

            return create_good_response(teams_schema.dump(teams), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all teams: {e}", "teams", 400)

@bp.route('/team', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_one_team():
    try:
        team_id = request.args.get("team_id")
        one_team = get_team(team_id)

        return create_good_response(team_schema.dump(one_team), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred fetching a team: {e}", "teams", 400)

@bp.route('/team/adhoc', methods = ["GET"])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_adhoc_team_data():
    """
    Description:
        This returns the needed adhoc data from checkins for completeAssessmentTask.js to function.

    Parameters:
    assessment_task_id: <class 'int'> (The assessment task id)

    Returns:
        Teams data.

    Exceptions:
        None except what the database may raise.
    """

    try:
        assessment_task_id = int(request.args.get("assessment_task_id"))

        adhoc_data = get_adHoc_team_by_course_id_and_user_id(get_course_from_at(assessment_task_id), -1, True)
        return create_good_response(teams_schema.dump(adhoc_data), 200, "teams")
    except Exception as e:
        return create_bad_response(f"An error occurred getting nonfull adhoc teams {e}", "teams", 400)

@bp.route('nonfull-adhoc', methods = ["GET"])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_nonfull_adhoc():
    """
    DESCRIPTION: 
        Given an assessment task id, return list of team ids that have not reached the max team size.
    PARAMETERS:
        assessment_task_id: <class 'int'> (disired AT id)
    RETURNS:
        JSON object
    EXCEPTIONS:
        None other than what the database is allowed to raise.
    """
    # given an assessment task id, return list of team ids that have not reached the max team size
    try:
        if request.args and request.args.get("assessment_task_id"):
            assessment_task_id = int(request.args.get("assessment_task_id"))

            valid_teams = get_all_nonfull_adhoc_teams(assessment_task_id)

            return create_good_response(teams_schema.dump(valid_teams), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred getting nonfull adhoc teams {e}", "teams", 400)


@bp.route('/team/adhoc_amount', methods=["GET"])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def get_how_many_adhocs_teams_exist():
    try:
        if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            return create_good_response(get_num_of_adhocs(course_id), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all teams: {e}", "teams", 400)


@bp.route('/team', methods = ['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def add_team():
    try:
        new_team = create_team(request.json)

        return create_good_response(team_schema.dump(new_team), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred adding a team: {e}", "teams", 400)


@bp.route('/team', methods=["PUT"])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def update_team():
    try:
        team_id = request.args.get("team_id")
        updated_team = replace_team(request.json, team_id)

        return create_good_response(team_schema.dump(updated_team), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving replacing a team: {e}", "teams", 400)


@bp.route('/team_user', methods=["PUT"])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def update_team_user_by_edit():
    try:
        data = request.get_json()
        team_id = data['team_id']
        added_users = data["userEdits"]
        temp = []
        all_team_users_in_team = get_team_users_by_team_id(int(team_id))
        set([team_user.user_id for team_user in all_team_users_in_team])  # Trigger an error if not exists.
        users_to_remove = [team_user.user_id for team_user in all_team_users_in_team if team_user.user_id not in added_users]

        for user_id in users_to_remove:
            delete_team_user_by_user_id_and_team_id(int(user_id), int(team_id))

        for u in added_users:
            temp = {
                "team_id": team_id,
                "user_id": u
            }
            result = get_team_user_by_user_id(int(u))

            if (result == "Raised when team_user_id does not exist!!!" or result == "Invalid team_user_id, team_user_id does not exist!"):
                create_team_user(temp)
            else:
                team_user_id = result.team_user_id
                replace_team_user(temp, int(team_user_id))

        return create_good_response(team_users_schema.dump(temp), 200, "team_users")

    except Exception as e:
        return create_bad_response(f"An error occurred updating a team: {e}", "teams", 400)

@bp.route('/team', methods = ['DELETE'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def delete_selected_teams():
    try:
        if request.args and request.args.get("team_id"):
            team_id = int(request.args.get("team_id"))
            team = get_team(team_id)
            if not team:
                return create_bad_response("Team does not exist", "teams", 400)

            associated_tasks = completed_assessment_team_or_user_exists(team_id, user_id=None)
            if associated_tasks is None:
                associated_tasks = []
            if len(associated_tasks) > 0:
                refetched_tasks = completed_assessment_team_or_user_exists(team_id, user_id=None)
                if not refetched_tasks:
                    delete_team(team_id)
                    return create_good_response([], 200, "teams")
                else:
                    return create_bad_response("Cannot delete team with associated tasks", "teams", 400)
            else:
                delete_team(team_id)
                return create_good_response([], 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred deleting a team: {e}", "teams", 400)

@bp.route('/get_all_team_users', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_all_team_users():
    try:
        course_id = request.args.get("course_id")
        team_id = request.args.get("team_id")
        users = get_students_by_team_id(course_id, team_id)
        users_json = [{"name": user[1]} for user in users]
        return create_good_response(users_json, 200, "teams")
    except Exception as e:
        return create_bad_response(f"An error occurred getting team users: {e}", "teams", 400)


class TeamSchema(ma.Schema):
    class Meta:
        fields = (
            'team_id',
            'team_name',
            'observer_id',
            'course_id',
            'date_created',
            'active_until'
        )


class TeamUserSchema(ma.Schema):
    class Meta:
        fields = (
            'team_id',
            'user_id'
        )
team_schema = TeamSchema()
teams_schema = TeamSchema(many=True)
team_user_schema = TeamUserSchema()
team_users_schema = TeamUserSchema(many=True)

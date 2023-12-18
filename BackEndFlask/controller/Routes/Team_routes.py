from flask import jsonify, request, Response
from models.team import *
from models.team_user import *
from models.course import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *


@bp.route('/team', methods=['GET'])
def get_all_teams():
    try:
        if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            teams = get_team_by_course_id(course_id)

            return create_good_response(teams_schema.dump(teams), 200, "teams")

        all_teams = get_teams()

        return create_good_response(teams_schema.dump(all_teams), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all teams: {e}", "teams")


@bp.route('/team/<int:team_id>', methods=['GET'])
def get_one_team(team_id):
    try:
        one_team = get_team(team_id)

        return create_good_response(team_schema.dump(one_team), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred fetching a team: {e}", "teams")


@bp.route('/team', methods=['POST'])
def add_team():
    try:
        new_team = create_team(request.json)

        return create_good_response(team_schema.dump(new_team), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred adding a team: {e}", "teams")


@bp.route('/team/<int:team_id>', methods=["PUT"])
def update_team(team_id):
    try:
        updated_team = replace_team(request.json, team_id)

        return create_good_response(team_schema.dump(updated_team), 200, "teams")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving replacing a team: {e}", "teams")


@bp.route('/team_user', methods=["PUT"])
def update_team_user_by_edit():
    data = request.get_json()
    team_id = data['team_id']
    addedUsers = data["userEdits"]
    temp = []
    try:
        all_team_users_in_team = get_team_users_by_team_id(int(team_id))
        set([team_user.user_id for team_user in all_team_users_in_team])  # Trigger an error if not exists.
        users_to_remove = [team_user.user_id for team_user in all_team_users_in_team if team_user.user_id not in addedUsers]
        for user_id in users_to_remove:
            delete_team_user_by_user_id_and_team_id(int(user_id), int(team_id))
        for u in addedUsers:
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
        return create_bad_response(f"An error occurred updating a team: {e}", "teams")


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

from flask import jsonify, request, Response
from models.user import *
from models.team import *
from models.team_user import *
from models.course import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/team', methods = ['GET'])
def get_all_teams():
    if request.args and request.args.get("course_id"):
        course_id = int(request.args.get("course_id"))
        teams = get_team_by_course_id(course_id)
        if type(teams)==type(""):
            print(f"[Team_routes /team?course_id=<int:course_id> GET] An error occurred retrieving all teams enrolled in course_id: {course_id}, ", teams)
            createBadResponse(f"An error occurred retrieving all teams enrolled in course_id: {course_id}!", teams, "teams")
            return response
        print(f"[Team_routes /team?course_id=<int:course_id> GET] Successfully retrieved all teams enrolled in course_id: {course_id}!")
        createGoodResponse(f"Successfully retrieved all teams enrolled in course_id: {course_id}!", teams_schema.dump(teams), 200, "teams")
        return response
    all_teams = get_teams()
    if type(all_teams)==type(""):
        print("[Team_routes /team GET] An error occurred retrieving all teams, ", all_teams)
        createBadResponse("An error occurred retrieving all teams!", all_teams, "teams")
        return response
    print("[Team_routes /team GET] Successfully retrieved all teams!")
    createGoodResponse("Successfully retrieved all teams!", teams_schema.dump(all_teams), 200, "teams")
    return response

@bp.route('/team/<int:team_id>', methods = ['GET'])
def get_one_team(team_id):
    one_team = get_team(team_id)
    if type(one_team)==type(""):
        print(f"[Team_routes /team/<int:team_id> GET] An error occurred fetching team_id: {team_id}, ", one_team)
        createBadResponse(f"An error occurred fetching team_id: {team_id}!", one_team, "teams")
        return response
    print(f"[Team_routes /team/<int:team_id> GET] Successfully retrieved team_id: {team_id}!")
    createGoodResponse(f"Successfully retrieved team_id: {team_id}!", team_schema.dump(one_team), 200, "teams")
    return response

@bp.route('/team', methods = ['POST'])
def add_team():
    new_team = create_team(request.json)
    if type(new_team)==type(""):
        print("[Team_routes /team POST] An error occurred adding a team, ", new_team)
        createBadResponse("An error occurred adding a team!", new_team, "teams")
        return response
    print("[Team_routes /team POST] Successfully added a team!")
    createGoodResponse("Successfully added a team!", team_schema.dump(new_team), 200, "teams")
    return response

@bp.route('/team/<int:team_id>', methods = ["PUT"])
def update_team(team_id):
    updated_team = replace_team(request.json, team_id)
    if type(updated_team)==type(""):
        print(f"[Team_routes /team/<int:team_id> PUT] An error occurred replacing team_id: {team_id}, ", updated_team)
        createBadResponse("An error occurred replacing a team!", updated_team, "teams")
        return response
    print(f"[Team_routes /team/<int:team_id> PUT] Successfully replaced team_id: {team_id}!")
    createGoodResponse(f"Successfully replaced team_id: {team_id}!", team_schema.dump(updated_team), 200, "teams")
    return response

@bp.route('/team_user', methods=["PUT"])
def update_team_user_by_edit():
    data = request.get_json()
    team_id = data['team_id']
    addedUsers = data["userEdits"]
    temp = []
    try:
        all_team_users_in_team = get_team_users_by_team_id(int(team_id))
        existing_user_ids = set([team_user.user_id for team_user in all_team_users_in_team])
        users_to_remove = [team_user.user_id for team_user in all_team_users_in_team if team_user.user_id not in addedUsers]
        for user_id in users_to_remove:
            delete_team_user_by_user_id_and_team_id(int(user_id), int(team_id))
        for u in addedUsers:
            temp = {
                "team_id": team_id,
                "user_id": u
            }
            result = get_team_user_by_user_id(int(u))
            if(result ==  "Raised when team_user_id does not exist!!!" or result == "Invalid team_user_id, team_user_id does not exist!"):
                create_team_user(temp)
            elif(type(result)==type("")):
                createBadResponse("An error occurred updating a team!", str(result), "teams")
                return response
            else:
                team_user_id = result.team_user_id
                replace_team_user(temp,int(team_user_id))
        createGoodResponse(f"Successfully updated added/removed team users", team_users_schema.dump(temp), 200, "team_users")
        return response
    except Exception as e:
        createBadResponse("An error occurred updating a team!", e, "teams")
        return response


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
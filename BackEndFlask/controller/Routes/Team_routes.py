from flask import jsonify, request, Response
from flask_login import login_required
from models.team import *
from models.team_user import *
from controller import bp
from flask_marshmallow import Marshmallow

ma = Marshmallow()

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage):
    JSON = {"teams": []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, entire_teams, status):
    JSON = {"teams": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["teams"].append(entire_teams)
    response["content"] = JSON
    JSON = {"teams": []}

@bp.route('/team', methods = ['GET'])
def get_all_teams():
    all_teams = get_teams()
    if type(all_teams)==type(""):
        print("[Team_routes /team GET] An error occurred retrieving all teams!", all_teams)
        createBadResponse("An error occurred retrieving all teams!", all_teams)
        return response
    results = teams_schema.dump(all_teams)
    print("[Team_routes /team GET] Successfully retrieved all teams!")
    createGoodResponse("Successfully retrieved all teams!", results, 200)
    return response


@bp.route('/team/<int:id>', methods = ['GET'])
def get_one_team(id):
    one_team = get_team(id)
    if type(one_team)==type(""):
        print(f"[Team_routes /team/<int:id> GET] An error occurred fetching team_id: {id}!", one_team)
        createBadResponse(f"An error occurred fetching team_id: {id}!", one_team)
        return response
    results = team_schema.dump(one_team)
    print(f"[Team_routes /team/<int:id> GET] Successfully retrieved team_id: {id}!")
    createGoodResponse(f"Successfully retrieved team_id: {id}!", results, 200)
    return response

@bp.route('/team', methods = ['POST'])
def adds_team():
    new_team = create_team(request.json)
    if type(new_team)==type(""):
        print("[Team_routes /team POST] An error occurred adding a team!", new_team)
        createBadResponse("An error occurred adding a team!", new_team)
        return response
    results = team_schema.dump(new_team)
    print("[Team_routes /team POST] Successfully added a team!")
    createGoodResponse("Successfully added a team!", results, 200)
    return response

@bp.route('/team/<int:id>', methods = ["PUT"])
def update_team(id):
    updated_team = replace_team(request.json,id)
    if type(updated_team)==type(""):
        print("[Team_routes /team/<int:id> PUT] An error occurred udpating a team!", updated_team)
        createBadResponse("An error occurred updating a team!", updated_team)
        return response
    results = team_schema.dump(updated_team)
    print("[Team_routes /team/<int:id> PUT] Successfully updated a team!")
    createGoodResponse("Successfully updated a team!", results, 200)
    return response


@bp.route('/team/user', methods = ["GET"])
def get_all_team_users():
    all_team_users = get_team_users()
    if type(all_team_users)==type(""):
        print("[Team_user_routes /team/user GET] An error occurred retrieving all team members!", all_team_users)
        createBadResponse("An error occurred retrieving all team members!", all_team_users)
        return response
    results = team_users_schema.dump(all_team_users)
    print("[Team_user_routes /team/user GET] Successfully retrieved all team members!")
    createGoodResponse("Successfully retrieved all team members!", results, 200)
    return response

@bp.route('/team/user/<int:id>', methods = ['GET'])
def get_one_team_user(id):
    one_team_user = get_team_user(id)
    if type(one_team_user)==type(""):
        print(f"[Team_user_routes /team/user/<int:id> GET] An error occurred fetching tu_id: {id}!", one_team_user)
        createBadResponse(f"An error occurred fetching tu_id: {id}!", one_team_user)
        return response
    results = team_user_schema.dump(one_team_user)
    print(f"[Team_user_routes /team/user/<int:id> GET] Successfully fetched tu_id: {id}!")
    createGoodResponse(f"Successfully retrieved tu_id: {id}!", results, 200)
    return response

@bp.route('/team-member/<int:id>', methods = ['GET'])
def get_all_team_members(id):
    all_team_members = get_team_members(id)
    if type(all_team_members)==type(""):
        print(f"[Team_member_routes /team-members/<int:id> GET] An error occurred retrieving all team members from tu_id: {id}!", all_team_members)
        createBadResponse(f"An error occurred retrieving all team members from tu_id: {id}!", all_team_members)
        return response
    results = team_users_schema.dump(all_team_members)
    print(f"[Team_member_routes /team-members/<int:id> GET] Successfully retrieved all team members from tu_id: {id}!")
    createGoodResponse(f"Successfully retrieved all team members from tu_id: {id}!", results, 200)
    return response

@bp.route('/team/user', methods = ['POST'])
def add_team_user():
    add_team_users = create_team_user(request.json)
    if type(add_team_users)==type(""):
        print("[Team_user_routes /team/user POST] An error occurred adding a team_user!", add_team_users)
        createBadResponse("An error occurred adding a team_user!", add_team_users)
        return response
    results = team_user_schema.dump(add_team_users)
    print("[Team_user_routes /team/user POST] Successfully added a team_user!")
    createGoodResponse("Successfully added a team_user!", results, 200)
    return response

@bp.route('/team/user/<int:id>', methods = ['PUT'])
def update_team_user(id):
    updated_team_user = replace_team_user(request.json,id)
    if type(updated_team_user)==type(""):
        print(f"[Team_user_routes /team/user POST] An error occurred updating tu_id: {id}!", updated_team_user)
        createBadResponse(f"An error occurred updating tu_id: {id}!", updated_team_user)
        return response
    results = team_user_schema.dump(updated_team_user)
    print(f"[Team_user_routes /team/user/<int:id> POST] Successfully updated tu_id: {id}!")
    createGoodResponse(f"Successfully updated tu_id: {id}!", results, 200)
    return response

class TeamSchema(ma.Schema):
    class Meta:
        fields = ('team_id','team_name', 'observer_id', 'date')

class TeamUserSchema(ma.Schema):
    class Meta:
        fields = ('tu_id', 'team_id', 'user_id')

team_schema = TeamSchema()
teams_schema = TeamSchema(many=True)
team_user_schema = TeamUserSchema()
team_users_schema = TeamUserSchema(many=True)
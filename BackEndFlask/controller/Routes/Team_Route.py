from flask import jsonify, request, Response
from flask_login import login_required
from models.team import *
from models.team_user import *
from controller import bp
from flask_marshmallow import Marshmallow

ma = Marshmallow()
mac = Marshmallow()

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
        print("[Team_routes /team GET] An error occurred fetching all team!", all_teams)
        createBadResponse("An error occured fetching all teams!", all_teams)
        return response
    results = teams_schema.dump(all_teams)
    print("[Team_routes /team GET] Successfully retrieved all teams!")
    createGoodResponse("Successfully retrieved all teams!", results, 200)
    return response


@bp.route('/team/<id>', methods = ['GET'])
def get_one_team(id):
    all_teams = get_team(id)
    if type(all_teams)==type(""):
        print("[Team_routes /team/<id> GET] An error occurred fetching team!", all_teams)
        createBadResponse("An error occured fetching a team!", all_teams)
        return response
    results = team_schema.dump(all_teams)
    print("[Team_routes /team/<id> GET] Successfully retrieved a team!")
    createGoodResponse("Successfully retrieved a team!", results, 200)
    return response

@bp.route('/team', methods = ['POST'])
def adds_team():
    all_teams = create_team(request.json)
    if type(all_teams)==type(""):
        print("[Team_routes /team POST] An error occurred adding a team!", all_teams)
        createBadResponse("An error occured adding a team!", all_teams)
        return response
    results = team_schema.dump(all_teams)
    print("[Team_routes /team POST] Successfully added a team!")
    createGoodResponse("Successfully added a team!", results, 200)
    return response

@bp.route('/team/<int:id>', methods = ["PUT"])
def update_team(id):
    all_teams = replace_team(request.json,id)
    if type(all_teams)==type(""):
        print("[Team_routes /team PUT] An error occurred udpating a team!", all_teams)
        createBadResponse("An error occured updating a team!", all_teams)
        return response
    results = team_schema.dump(all_teams)
    print("[Team_routes /team PUT] Successfully updated a team!")
    createGoodResponse("Successfully updated a team!", results, 200)
    return response


@bp.route('/team_user', methods = ["GET"])
def get_all_team_users():
    all_team_users = get_team_users()
    if type(all_team_users)==type(""):
        print("[Team_routes /team PUT] An error occurred retrieved all team members!", all_team_users)
        createBadResponse("An error occured retrieved all team members!", all_team_users)
        return response
    results = team_users_schema.dump(all_team_users)
    print("[Team_routes /team GET] Successfully retrieved all team members!")
    createGoodResponse("Successfully retrieved all team members!", results, 200)
    return response

@bp.route('/team_user/<int:id>', methods = ['GET'])
def get_one_team_user(id):
    all_team_users = get_team_user(id)
    if type(all_team_users)==type(""):
        print("[Team_routes /team/<id> GET] An error occurred fetching team user!", all_team_users)
        createBadResponse("An error occured fetching a team user!", all_team_users)
        return response
    results = team_user_schema.dump(all_team_users)
    print("[Team_routes /team/<id> GET] Successfully retrieved a team user!")
    createGoodResponse("Successfully retrieved a team user!", results, 200)
    return response

@bp.route('/team_user', methods = ['POST'])
def adds_team_user():
    all_team_users = create_team_user(request.json)
    if type(all_team_users)==type(""):
        print("[Team_routes /team POST] An error occurred adding a team!", all_team_users)
        createBadResponse("An error occured adding a team!", all_team_users)
        return response
    results = team_user_schema.dump(all_team_users)
    print("[Team_routes /team POST] Successfully added a team!")
    createGoodResponse("Successfully added a team!", results, 200)
    return response

@bp.route('/team_user/<int:id>', methods = ['PUT'])
def update_team_user(id):
    all_team_users = replace_team_user(request.json,id)
    if type(all_team_users)==type(""):
        print("[Team_routes /team POST] An error occurred updating a team!", all_team_users)
        createBadResponse("An error occured updating a team!", all_team_users)
        return response
    results = team_user_schema.dump(all_team_users)
    print("[Team_routes /team POST] Successfully updated a team!")
    createGoodResponse("Successfully updated a team!", results, 200)
    return response

class TeamSchema(ma.Schema):
    class Meta:
        fields = ('team_id','team_name', 'observer_id', 'date')

class TeamUserSchema(mac.Schema):
    class Meta:
        fields = ('tu_id', 'team_id', 'user_id')

team_schema = TeamSchema()
teams_schema = TeamSchema(many=True)
team_user_schema = TeamUserSchema()
team_users_schema = TeamUserSchema(many=True)
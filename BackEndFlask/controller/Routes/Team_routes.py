from flask import jsonify, request, Response
from flask_login import login_required
from models.team import *
from models.team_user import *
from models.course import *
from models.team_course import get_team_courses_by_course_id, create_team_course
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/team', methods = ['GET'])
def get_all_teams():
    if request.args and request.args.get("course_id"):
        course_id = int(request.args.get("course_id"))
        team_courses = get_team_courses_by_course_id(course_id)
        if type(team_courses)==type(""):
            print(f"[Team_routes /team?course_id=<int:course_id> GET] An error occurred retrieving all teams enrolled in course_id: {course_id}, ", team_courses)
            createBadResponse(f"An error occurred retrieving all teams enrolled in course_id: {course_id}!", team_courses, "teams")
            return response
        all_teams = []
        for team_course in team_courses:
            team = get_team(team_course.team_id)
            if type(team)==type(""):
                print(f"[Team_routes /team?course_id=<int:course_id> GET] An error occurred retrieving all teams enrolled in course_id: {course_id}, ", team)
                createBadResponse(f"An error occurred retrieving all teams enrolled in course_id: {course_id}!", team, "teams")
                return response
            all_teams.append(team)
        print(f"[Team_routes /team?course_id=<int:course_id> GET] Successfully retrieved all teams enrolled in course_id: {course_id}!")
        createGoodResponse(f"Successfully retrieved all teams enrolled in course_id: {course_id}!", teams_schema.dump(all_teams), 200, "teams")
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
    if request.args and request.args.get("course_id"):
        course_id = int(request.args.get("course_id"))
        course = get_course(course_id)
        if type(course)==type(""):
            print(f"[Team_routes /team?course_id=<int:course_id> POST] An error occurred retrieving course_id: {course_id}, ", course)
            createBadResponse(f"An error occurred retrieving course_id: {course_id}!", course, "teams")
            return response
        new_team = create_team(request.json)
        if type(new_team)==type(""):
            print("[Team_routes /team?course_id=<int:course_id> POST] An error occurred creating a new team: ", new_team)
            createBadResponse(f"An error occurred creating a new team!", new_team, "teams")
            return response
        team_course = create_team_course({
            "team_id": new_team.team_id,
            "course_id": course_id
        })
        if type(team_course)==type(""):
            print(f"[Team_routes /team?course_id=<int:course_id> POST] An error occurred enrolling newly created team in course_id: {course_id}, ", team_course)
            createBadResponse(f"An error occurred enrolling newly created team in course_id: {course_id}!", team_course, "teams")
            return response
        print(f"[Team_routes /team?course_id=<int:course_id> POST] Successfully created a new team an enrolled that team in course_id: {course_id}!")
        createGoodResponse(f"Successfully created a new team and enrolled that team in course_id: {course_id}!", team_schema.dump(new_team), 200, "teams")
        return response
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
        print(f"[Team_routes /team/<int:team_id> PUT] An error occurred udpating team_id: {team_id}, ", updated_team)
        createBadResponse("An error occurred updating a team!", updated_team, "teams")
        return response
    print("[Team_routes /team/<int:team_id> PUT] Successfully updated a team!")
    createGoodResponse("Successfully updated a team!", team_schema.dump(updated_team), 200, "teams")
    return response

# @bp.route('/team/user', methods = ["GET"])
# def get_all_team_users():
#     all_team_users = get_team_users()
#     if type(all_team_users)==type(""):
#         print("[Team_user_routes /team/user GET] An error occurred retrieving all team members!", all_team_users)
#         createBadResponse("An error occurred retrieving all team members!", all_team_users, "teams")
#         return response
#     results = team_users_schema.dump(all_team_users)
#     print("[Team_user_routes /team/user GET] Successfully retrieved all team members!")
#     createGoodResponse("Successfully retrieved all team members!", results, 200, "teams")
#     return response

# @bp.route('/team/user/<int:id>', methods = ['GET'])
# def get_one_team_user(id):
#     one_team_user = get_team_user(id)
#     if type(one_team_user)==type(""):
#         print(f"[Team_user_routes /team/user/<int:id> GET] An error occurred fetching team_user_id: {id}!", one_team_user)
#         createBadResponse(f"An error occurred fetching team_user_id: {id}!", one_team_user, "teams")
#         return response
#     results = team_user_schema.dump(one_team_user)
#     print(f"[Team_user_routes /team/user/<int:id> GET] Successfully fetched team_user_id: {id}!")
#     createGoodResponse(f"Successfully retrieved team_user_id: {id}!", results, 200, "teams")
#     return response

# @bp.route('/team-member/<int:id>', methods = ['GET'])
# def get_all_team_members(id):
#     all_team_members = get_team_members(id)
#     if type(all_team_members)==type(""):
#         print(f"[Team_member_routes /team-members/<int:id> GET] An error occurred retrieving all team members from team_user_id: {id}!", all_team_members)
#         createBadResponse(f"An error occurred retrieving all team members from team_user_id: {id}!", all_team_members, "teams")
#         return response
#     results = team_users_schema.dump(all_team_members)
#     print(f"[Team_member_routes /team-members/<int:id> GET] Successfully retrieved all team members from team_user_id: {id}!")
#     createGoodResponse(f"Successfully retrieved all team members from team_user_id: {id}!", results, 200, "teams")
#     return response

# @bp.route('/team/user', methods = ['POST'])
# def add_team_user():
#     add_team_users = create_team_user(request.json)
#     if type(add_team_users)==type(""):
#         print("[Team_user_routes /team/user POST] An error occurred adding a team_user!", add_team_users)
#         createBadResponse("An error occurred adding a team_user!", add_team_users, "teams")
#         return response
#     results = team_user_schema.dump(add_team_users)
#     print("[Team_user_routes /team/user POST] Successfully added a team_user!")
#     createGoodResponse("Successfully added a team_user!", results, 200, "teams")
#     return response

# @bp.route('/team/user/<int:id>', methods = ['PUT'])
# def update_team_user(id):
#     updated_team_user = replace_team_user(request.json,id)
#     if type(updated_team_user)==type(""):
#         print(f"[Team_user_routes /team/user POST] An error occurred updating team_user_id: {id}!", updated_team_user)
#         createBadResponse(f"An error occurred updating team_user_id: {id}!", updated_team_user, "teams")
#         return response
#     results = team_user_schema.dump(updated_team_user)
#     print(f"[Team_user_routes /team/user/<int:id> POST] Successfully updated team_user_id: {id}!")
#     createGoodResponse(f"Successfully updated team_user_id: {id}!", results, 200, "teams")
#     return response

class TeamSchema(ma.Schema):
    class Meta:
        fields = (
            'team_id',
            'team_name',
            'observer_id',
            'date_created'
        )

# class TeamUserSchema(ma.Schema):
#     class Meta:
#         fields = (
#             'team_user_id',
#             'team_id',
#             'user_id'
#         )

team_schema = TeamSchema()
teams_schema = TeamSchema(many=True)
# team_user_schema = TeamUserSchema()
# team_users_schema = TeamUserSchema(many=True)
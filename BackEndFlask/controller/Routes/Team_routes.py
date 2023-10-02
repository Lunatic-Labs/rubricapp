from flask import request
from controller import bp
from controller.Route_response import *
from models.course import get_course
from flask_jwt_extended import jwt_required
from models.team   import get_team, get_teams, create_team, replace_team
from controller.security.customDecorators import AuthCheck, badTokenCheck
from models.team_course import get_team_courses_by_course_id, create_team_course

@bp.route('/team', methods = ['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
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
@jwt_required()
@badTokenCheck()
@AuthCheck()
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
@jwt_required()
@badTokenCheck()
@AuthCheck()
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
@jwt_required()
@badTokenCheck()
@AuthCheck()
def update_team(team_id):
    updated_team = replace_team(request.json, team_id)
    if type(updated_team)==type(""):
        print(f"[Team_routes /team/<int:team_id> PUT] An error occurred replacing team_id: {team_id}, ", updated_team)
        createBadResponse("An error occurred replacing a team!", updated_team, "teams")
        return response
    print(f"[Team_routes /team/<int:team_id> PUT] Successfully replaced team_id: {team_id}!")
    createGoodResponse(f"Successfully replaced team_id: {team_id}!", team_schema.dump(updated_team), 200, "teams")
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
            'date_created'
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
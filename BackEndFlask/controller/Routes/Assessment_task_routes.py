from flask import jsonify, request, Response
from flask_login import login_required
from flask_sqlalchemy import *
from models.assessment_task import *
from models.course import get_course
from models.user import get_user
from models.user_course import get_user_courses_by_user_id
from models.team import get_team
from models.role import get_role
from models.team_assessment_task import get_team_assessment_tasks_by_team_id
from models.schemas import *
from controller import bp
from flask_marshmallow import Marshmallow
from sqlalchemy import *
from controller.Route_response import *

# /assessment_task GET retrieves all assessment tasks
    # Supported individual filters:
        # /assessment_task?user_id=###
        # /assessment_task?course_id=###
        # /assessment_task?role_id=###
        # /assessment_task?team_id=###
@bp.route('/assessment_task', methods = ['GET'])
def get_all_assessment_tasks():
    if(request.args and request.args.get("user_id")):
        user_id = int(request.args.get("user_id"))
        user = get_user(user_id)
        if type(user)==type(""):
            print(f"[Assessment_task_routes /assessment_task?user_id=<int:user_id> GET] An error occurred retrieving user_id: {user_id}, ", user)
            createBadResponse(f"An error occurred retrieving user_id: {user_id}!", user, "assessment_tasks")
            return response
        user_courses = get_user_courses_by_user_id(user_id)
        if type(user_courses)==type(""):
            print(f"[Assessment_task_routes /assessment_task?user_id=<int:user_id> GET] An error occurred retrieving all assessment_tasks assigned to user_id: {user_id}, ", user_courses)
            createBadResponse(f"An error occurred retrieving all assessment_tasks assigned to user_id: {user_id}!", user_courses, "assessment_tasks")
            return response
        all_assessment_tasks = []
        for user_course in user_courses:
            assessment_tasks = get_assessment_tasks_by_course_id(user_course.course_id)
            if type(assessment_tasks)==type(""):
                print(f"[Assessment_task_routes /assessment_task?user_id=<int:user_id> GET] An error occurred retrieving all assessment_tasks assigned to user_id: {user_id}, ", assessment_tasks)
                createBadResponse(f"An error occurred retrieving all assessment_tasks assigned to user_id: {user_id}!", assessment_tasks, "assessment_tasks")
                return response
            for assessment_task in assessment_tasks:
                all_assessment_tasks.append(assessment_task)
        print(f"[Assessment_task_routes /assessment_task?user_id=<int:user_id> GET] Successfully retrieved all assessment_tasks assigned to user_id: {user_id}!")
        createGoodResponse(f"Successfully retrieved all assessment_tasks assigned to user_id: {user_id}!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
        return response
    if(request.args and request.args.get("course_id")):
        course_id = int(request.args.get("course_id"))
        course = get_course(course_id)
        if type(course)==type(""):
            print(f"[Assessment_task_routes /assessment_task?course_id=<int:course_id> GET] An error occurred retrieving all assessment_tasks enrolled in course_id: {course_id}, ", course)
            createBadResponse(f"An error occurred retrieving course_id: {course_id}!", course, "assessment_tasks")
            return response
        all_assessment_tasks = get_assessment_tasks_by_course_id(course_id)
        if type(all_assessment_tasks) == type(""):
            print(f"[Assessment_task_routes /assessment_task?course_id=<int:course_id> GET] An error occurred retrieving all assessment tasks enrolled in course_id: {course_id}, ", all_assessment_tasks)
            createBadResponse(f"An error occurred retrieving all assessment tasks enrolled in course_id: {course_id}!", all_assessment_tasks, "assessment_tasks")
            return response
        print(f"[Assessment_task_routes /assessment_task?course_id=<int:course_id> GET] Successfully retrived all assessment tasks enrolled in course_id: {course_id}!")
        createGoodResponse(f"Successfully retrived all assessment tasks enrolled in course_id: {course_id}!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
        return response
    if(request.args and request.args.get("role_id")):
        role_id = int(request.args.get("role_id"))
        role = get_role(role_id)
        if type(role)==type(""):
            print(f"[Assessment_task_routes /assessment_task?role_id=<int:role_id> GET] An error occurred retrieving role_id: {role_id}, ", role)
            createBadResponse(f"An error occurred retrieving role_id: {role_id}!", role, "assessment_tasks")
            return response
        all_assessment_tasks = get_assessment_tasks_by_role_id(role_id)
        if type(all_assessment_tasks)==type(""):
            print(f"[Assessment_task_routes /assessment_task?role_id=<int:role_id> GET] An error occurred retriveing all assessment tasks assigned to role_id: {role_id}, ", all_assessment_tasks)
            createBadResponse(f"An error occurred retriveing all assessment_tasks assigned to role_id: {role_id}!", all_assessment_tasks, "assessment_tasks")
            return response
        print(f"[Assessment_task_routes /assessment_task?role_id=<int:role_id> GET] Successfully retrieved all assessment tasks assigned to role_id: {role_id}!")
        createGoodResponse(f"Successfully retrieved all assessment tasks assigned to role_id: {role_id}!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
        return response
    if(request.args and request.args.get("team_id")):
        team_id = int(request.args.get("team_id"))
        team = get_team(team_id)
        if type(team)==type(""):
            print(f"[Assessment_task_routes /assessment_task?team_id=<int:team_id> GET] An error occurred retrieving team_id: {team_id}, ", team)
            createBadResponse(f"An error occurred retrieving team_id: {team_id}!", team, "assessment_tasks")
            return response
        team_assessment_tasks = get_team_assessment_tasks_by_team_id(team_id)
        if type(team_assessment_tasks)==type(""):
            print(f"[Assessment_task_routes /assessment_task?team_id=<int:team_id> GET] An error occurred retrieving all assessment tasks assigned to team_id: {team_id}, ", team_assessment_task)
            createBadResponse(f"An error occurred retrieving all assessment tasks assigned to team_id: {team_id}!", team_assessment_tasks, "assessment_tasks")
            return response
        all_assessment_tasks = []
        for team_assessment_task in team_assessment_tasks:
            assessment_task = get_assessment_task(team_assessment_task.assessment_task_id)
            if type(assessment_task)==type(""):
                print(f"[Assessment_task_routes /assessment_task?team_id=<int:team_id> GET] An error occurred retrieving all assessment tasks assigned to team_id: {team_id}, ", assessment_task)
                createBadResponse(f"An error occurred retrieving all assessment tasks assigned to team_id: {team_id}!", assessment_task, "assessement_tasks")
                return response
            all_assessment_tasks.append(assessment_task)
        print(f"[Assessment_task_routes /assessment_task?team_id=<int:team_id> GET] Successfully retrieved all assessment tasks assigned to team_id: {team_id}!")
        createGoodResponse(f"Successfully retrieved all assessment tasks assigned to team_id: {team_id}!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
        return response
    all_assessment_tasks = get_assessment_tasks()
    if type(all_assessment_tasks) == type(""):
        print("[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks: ", all_assessment_tasks)
        createBadResponse("An error occurred retrieving all assessment tasks!", all_assessment_tasks, "assessment_tasks")
        return response
    print("[Assessment_task_routes /assessment_task GET] Successfully retrived all assessment tasks!")
    createGoodResponse("Successfully retrieved all assessment tasks!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
    return response

# /assessment_task/<int:assessment_task_id> GET fetches one assessment task with the specified assessment_task_id
@bp.route('/assessment_task/<int:assessment_task_id>', methods =['GET'])
def get_one_assessment_task(assessment_task_id):
    one_assessment_task = get_assessment_task(assessment_task_id)
    if type(one_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:assessment_task_id> GET] An error occurred fetching assessment_task_id: {assessment_task_id}, ", one_assessment_task)
        createBadResponse(f"An error occurred fetching assessment_task_id: {assessment_task_id}!", one_assessment_task, "assessment_tasks")
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:assessment_task_id> GET] Successfully fetched assessment_task_id: {assessment_task_id}!")
    createGoodResponse(f"Successfully fetched assessment_task_id: {assessment_task_id}!", assessment_task_schema.dump(one_assessment_task), 200, "assessment_tasks")
    return response

# /assessment_task POST creates an assessment task with the requested json!
@bp.route('/assessment_task', methods = ['POST'])
def add_assessment_task():
    new_assessment_task = create_assessment_task(request.json)
    if type(new_assessment_task)==type(""):
        print("[Assessment_task_routes /assessment_task POST] An error occurred creating a new assessment task: ", new_assessment_task)
        createBadResponse("An error occurred creating a new assessment task!", new_assessment_task, "assessment_tasks")
        return response
    print("[Assessment_task_routes /assessment_task POST] Successfully created a new assessment task!")
    createGoodResponse("Successfully created a new assessment task!", assessment_task_schema.dump(new_assessment_task), 201, "assessment_tasks")
    return response

# /assessment_task/<int:assessment_task_id> PUT updates an existing assessment task with the requested json! 
@bp.route('/assessment_task/<int:assessment_task_id>', methods = ['PUT'])
def update_assessment_task(assessment_task_id):
    updated_assessment_task = replace_assessment_task(request.json, assessment_task_id)
    if type(updated_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:assessment_task_id> PUT] An error occurred replacing assessment_task_id: {assessment_task_id}, ", updated_assessment_task)
        createBadResponse(f"An error occurred replacing assessment_task_id: {assessment_task_id}!", updated_assessment_task, "assessment_tasks")
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:assessment_task_id> PUT] Successfully replaced assessment_task_id: {assessment_task_id}!")
    createGoodResponse(f"Sucessfully replaced assessment_task_id: {assessment_task_id}!", assessment_task_schema.dump(updated_assessment_task), 201, "assessment_tasks")
    return response

class AssessmentTaskSchema(ma.Schema):
    class Meta:
        fields = (
            'assessment_task_id',
            'assessment_task_name',
            'course_id',
            'rubric_id',
            'role_id',
            'due_date',
            'show_suggestions',
            'show_ratings'
        )

assessment_task_schema = AssessmentTaskSchema()
assessment_tasks_schema = AssessmentTaskSchema(many=True)
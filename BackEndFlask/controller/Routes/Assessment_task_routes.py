from flask import jsonify, request, Response
from flask_login import login_required
from flask_sqlalchemy import *
from models.assessment_task import *
from models.course import *
from models.user import *
from models.user_course import *
from models.team_user import *
from models.schemas import *
from controller import bp
from flask_marshmallow import Marshmallow
from sqlalchemy import *
from sqlite3 import *
from controller.Route_response import *
 
class AssessmentTaskSchema(ma.Schema):
    class Meta:
        fields = ('assessment_task_id','assessment_task_name', 'course_id', 'rubric_id', 'role_id', 'user_course_id', 'due_date', 'suggestions')
class UserSchema(ma.Schema):
    class Meta:
        fields = ('user_id','first_name','last_name', 'email', 'password','role_id', 'lms_id', 'consent', 'owner_id')

class UserCourseSchema(ma.Schema):
    class Meta:
        fields = ('user_course_id', 'user_id', 'course_id')
class CourseSchema(ma.Schema):
    class Meta:
        fields = ('course_id', 'course_number', 'course_name', 'year', 'term', 'active', 'admin_id', 'use_tas')
class TeamUserSchema(ma.Schema):
    class Meta:
        fields = ('team_user_id', 'team_id', 'user_id')

assessment_task_schema = AssessmentTaskSchema()
assessment_tasks_schema = AssessmentTaskSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
usercourse_schema = UserCourseSchema()
userscourses_schema = UserCourseSchema(many=True)
course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)
team_user_schema = TeamUserSchema()
team_users_schema = TeamUserSchema(many=True)


# This route will retrieve all of the available the assessment tasks
@bp.route('/assessment_task', methods = ['GET'])
def get_all_assessment_tasks():
    if(request.args and request.args.get("course_id")):
        course_id = int(request.args.get("course_id"))
        course = get_course(course_id)
        if type(course)==type(""):
            print(f"[Assessment_task_routes /assessment_task?course_id=<int:id> GET] An error occurred retrieving all assessment_tasks enrolled in course_id: {course_id}, ", course)
            createBadResponse(f"An error occurred retrieving course_id: {course_id}!", course, "assessment_tasks")
            return response
        all_assessment_tasks = get_assessment_tasks_by_course_id(course_id)
        if type(all_assessment_tasks) == type(""):
            print(f"[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks enrolled in course_id: {course_id}, ", all_assessment_tasks)
            createBadResponse(f"An error occurred retrieving all assessment tasks enrolled in course_id: {course_id}!", all_assessment_tasks, "assessment_tasks")
            return response
        print(f"[Assessment_task_routes /assessment_task GET] Successfully retrived all assessment tasks enrolled in course_id: {course_id}!")
        createGoodResponse(f"Successfully retrived all assessment tasks enrolled in course_id: {course_id}!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
        return response
    all_assessment_tasks = get_assessment_tasks()
    if type(all_assessment_tasks) == type(""):
        print("[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks: ", all_assessment_tasks)
        createBadResponse("An error occurred retrieving all assessment tasks!", all_assessment_tasks, "assessment_tasks")
        return response
    print("[Assessment_task_routes /assessment_task GET] Successfully retrived all assessment tasks!")
    createGoodResponse("Successfully retrieved all assessment tasks!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
    return response

# This route will retrieve individual assessment tasks
@bp.route('/assessment_task/<int:id>', methods =['GET'])
def get_one_assessment_task(id):
    one_assessment_task = get_assessment_task(id)
    if type(one_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:id> GET] An error occurred fetching assessment_task_id: {id}, ", one_assessment_task)
        createBadResponse(f"An error occurred fetching assessment_task_id: {id}!", one_assessment_task, "assessment_tasks")
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:id> GET] Successfully fetched assessment_task_id: {id}!")
    createGoodResponse(f"Successfully fetched assessment_task_id: {id}!", assessment_task_schema.dump(one_assessment_task), 200, "assessment_tasks")
    return response

# This route will create the actual assessment tasks
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

# This route will update the assessment tasks that are existing
@bp.route('/assessment_task/<int:id>', methods = ['PUT'])
def update_assessment_task(id):
    updated_assessment_task = replace_assessment_task(request.json, id)
    if type(updated_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred replacing assessment_task_id: {id}, ", updated_assessment_task)
        createBadResponse(f"An error occurred replacing assessment_task_id: {id}!", updated_assessment_task, "assessment_tasks")
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:id> PUT] Successfully replaced assessment_task_id: {id}!")
    createGoodResponse(f"Sucessfully replaced assessment_task_id: {id}!", assessment_task_schema.dump(updated_assessment_task), 201, "assessment_tasks")
    return response


# @bp.route('/assessment_task/<int:id>', methods =['GET'])
# def get_assessment_task_by_course_id(id):
#     print(request.args)
    

@bp.route('/assessment_task/course/<int:id>', methods =['GET']) # This route will retrieve individual assessment tasks for specific courses
def get_course_specific_assessment_tasks(id):
    course_assessment_tasks = get_assessment_tasks(get_course(id))
    if type(course_assessment_tasks)==type(""):
        print(f"[Assessment_task_routes /assessment_task/course/<int:id> GET] An error occurred fetching assessment_task_id:{id}, ", course_assessment_tasks)
        createBadResponse(f"An error occurred fetching assessment_task_id: {id}!", course_assessment_tasks)
        return response
    print(f"[Assessment_task_routes /assessment_task/course/<int:id> GET] Successfully fetched assessment_task_id: {id}!")
    createGoodResponse(f"Successfully fetched assessment_task_id: {id}!", assessment_task_schema.dump(course_assessment_tasks), 200)
    return response

@bp.route('assessment_task/<int:id>', methods = ['GET']) #This should in theory get all assessment tasks for a specific student/user
def AT_by_Student(user_id):
    ATlist = []
    Users.user_id = select(UserCourse(user_id = Users.user_id))
    for assigned_course in select(UserCourse(user_id = Users.user_id)):
        assigned_course.user_course_id = select(AssessmentTask(user_course_id = assigned_course.user_course_id))
        for assignedAT in select(AssessmentTask(user_course_id = assigned_course.user_course_id)):
            ATlist.append(assignedAT)
    assessment_task_schema.dump(assignedAT)
    
@bp.route('assessment_task/<int:id>', methods = ['GET']) #This should in theory get all assessment tasks for a specific role
def AT_by_Role(user_id,role_id):
    ATlist = []
    Users.user_id = select(UserCourse(user_id = Users.user_id))
    for assigned_course in select(UserCourse(user_id = Users.user_id)):
        assigned_course.user_course_id = select(AssessmentTask(user_course_id = assigned_course.user_course_id))
        for assignedAT in select(AssessmentTask(user_course_id = assigned_course.user_course_id)):
            ATlist.append(assignedAT)
    assessment_task_schema.dump(assignedAT)
    for AT in assignedAT:
        if role_id == AssessmentTask.role_id:
            ATlist.append(AT)
    assessment_task_schema.dump(AT)
    
@bp.route('assessment_task/<int:id>', methods = ['GET']) #This should in theory get all assessment tasks for a specific student/user
def AT_by_Team(team_id):
    ATlist = []
    TeamUser(team_id == team_id)
    for team_id in TeamUser(team_id == team_id):
            Users.user_id = select(UserCourse(user_id = Users.user_id))
            for assigned_course in select(UserCourse(user_id = Users.user_id)):
                assigned_course.user_course_id = select(AssessmentTask(user_course_id = assigned_course.user_course_id))
                for assignedAT in select(AssessmentTask(user_course_id = assigned_course.user_course_id)):
                    ATlist.append(assignedAT)
    assessment_task_schema.dump(assignedAT)

    
# This route will retrieve all of the available the assessment tasks for specific users
@bp.route('/assessment_task', methods = ['GET'])
def get_all_assessment_tasks():
    if(request.args and request.args.get("course_id")):
        course_id = int(request.args.get("course_id"))
        course = get_course(course_id)
        if type(course)==type(""):
            print(f"[Assessment_task_routes /assessment_task?course_id=<int:id> GET] An error occurred retrieving all assessment_tasks enrolled in course_id: {course_id}, ", course)
            createBadResponse(f"An error occurred retrieving course_id: {course_id}!", course, "assessment_tasks")
            return response
                if(request.args and request.args.get("user_id")):
                    user_id = int(request.args.get("user_id"))
                    user= get_user(user_id)
                    if type(user)==type(""):
                        print(f"[Assessment_task_routes /assessment_task?course_id=<int:id> GET] An error occurred retrieving all assessment_tasks enrolled in course_id: {user_id}, ", user)
                        createBadResponse(f"An error occurred retrieving course_id: {user_id}!", user, "assessment_tasks")
                        return response
                    all_assessment_tasks = get_assessment_tasks_by_user_id(user_id)
                    if type(all_assessment_tasks) == type(""):
                        print(f"[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks enrolled in course_id: {user_id}, ", all_assessment_tasks)
                        createBadResponse(f"An error occurred retrieving all assessment tasks enrolled in course_id: {user_id}!", all_assessment_tasks, "assessment_tasks")
                        return response                    
        all_assessment_tasks = get_assessment_tasks_by_course_id(course_id)
        if type(all_assessment_tasks) == type(""):
            print(f"[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks enrolled in course_id: {course_id}, ", all_assessment_tasks)
            createBadResponse(f"An error occurred retrieving all assessment tasks enrolled in course_id: {course_id}!", all_assessment_tasks, "assessment_tasks")
            return response
        print(f"[Assessment_task_routes /assessment_task GET] Successfully retrived all assessment tasks enrolled in course_id: {course_id}!")
        createGoodResponse(f"Successfully retrived all assessment tasks enrolled in course_id: {course_id}!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
        return response
    all_assessment_tasks = get_assessment_tasks()
    if type(all_assessment_tasks) == type(""):
        print("[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks: ", all_assessment_tasks)
        createBadResponse("An error occurred retrieving all assessment tasks!", all_assessment_tasks, "assessment_tasks")
        return response
    print("[Assessment_task_routes /assessment_task GET] Successfully retrived all assessment tasks!")
    createGoodResponse("Successfully retrieved all assessment tasks!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
    return response


# AssessmentTask.select(at_name) where
# AssessmentTask.ID = UserCourse.select(course_id) where
# UserID = Users.select(user_id) where
# x = TAs or Y =students 

    # if request.args:
    #     print(request.args.keys())
    #     if(request.args.getlist("course_id")):
    #         try:  
    #             course_id = (int(request.args.getlist("course_id")[0]))
    #         except:
    #             print("[Assessment_task_routes /assessment_task?course_id=<int:id> GET] Invalid course_id argument type! Only ints are alllowed")
    #             createBadResponse("Invalid course_id argument type! Only ints are alllowed", request.args.getlist("course_id"))

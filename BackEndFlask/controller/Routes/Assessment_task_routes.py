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
        fields = ('at_id','at_name', 'course_id', 'rubric_id', 'role_id', 'uc_id', 'due_date', 'suggestions')
class UserSchema(ma.Schema):
    class Meta:
        fields = ('user_id','first_name','last_name', 'email', 'password','role_id', 'lms_id', 'consent', 'owner_id')

class UserCourseSchema(ma.Schema):
    class Meta:
        fields = ('uc_id', 'user_id', 'course_id')
class CourseSchema(ma.Schema):
    class Meta:
        fields = ('course_id', 'course_number', 'course_name', 'year', 'term', 'active', 'admin_id', 'use_tas')
class TeamUserSchema(ma.Schema):
    class Meta:
        fields = ('tu_id', 'team_id', 'user_id')

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


@bp.route('/assessment_task', methods = ['GET']) # This route will retrieve all of the available the assessment tasks
def get_all_assessment_tasks():
    if request.args:
        print(request.args)
        
    all_assessment_tasks = get_assessment_tasks()
    if type(all_assessment_tasks) == type(""):
        print("[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks: ", all_assessment_tasks)
        createBadResponse("An error occurred retrieving all assessment tasks!", all_assessment_tasks, "assessment_tasks")
        return response
    print("[Assessment_task_routes /assessment_task GET] Successfully retrived all assessment tasks!")
    createGoodResponse("Successfully retrieved all assessment tasks!", assessment_tasks_schema.dump(all_assessment_tasks), 200, "assessment_tasks")
    return response

@bp.route('/assessment_task/<int:id>', methods =['GET']) # This route will retrieve individual assessment tasks
def get_one_assessment_task(id):
    one_assessment_task = get_assessment_task(id)
    if type(one_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:id> GET] An error occurred fetching assessment_task_id:{id}, ", one_assessment_task)
        createBadResponse(f"An error occurred fetching assessment_task_id: {id}!", one_assessment_task, "assessment_tasks")
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:id> GET] Successfully fetched assessment_task_id: {id}!")
    createGoodResponse(f"Successfully fetched assessment_task_id: {id}!", assessment_task_schema.dump(one_assessment_task), 200, "assessment_tasks")
    return response

@bp.route('/assessment_task', methods = ['POST']) #This route will create the actual assessment tasks
def add_assessment_task():
    new_assessment_task = create_assessment_task(request.json)
    if type(new_assessment_task)==type(""):
        print("[Assessment_task_routes /assessment_task POST] An error occurred creating a new assessment task: ", new_assessment_task)
        createBadResponse("An error occurred creating a new assessment task!", new_assessment_task, "assessment_tasks")
        return response
    print("[Assessment_task_routes /assessment_task POST] Successfully created a new assessment task!")
    createGoodResponse("Successfully created a new assessment task!", assessment_task_schema.dump(new_assessment_task), 201, "assessment_tasks")
    return response

@bp.route('/assessment_task/<int:id>', methods = ['PUT']) #This route will update the assessment tasks that are existing
def update_assessment_task(id):
    updated_assessment_task = replace_assessment_task(request.json, id)
    if type(updated_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred replacing assessment_task_id: {id}, ", updated_assessment_task)
        createBadResponse(f"An error occurred replacing assessment_task_id: {id}!", updated_assessment_task, "assessment_tasks")
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:id> PUT] Successfully replaced assessment_task_id: {id}!")
    createGoodResponse(f"Sucessfully replaced assessment_task_id: {id}!", assessment_task_schema.dump(updated_assessment_task), 201, "assessment_tasks")
    return response


@bp.route('/assessment_task/<int:id>', methods =['GET'])
def get_assessment_task_by_course_id(id):
    print(request.args)
    

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

@bp.route('assessment_task/<int:id>', methods = ['GET'])
def AT_by_Student(user_id):
    ATlist = []
    Users.user_id = select(UserCourse(user_id = Users.user_id))
    for assigned_course in select(UserCourse(user_id = Users.user_id)):
        assigned_course.uc_id = select(AssessmentTask(uc_id = assigned_course.uc_id))
        for assignedAT in select(AssessmentTask(uc_id = assigned_course.uc_id)):
            ATlist.append(assignedAT)
    assessment_task_schema.dump(assignedAT)
    
@bp.route('assessment_task/<int:id>', methods = ['GET'])
def AT_by_Role(user_id,role_id):
    ATlist = []
    Users.user_id = select(UserCourse(user_id = Users.user_id))
    for assigned_course in select(UserCourse(user_id = Users.user_id)):
        assigned_course.uc_id = select(AssessmentTask(uc_id = assigned_course.uc_id))
        for assignedAT in select(AssessmentTask(uc_id = assigned_course.uc_id)):
            ATlist.append(assignedAT)
    assessment_task_schema.dump(assignedAT)
    for AT in assignedAT:
        if role_id == AssessmentTask.role_id:
            ATlist.append(AT)
    assessment_task_schema.dump(AT)
@bp.route('assessment_task/<int:id>', methods = ['GET'])
def AT_by_Team(team_id):
    ATlist = []
    TeamUser(team_id == team_id)
    for team_id in TeamUser(team_id == team_id):
            Users.user_id = select(UserCourse(user_id = Users.user_id))
            for assigned_course in select(UserCourse(user_id = Users.user_id)):
                assigned_course.uc_id = select(AssessmentTask(uc_id = assigned_course.uc_id))
                for assignedAT in select(AssessmentTask(uc_id = assigned_course.uc_id)):
                    ATlist.append(assignedAT)
    assessment_task_schema.dump(assignedAT)
# AssessmentTask.select(at_name) where
# AssessmentTask.ID = UserCourse.select(course_id) where
# UserID = Users.select(user_id) where
# x = TAs or Y =students 
    

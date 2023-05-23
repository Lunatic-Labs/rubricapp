from flask import jsonify, request, Response
from flask_login import login_required
from flask_sqlalchemy import *
from models.assessment_task import *
from models.course import *
from models.user import *
from models.user_course import *
from models.schemas import *
from controller import bp
from flask_marshmallow import Marshmallow
import sqlite3

conn = sqlite3.connect("account.db")
cursor = conn.cursor()
ma = Marshmallow()

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage):
    JSON = {"assessment_tasks": []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, entire_assessment_tasks, status):
    JSON = {"assessment_tasks": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["assessment_tasks"].append(entire_assessment_tasks)
    response["content"] = JSON
    JSON = {"assessment_tasks": []}
    
@bp.route('/assessment_task', methods = ['GET']) # This route will retrieve all of the available the assessment tasks
def get_all_assessment_tasks():
    all_assessment_tasks = get_assessment_tasks()
    if type(all_assessment_tasks) == type(""):
        print("[Assessment_task_routes /assessment_task GET] An error occurred retrieving all assessment tasks: ", all_assessment_tasks)
        createBadResponse("An error occurred retrieving all assessment tasks!", all_assessment_tasks)
        return response
    print("[Assessment_task_routes /assessment_task GET] Successfully retrived all assessment tasks!")
    createGoodResponse("Successfully retrieved all assessment tasks!", assessment_tasks_schema.dump(all_assessment_tasks), 200)
    return response

@bp.route('/assessment_task/<int:id>', methods =['GET']) # This route will retrieve individual assessment tasks
def get_one_assessment_task(id):
    one_assessment_task = get_assessment_task(id)
    if type(one_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:id> GET] An error occurred fetching assessment_task_id:{id}, ", one_assessment_task)
        createBadResponse(f"An error occurred fetching assessment_task_id: {id}!", one_assessment_task)
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:id> GET] Successfully fetched assessment_task_id: {id}!")
    createGoodResponse(f"Successfully fetched assessment_task_id: {id}!", assessment_task_schema.dump(one_assessment_task), 200)
    return response

@bp.route('/assessment_task', methods = ['POST']) #This route will create the actual assessment tasks
def add_assessment_task():
    new_assessment_task = create_assessment_task(request.json)
    if type(new_assessment_task)==type(""):
        print("[Assessment_task_routes /assessment_task POST] An error occurred creating a new assessment task: ", new_assessment_task)
        createBadResponse("An error occurred creating a new assessment task!", new_assessment_task)
        return response
    print("[Assessment_task_routes /assessment_task POST] Successfully created a new assessment task!")
    createGoodResponse("Successfully created a new assessment task!", assessment_task_schema.dump(new_assessment_task), 201)
    return response

@bp.route('/assessment_task/<int:id>', methods = ['PUT']) #This route will update the assessment tasks that are existing
def update_assessment_task(id):
    updated_assessment_task = replace_assessment_task(request.json, id)
    if type(updated_assessment_task)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred replacing assessment_task_id: {id}, ", updated_assessment_task)
        createBadResponse(f"An error occurred replacing assessment_task_id: {id}!", updated_assessment_task)
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:id> PUT] Successfully replaced assessment_task_id: {id}!")
    createGoodResponse(f"Sucessfully replaced assessment_task_id: {id}!", assessment_task_schema.dump(updated_assessment_task), 201)
    return response

@bp.route('/assessment_task/<int:id>', methods =['GET']) # This route will retrieve individual assessment tasks
def get_course_specific_assessment_tasks(id):
    course_assessment_tasks = get_assessment_tasks(get_course(id))
    if type(course_assessment_tasks)==type(""):
        print(f"[Assessment_task_routes /assessment_task/<int:id> GET] An error occurred fetching assessment_task_id:{id}, ", course_assessment_tasks)
        createBadResponse(f"An error occurred fetching assessment_task_id: {id}!", course_assessment_tasks)
        return response
    print(f"[Assessment_task_routes /assessment_task/<int:id> GET] Successfully fetched assessment_task_id: {id}!")
    createGoodResponse(f"Successfully fetched assessment_task_id: {id}!", assessment_task_schema.dump(course_assessment_tasks), 200)
    return response

@bp.route('assessment_task/<int:id>', methods = ['GET'])
def student_get_AT(id):
    Student_AT = get_assessment_task(id) 
    if type(Student_AT) == type(""):
        print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task! ", Student_AT)
        createBadResponse("An error occurred geting specific assessment task! ", Student_AT)
        return response
    Student_AT.ids = []
    all_ids_for_assessment_tasks = get_user_course(id)
    for IDS in all_ids_for_assessment_tasks:
        Userids = get_user_course(UserCourse.user_id)
        IDS.Userids = Userids
        Courseids = get_user_course(UserCourse.course_id)
        IDS.Courseids = Courseids 
        Student_AT.ids.append(IDS)
    StudentAT = assessment_task_schema.dump(Student_AT)
    print(f"[Rubric_routes /rubric/<int:id> GET] Successfully fetched rubric_id: {id}!")
    createGoodResponse(f"Successfully fetched rubric_id: {id}!", StudentAT, 200, "rubrics")
    return response

@bp.route('assessment_task/<int:id>', methods = ['GET'])
def TA_get_AT(id):
    TAs_AT = AssessmentTask
    for assessment_task_id in TAs_AT:
        AssessmentTask.at_id = UserCourse.select("course_id")
        assessment_task_id = AssessmentTask.at_id
        for UsersID in assessment_task_id:    
            Users.user_id = Users.select("user_id" == 4)
            UsersID = Users.user_id
            return UsersID
    TA_AT = get_assessment_task(TAs_AT)    
    if type(TA_AT) == type(""):
        print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task! ", TA_AT)
        createBadResponse("An error occurred geting specific assessment task! ", TA_AT)
        return response
    results = assessment_task_schema.dump(TA_AT)
    all_TA_AT = 0
    for assessment_task in results:
        all_TA_AT += 1
    if(all_TA_AT == 0):
        print(f"[Assessment_task_routes /assessment_task/<id> GET] at_id: {id} does not exist!")
        createBadResponse("An error occurred fetching assessment task! ", f"at_id: {id} does not exist")
        return response
    print("[Assessment_task_routes /assessment_task/<id>/ GET] Successfully fetched a single assessment task!")
    createGoodResponse("Successfully fetched single assessment task!", results, 200)
    return response
    # TA_AT = get_assessment_task(get_user_course(get_user(id)))
    # if id in get_user() != 4:
    #     print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task! ", TA_AT)
    #     createBadResponse("An error occurred geting specific assessment task! ", TA_AT)
    #     return response
        # AssessmentTask.select(at_name) where
    # AssessmentTask.ID = UserCourse.select(course_id) where
    # UserID = Users.select(userid) where
    # x = TAs or Y =students 
class AssessmentTaskSchema(ma.Schema):
    class Meta:
        fields = ('at_id','at_name', 'course_id', 'rubric_id', 'role_id', 'due_date', 'suggestions')
class UserSchema(ma.Schema):
    class Meta:
        fields = ('user_id','first_name','last_name', 'email', 'password','role_id', 'lms_id', 'consent', 'owner_id')

class UserCourseSchema(ma.Schema):
    class Meta:
        fields = ('uc_id', 'user_id', 'course_id')

class CourseSchema(ma.Schema):
    class Meta:
        fields = ('course_id', 'course_number', 'course_name', 'year', 'term', 'active', 'admin_id', 'use_tas')

assessment_task_schema = AssessmentTaskSchema()
assessment_tasks_schema = AssessmentTaskSchema(many=True)
course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
usercourse_schema = UserCourseSchema()
userscourses_schema = UserCourseSchema(many=True)


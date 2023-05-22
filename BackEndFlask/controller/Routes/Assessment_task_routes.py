from flask import jsonify, request, Response
from flask_login import login_required
from flask_sqlalchemy import *
from models.assessment_task import *
from models.course import *
from models.user import *
from models.role import *
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

@bp.route('assessment_task/<int:id>', methods = ['GET'])
def student_get_AT(id):
    # AssessmentTask.select(at_name) where
    # AssessmentTask.ID = UserCourse.select(course_id) where
    # UserID = Users.select(userid) where
    # x = TAs or Y =students
    Students_AT = AssessmentTask
    for assessment_task_id in Students_AT:
        AssessmentTask.at_id = UserCourse.select("course_id")
        assessment_task_id = AssessmentTask.at_id
        for UsersID in assessment_task_id:    
            Users.user_id = Users.select("user_id" == 5)
            UsersID = Users.user_id
            return UsersID
    Student_AT = get_assessment_task(Students_AT)    
    # Student_AT = get_assessment_task(get_user_course(get_user(id)))
    # if id in get_user() != 5:
    #     print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task! ", Student_AT)
    #     createBadResponse("An error occurred geting specific assessment task! ", Student_AT)
    #     return response 
    if type(Student_AT) == type(""):
        print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task! ", Student_AT)
        createBadResponse("An error occurred geting specific assessment task! ", Student_AT)
        return response
    results = assessment_task_schema.dump(Student_AT)
    all_student_AT = 0
    for assessment_task in results:
        all_student_AT += 1
    if(all_student_AT == 0):
        print(f"[Assessment_task_routes /assessment_task/<id> GET] at_id: {id} does not exist!")
        createBadResponse("An error occurred fetching assessment task! ", f"at_id: {id} does not exist")
        return response
    print("[Assessment_task_routes /assessment_task/<id>/ GET] Successfully fetched a single assessment task!")
    createGoodResponse("Successfully fetched single assessment task!", results, 200)
    return response
class AssessmentTaskSchema(ma.Schema):
    class Meta:
        fields = ('at_id','at_name', 'course_id', 'rubric_id', 'role_id', 'due_date', 'suggestions')

assessment_task_schema = AssessmentTaskSchema()
assessment_tasks_schema = AssessmentTaskSchema(many=True)

    #TA_Instructor_AT = get_role(get_user(get_user_course(get_course(get_assessment_task(id))))) - The data set will get way too large before cutting it
        
    #student_AT = get_role(get_user(get_user_course(get_course(get_assessment_task(id))))) - The data set will get way too large before cutting it
    
    #student_AT = get_assessment_task(get_course(get_user_course(get_user(get_role(id)))))
    
    #TA_Instructor_AT = get_assessment_task(get_course(get_user_course(get_user(get_role(id))))) 
  
    #users.select(where role_id = 5 or role_id = 4)
    
    
# @bp.route('assessment_task/<int:id>', methods =['GET']) #This will get specific assessment tasks for the individual student
# def student_get_AT(id):
#     student_AT = get_assessment_task(get_course(get_user_course(get_user(get_role(id)))))
#     if type(student_AT)==type(""):
#         print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task for a student! ", student_AT)
#         createBadResponse("An error occurred geting specific assessment task for a student! ", student_AT)
#         return response
#     results = assessment_task_schema.dump(student_AT)
#     all_student_AT = 0
#     for assessment_task in results:
#         all_student_AT += 1
#     if(all_student_AT == 0):
#         print(f"[Assessment_task_routes /assessment_task/<id> GET] at_id: {id} does not exist!")
#         createBadResponse("An error occurred fetching assessment task! ", f"at_id: {id} does not exist")
#         return response
#     print("[Assessment_task_routes /assessment_task/<id>/ GET] Successfully fetched a single assessment task!")
#     createGoodResponse("Successfully fetched single assessment task!", results, 200)
#     return response


# @bp.route('assessment_task/<int:id>', methods =['GET']) #This will get specific assessment tasks for the TA/instructor
# def TA_Instructor_get_AT(id):      
#     TA_Instructor_AT = get_assessment_task(get_course(get_user_course(get_user(get_role(id))))) 
#     if type(TA_Instructor_AT)==type(""):
#         print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task! ", TA_Instructor_AT)
#         createBadResponse("An error occurred geting specific assessment task! ", TA_Instructor_AT)
#         return response
#     results = assessment_task_schema.dump(TA_Instructor_AT)
#     all_TA_Instructor_AT = 0
#     for assessment_task in results:
#         all_TA_Instructor_AT += 1
#     if(all_TA_Instructor_AT == 0):
#         print(f"[Assessment_task_routes /assessment_task/<id> GET] at_id: {id} does not exist!")
#         createBadResponse("An error occurred fetching assessment task! ", f"at_id: {id} does not exist")
#         return response
#     print("[Assessment_task_routes /assessment_task/<id>/ GET] Successfully fetched a single assessment task!")
#     createGoodResponse("Successfully fetched single assessment task!", results, 200)
#     return response


# @bp.route('assessment_task/<int:id>', methods = ['GET'])
# def student_get_AT(id):
#     student_AT1 = get_assessment_task(select(Role.role_id, AssessmentTask).where(Role.role_id == AssessmentTask.role_id).order_by(assessmentTask.id).all())
#     student_AT2 = get_assessment_task(select(Course.course_id, AssessmentTask).where(Course.course_id == AssessmentTask.course_id).order_by(AssessmentTask.id).all())
#     student_AT = get_assessment_task(some sort of filter/query statement using student_AT1 and student_AT2)
#     if type(student_AT) == type(""):
#         print("[Assessment_task_routes /assessment_task/<int:id> PUT] An error occurred geting specific assessment task! ", student_AT)
#         createBadResponse("An error occurred geting specific assessment task! ", student_AT)
#         return response
#     results = assessment_task_schema.dump(student_AT)
#     all_student_AT = 0
#     for assessment_task in results:
#         all_student_AT += 1
#     if(all_student_AT == 0):
#         print(f"[Assessment_task_routes /assessment_task/<id> GET] at_id: {id} does not exist!")
#         createBadResponse("An error occurred fetching assessment task! ", f"at_id: {id} does not exist")
#         return response
#     print("[Assessment_task_routes /assessment_task/<id>/ GET] Successfully fetched a single assessment task!")
#     createGoodResponse("Successfully fetched single assessment task!", results, 200)
#     return response

# AssessmentTask.select(at_name) where
# AssessmentTask.ID = UserCourse.select(course_id) where
# UserID = Users.select(userid) where
# x = TAs or Y =students


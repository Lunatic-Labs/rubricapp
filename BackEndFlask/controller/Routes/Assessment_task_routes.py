from flask import jsonify, request, Response
from flask_login import login_required
from models.assessment_task import *
# from models.course import *
# from models.user import *
# from models.role import *
# from models.user_course import *
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
    JSON = {"assessment_tasks": []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, all_at, status):
    JSON = {"assessment_tasks": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["assessment_tasks"].append(all_at)
    response["content"] = JSON
    JSON = {"assessment_tasks": []}
    
@bp.route('/assessment_tasks', methods = ['GET']) #This gets all the assessment tasks
def get_all_at():
    all_ats = get_assessment_tasks()
    if type(all_ats) == type(""):
        print("[Assessment_task_routes /assessment_tasks GET] An error occurred fetching all assessment tasks ", all_ats)
        createBadResponse("An error occured fetching all assessment tasks ", all_ats)
        return response
    result = ATS_schema.dump(all_ats)
    print("[Assessment_task_routes/ assessment_tasks GET] Successfully retrived all assessment tasks!")
    createGoodResponse("Successfully retrieved all assessment tasks!", result, 200)
    return response

@bp.route('/assessment_tasks/<int:id>', methods =['GET']) #This gets individual assessment tasks
def post_details(id):
    single_at = get_assessment_task(id)
    if type(single_at)==type(""):
        print("[Assessment_task_routes /assessment_tasks/<id> GET] An error occurred fetching one single role ", single_at)
        createBadResponse("An error occurred fetching a single role ", single_at)
    result = AT_schema.dump(single_at)
    allAT = 0
    for assessment_task in result:
        allAT += 1
    if(allAT == 0):
        print(f"[Assessment_task_routes /assessment_tasks/<id> GET] at_id: {id} does not exist!")
        createBadResponse("An error occured fetching assessment task! ", f"at_id: {id} does not exist")
        return response
    print("[Assessment_task_routes /role/<id>/ GET] Successfully fetched a single assessment task!")
    createGoodResponse("Successfully fetched single assessment task!", result, 200)
    return response

@bp.route('/assessment_tasks', methods = ['POST']) #This creates assessment tasks
def create_at():
    new_AT = create_assessment_task(request.json)
    if type(new_AT)==type(""):
        print("[Assessment_task_routes /assessment_tasks POST] An error occurred creating a new assessment task! ", new_AT)
        createBadResponse("An error occurred creating a new assessment task! ", new_AT)
        return response
    results = AT_schema.jsonify(new_AT)
    print("[Assessment_task_routes /assessment_tasks POST] Successfully created a new assessment task!")
    createGoodResponse("Successfully created a new assessment task!", {}, 201)
    return response

@bp.route('/assessment_tasks/<int:id>', methods = ['PUT']) #This updates the assessment tasks
def update_AT(id):
    updated_assessment_task = replace_assessment_task(request.json, id)
    if type(updated_assessment_task)==type(""):
        print("[Assessment_task_routes /assessment_tasks/<int:id> PUT] An error occurred replacing assessment task! ", updated_assessment_task)
        createBadResponse("An error occurred updating the existing assessment task! ", updated_assessment_task)
        return response
    results = AT_schema.dump(updated_assessment_task)
    print("[Assessment_task_routes /assessment_tasks/<int:id> PUT] Successfully updated assessment task!")
    createGoodResponse("Sucessfully updated existing assessment task!", results, 201)
    return response

@bp.route('assessment_tasks/<int:id>', methods =['GET']) #This should be able to send show specific assessment tasks for the individual student
def student_get_AT(id):
    #student_AT = get_assessment_task(get_role(get_user(get_course(id))))
    #student_AT = get_assessment_task(get_user(get_role(get_course(id))))
    #student_AT = get_role(get_user(get_course(get_assessment_task(id))))
    #student_AT = get_role(get_user(get_user_course(get_course(get_assessment_task(id)))))
    student_AT = get_assessment_task(id) 
    if type(student_AT)==type(""):
        print("[Assessment_task_routes /assessment_tasks/<int:id> PUT] An error occurred geting specific assessment task! ", student_AT)
        createBadResponse("An error occurred geting specific assessment task! ", student_AT)
        return response
    results = AT_schema.dump(student_AT)
    print("[Assessment_task_routes /assessment_tasks/<int:id> PUT] Successfully updated assessment!")
    createGoodResponse("Sucessfully updated existing assessment task!", results, 201)
    return response
# @app.route('/assessment_tasks/<int:id>') - This is a possible way to maybe call user specific assessment tasks
# def student_AT(id):
#     student_AT = database.query.filter_by(at_role=role_id).first()
#     return render_template('info.html', Assessment_Task=student_AT)

class ATSchema(ma.Schema):
    class Meta:
        fields = ('at_id','at_name', 'course_id', 'rubric_id', 'at_role', 'due_date', 'suggestions')

AT_schema = ATSchema()
ATS_schema = ATSchema(many=True)
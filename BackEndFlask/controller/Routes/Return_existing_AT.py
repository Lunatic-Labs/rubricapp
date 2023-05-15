from flask import jsonify, request, Response
from flask_login import login_required
from models.assessment_task import *
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
    
@bp.route('/assessment_tasks', methods = ['GET'])
def get_all_at():
    all_ats = get_assessment_tasks()
    if type(all_ats) == type(""):
        print("[Return_existing_AT_routes /assessment_tasks GET] An error occurred fetching all assessment tasks ", all_ats)
        createBadResponse("An error occured fetching all assessment tasks ", all_ats)
        return response
    result = ATS_schema.dump(all_ats)
    print("[Return_existing_AT_routes/ assessment_tasks GET] Successfully retrived all assessment tasks!")
    createGoodResponse("Successfully retrieved all assessment tasks!", result, 200)
    return response

@bp.route('/assessment_tasks/<int:id>', methods =['GET'])
def post_details(id):
    single_at = get_assessment_task(id)
    if type(single_at)==type(""):
        print("[Return_existibg_AT_routes /assessment_tasks/<id> GET] An error occurred fetching one single role ", single_at)
        createBadResponse("An error occurred fetching a single role ", single_at)
    result = AT_schema.dump(single_at)
    allAT = 0
    for assessment_task in result:
        allAT += 1
    if(allAT == 0):
        print(f"[Return_existing_AT_routes /assessment_tasks/<id> GET] at_id: {id} does not exist!")
        createBadResponse("An error occured fetching assessment task! ", f"at_id: {id} does not exist")
        return response
    print("[Return_existing_AT_routes /role/<id>/ GET] Successfully fetched a single assessment task!")
    createGoodResponse("Successfully fetched single assessment task!", result, 200)
    return response
class ATSchema(ma.Schema):
    class Meta:
        fields = ('at_id','at_name', 'course_id', 'rubric_id', 'at_role', 'due_date', 'suggestions')

AT_schema = ATSchema()
ATS_schema = ATSchema(many=True)
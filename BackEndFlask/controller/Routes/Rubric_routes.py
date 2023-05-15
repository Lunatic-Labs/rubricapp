from flask import jsonify, request, Response
from flask_login import login_required
from models.rubric import *
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
    JSON = {"rubrics": []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, entire_rubrics, status):
    JSON = {"rubrics": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["rubrics"].append(entire_rubrics)
    response["content"] = JSON
    JSON = {"rubrics": []}

@bp.route('/rubric', methods = ['GET'])
def get_all_rubrics():
    all_rubrics = get_rubrics()
    if type(all_rubrics)==type(""):
        print("[Rubric_routes /rubric GET] An error occurred fetching all rubrics!", all_rubrics)
        createBadResponse("An error occured fetching all courses!", all_rubrics)
        return response
    results = rubrics_schema.dump(all_rubrics)
    print("[Rubric_routes /rubric GET] Successfully retrieved all rubrics!")
    createGoodResponse("Successfully retrieved all rubrics!", results, 200)
    return response

@bp.route('/rubric/<id>', methods = ['GET'])
def get_one_rubric():
    one_rubric = get_rubric(id)
    if type(one_rubric)==type(""):
        print("[Rubric_routes /rubric/<id>/ GET] An error occurred fetching one rubic!", one_rubric)
        createBadResponse("An error occurred fetching a rubric!", one_rubric)
    results = rubric_schema.dump(one_rubric)
    totalRubrics = 0
    for rubric in results:
        totalRubrics += 1
    if(totalRubrics == 0):
        print(f"[Rubric_routes /rubric/<id> GET] Rubric_id {id} does not exist!")
        createBadResponse("An error occurred fetching course!", f"Course_id: {id} does not exist")
        return response
    print("[Rubric_routes /rubric/<id> GET] Successfully fetched one rubric!")
    createGoodResponse("Successfully fetched rubric!", results, 200)
    return response


class RubricSchema(ma.Schema):
    class Meta:
        fields = ('rubric_id', 'rubric_name', 'rubric_desc')

rubric_schema = RubricSchema()
rubrics_schema = RubricSchema(many=True)
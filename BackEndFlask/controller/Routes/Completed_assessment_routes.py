from flask import jsonify, request, Response
from flask_login import login_required
from models.completed_assessment import *
from controller import bp
from flask_marshmallow import Marshmallow

ma = Marshmallow()

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage, content_type):
    JSON = {content_type: []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, all_JSON, status, content_type):
    JSON = {content_type: []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON[content_type].append(all_JSON)
    response["content"] = JSON
    JSON = {content_type: []}

@bp.route('/completed-assessment/<int:id>', methods = ['GET'])
def get_one_completed_assessment(id):
    one_completed_assessment = get_completed_assessment(id)
    if type(one_completed_assessment)==type(""):
        print(f"[Completed_assessement_routes /completed-assessment/<int:id> GET] An error occured fetching ca_id: {id}!", one_completed_assessment)
        createBadResponse(f"An error occurred fetching ca_id: {id}!", one_completed_assessment, "completed_assessments")
        return response
    print(f"[Completed_assessement_routes /completed-assessment/<int:id> GET] Successfully fetched ca_id: {id}!", one_completed_assessment)
    createGoodResponse(f"Successfully fetched ca_id: {id}!", completed_assessment_schema.dump(one_completed_assessment), 200, "completed_assessments")
    return response
@bp.route('/completed-assessment', methods = ['POST'])
def create_completed_assessment():
    pass

@bp.route('/completed-assessment', methods = ['PUT'])

# this one on the "Punchlist" Google Sheet states that we do not need a get all route
# @bp.route('/completed_assessment', methods = ['GET'])
# def get_all_completed_assessments():
#     pass

class Completed_Assessment_Schema(ma.Schema):
    class Meta:
        fields = ('ca_id', 'at_id', 'by_role', 'team_or_user', 'team_id', 'user_id', 'initial_time',
                  'last_update', 'rating', 'oc_data', 'sfi_data')

completed_assessment_schema = Completed_Assessment_Schema()
completed_assessment_schemas = Completed_Assessment_Schema(many=True)

from flask import jsonify, request, Response
from flask_login import login_required
from models.role import *
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
    JSON = {"roles": []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

def createGoodResponse(message, all_role_names, status):
    JSON = {"roles": []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON["roles"].append(all_role_names)
    response["content"] = JSON
    JSON = {"roles": []}

@bp.route('/completed_assessment', methods = ['GET'])
def get_all_completed_assessments():
    pass

@bp.route('/completed_assessment/<int:id>', methods = ['GET'])
def get_one_completed_assessment():
    pass

@bp.route('/completed_assessment', methods = ['POST'])
def create_completed_assessment():
    pass

class Completed_Assessment_Schema(ma.Schema):
    class Meta:
        fields = ('cr_id', 'at_id', 'by_role', 'team_or_user', 'team_id', 'user_id', 'initial_time',
                  'last_update', 'rating', 'oc_data', 'sfi_data')

completed_assessment_schema = Completed_Assessment_Schema()
completed_assessment_schemas = Completed_Assessment_Schema(many=True)

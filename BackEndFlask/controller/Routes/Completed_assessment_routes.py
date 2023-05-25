from flask import jsonify, request, Response
from flask_login import login_required
from models.completed_assessment import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/completed-assessment/<int:id>', methods = ['GET'])
def get_one_completed_assessment(id):
    one_completed_assessment = get_completed_assessment(id)
    if type(one_completed_assessment)==type(""):
        print(f"[Completed_assessement_routes /completed-assessment/<int:id> GET] An error occured fetching completed_assessment_id: {id}!", one_completed_assessment)
        createBadResponse(f"An error occurred fetching completed_assessment_id: {id}!", one_completed_assessment, "completed_assessments")
        return response
    print(f"[Completed_assessement_routes /completed-assessment/<int:id> GET] Successfully fetched completed_assessment_id: {id}!", one_completed_assessment)
    createGoodResponse(f"Successfully fetched completed_assessment_id: {id}!", completed_assessment_schema.dump(one_completed_assessment), 200, "completed_assessments")
    return response

@bp.route('/completed-assessment', methods = ['POST'])
def add_completed_assessment():
    new_completed_assessment = create_completed_assessment(request.json)
    if type(new_completed_assessment)==type(""):
        print("[Completed_assessment_routes /completed-assessment POST] An error occurred creating a new completed assessment.", new_completed_assessment)
        createBadResponse("An error occurred creating a new completed assessment!", new_completed_assessment, "completed_assessments")
        return response
    print("[Completed_assessment_routes /completed-asssessment POST] Successfully created a new completed assessment!" )
    createGoodResponse("Successfully created a new completed assessment!", completed_assessment_schema.dump(new_completed_assessment), 201, "completed_assessments")
    return response

@bp.route('/completed-assessment/<int:id>', methods = ['PUT'])
def update_completed_assessment(id):
    updated_completed_assessment = replace_completed_assessment(request.json, id)
    if type(updated_completed_assessment)==type(""):
        print(f"[Completed_assessement_routes /completed-assessment/<int:id> PUT] An error occurred updating completed_assessment_id: {id}!", updated_completed_assessment)
        createBadResponse(f"An error occured replacing completed_assessment_id: {id}!", updated_completed_assessment, "completed_assessments")
        return response
    print(f"[Completed_assessement_routes /completed-assessment/<int:id> PUT] Successfully replaced completed_assessment_id: {id}!")
    createGoodResponse(f"Successfully replaced completed_assessment_id: {id}!", completed_assessment_schema.dump(updated_completed_assessment), 201, "completed_assessments")
    return response

# this one on the "Punchlist" Google Sheet states that we do not need a get all route
# @bp.route('/completed_assessment', methods = ['GET'])
# def get_all_completed_assessments():
#     pass

class Completed_Assessment_Schema(ma.Schema):
    class Meta:
        fields = ('completed_assessment_id', 'assessment_task_id', 'by_role', 'team_or_user', 'team_id', 'user_id', 'initial_time',
                  'last_update', 'rating_summation', 'observable_characteristics_data', 'suggestions_data')

completed_assessment_schema = Completed_Assessment_Schema()
completed_assessment_schemas = Completed_Assessment_Schema(many=True)

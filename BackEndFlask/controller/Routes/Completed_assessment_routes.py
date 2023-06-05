from flask import jsonify, request, Response
from flask_login import login_required
from models.assessment_task import get_assessment_task
from models.completed_assessment import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route('/completed_assessment', methods = ['GET'])
def get_all_completed_assessments():
    if(request.args and request.args.get("assessment_task_id")):
        assessment_task_id = int(request.args.get("assessment_task_id"))
        assessment_task = get_assessment_task(assessment_task_id)
        if type(assessment_task)==type(""):
            print(f"[Completed_assessment_routes /completed_assessment?assessment_task_id=<int:id> GET] An error occurred retrieving assessment_task_id: {assessment_task_id}, ", assessment_task)
            createBadResponse(f"An error occurred retrieving assessment_task_id: {assessment_task_id}!", assessment_task, "completed_assessments")
            return response
        completed_assessments_by_assessment_task_id = get_completed_assessments_by_assessment_task_id(assessment_task_id)
        if type(assessment_task)==type(""):
            print(f"[Completed_assessment_routes /complete_assessment?assessment_task_id=<int:id> GET] An error occurred retrieving completed assessments assigned to assessment_task_id: {assessment_task_id}, ", completed_assessments_by_assessment_task_id)
            createBadResponse(f"An error occurred retrieving completed assessments assigned to assessment_task_id: {assessment_task_id}!", completed_assessments_by_assessment_task_id, "completed_assessments")
            return response
        all_completed_assessments = []
        for completed_assessment in completed_assessments_by_assessment_task_id:
            one_completed_assessment = get_completed_assessment(completed_assessment.completed_assessment_id)
            if type(one_completed_assessment)==type(""):
                print(f"[Completed_assessment_routes / completed_assessments?assessment_task_id=<int:id> GET] An error occurred retrieving completed assessments assigned to assessment_task_id: {assessment_task_id}, ", one_completed_assessment)
                createBadResponse(f"An error occurred retrieving completed assessments assigned to assessment_task_id: {assessment_task_id}!", one_completed_assessment)
                return response
            all_completed_assessments.append(one_completed_assessment)
        print(f"[Completed_assessment_routes /completed_assessment?assessment_task_id=<int:id> GET] Successfully retrieved all completed assessments assigned to assessment_task_id: {assessment_task_id}!")
        createGoodResponse(f"Successfully retrieved all completed assessments assigned to assessment_task_id: {assessment_task_id}!", completed_assessment_schemas.dump(all_completed_assessments), 200, "completed_assessments")
        return response
    all_completed_assessments = get_completed_assessments()
    if type(all_completed_assessments) is type(""):
        print(f"[Completed_assessment_routes /complete_assessment GET] An error occurred retrieving all completed assessment tasks, ", all_completed_assessments)
        createBadResponse(f"An error occurred retrieving all completed assessment tasks!", all_completed_assessments, "completed_assessments")
        return response
    print(f"[Completed_assessment_routes /completed_assessment GET] Successfully retrieved all completed assessments!")
    print(completed_assessment_schemas.dump(all_completed_assessments))
    createGoodResponse(f"Successfully retrieved all completed assessments!", completed_assessment_schemas.dump(all_completed_assessments), 200, "completed_assessments")
    return response

@bp.route('/completed_assessment/<int:id>', methods = ['GET'])
def get_one_completed_assessment(id):
    one_completed_assessment = get_completed_assessment(id)
    if type(one_completed_assessment)==type(""):
        print(f"[Completed_assessement_routes /completed_assessment/<int:id> GET] An error occured fetching completed_assessment_id: {id}!", one_completed_assessment)
        createBadResponse(f"An error occurred fetching completed_assessment_id: {id}!", one_completed_assessment, "completed_assessments")
        return response
    print(f"[Completed_assessement_routes /completed_assessment/<int:id> GET] Successfully fetched completed_assessment_id: {id}!", one_completed_assessment)
    createGoodResponse(f"Successfully fetched completed_assessment_id: {id}!", completed_assessment_schema.dump(one_completed_assessment), 200, "completed_assessments")
    return response

@bp.route('/completed_assessment', methods = ['POST'])
def add_completed_assessment():
    new_completed_assessment = create_completed_assessment(request.json)
    if type(new_completed_assessment)==type(""):
        print("[Completed_assessment_routes /completed_assessment POST] An error occurred creating a new completed assessment.", new_completed_assessment)
        createBadResponse("An error occurred creating a new completed assessment!", new_completed_assessment, "completed_assessments")
        return response
    print("[Completed_assessment_routes /completed_asssessment POST] Successfully created a new completed assessment!" )
    createGoodResponse("Successfully created a new completed assessment!", completed_assessment_schema.dump(new_completed_assessment), 201, "completed_assessments")
    return response

@bp.route('/completed_assessment/<int:completed_assessment_id>', methods = ['PUT'])
def update_completed_assessment(completed_assessment_id):
    updated_completed_assessment = replace_completed_assessment(request.json, completed_assessment_id)
    if type(updated_completed_assessment)==type(""):
        print(f"[Completed_assessement_routes /completed_assessment/<int:completed_assessment_id> PUT] An error occurred updating completed_assessment_id: {completed_assessment_id}!", updated_completed_assessment)
        createBadResponse(f"An error occured replacing completed_assessment_id: {completed_assessment_id}!", updated_completed_assessment, "completed_assessments")
        return response
    print(f"[Completed_assessement_routes /completed_assessment/<int:completed_assessment_id> PUT] Successfully replaced completed_assessment_id: {completed_assessment_id}!")
    createGoodResponse(f"Successfully replaced completed_assessment_id: {completed_assessment_id}!", completed_assessment_schema.dump(updated_completed_assessment), 201, "completed_assessments")
    return response

class Completed_Assessment_Schema(ma.Schema):
    class Meta:
        fields = (
            'completed_assessment_id',
            'assessment_task_id',
            'by_role',
            'using_teams',
            'team_id',
            'user_id',
            'initial_time',
            'last_update',
            'rating_observable_characteristics_suggestions_data'
        )

completed_assessment_schema = Completed_Assessment_Schema()
completed_assessment_schemas = Completed_Assessment_Schema(many=True)
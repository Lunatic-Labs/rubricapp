from flask import jsonify, request, Response
from models.assessment_task import get_assessment_task
from models.completed_assessment import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *


@bp.route('/completed_assessment', methods = ['GET'])
def get_all_completed_assessments():
    try:
        if request.args and request.args.get("assessment_task_id"):
            assessment_task_id = int(request.args.get("assessment_task_id"))
            get_assessment_task(assessment_task_id)  # Trigger an error if not exists.
            completed_assessments_by_assessment_task_id = get_completed_assessments_by_assessment_task_id(assessment_task_id)
            all_completed_assessments = []

            for completed_assessment in completed_assessments_by_assessment_task_id:
                one_completed_assessment = get_completed_assessment(completed_assessment.completed_assessment_id)
                all_completed_assessments.append(one_completed_assessment)

            createGoodResponse(f"Successfully retrieved all completed assessments assigned to assessment_task_id: {assessment_task_id}!",
                               completed_assessment_schemas.dump(all_completed_assessments),
                               200, "completed_assessments")
            return response

        if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            all_completed_assessments = get_completed_assessment_by_course_id(course_id)
            createGoodResponse(f"Successfully retrieved all completed assessments!",
                               completed_assessment_schemas.dump(all_completed_assessments),
                               200, "completed_assessments")
            return response

        createGoodResponse(f"Successfully retrieved all completed assessments!",
                           completed_assessment_schemas.dump(all_completed_assessments),
                           200, "completed_assessments")
        return response

    except Exception as e:
        createBadResponse("An error occurred retrieving all completed assessments!",
                          e, "completed_assessments")
        return response


@bp.route('/completed_assessment/<int:id>', methods = ['GET'])
def get_one_completed_assessment(id):
    try:
        one_completed_assessment = get_completed_assessment(id)
        createGoodResponse(f"Successfully fetched completed_assessment_id: {id}!",
                           completed_assessment_schema.dump(one_completed_assessment),
                           200, "completed_assessments")
        return response

    except Exception as e:
        createBadResponse(f"An error occurred fetching completed_assessment_id: {id}!",
                          e, "completed_assessments")


@bp.route('/completed_assessment', methods = ['POST'])
def add_completed_assessment():
    try:
        new_completed_assessment = create_completed_assessment(request.json)
        createGoodResponse("Successfully created a new completed assessment!",
                           completed_assessment_schema.dump(new_completed_assessment),
                           201, "completed_assessments")
        return response

    except Exception as e:
        createBadResponse("An error occurred creating a new completed assessment!",
                          e, "completed_assessments")
        return response


@bp.route('/completed_assessment/<int:completed_assessment_id>', methods = ['PUT'])
def update_completed_assessment(completed_assessment_id):
    try:
        updated_completed_assessment = replace_completed_assessment(request.json, completed_assessment_id)
        createGoodResponse(f"Successfully replaced completed_assessment_id: {completed_assessment_id}!",
                           completed_assessment_schema.dump(updated_completed_assessment),
                           201, "completed_assessments")
        return response

    except Exception as e:
        createBadResponse(f"An error occurred replacing completed_assessment_id: {completed_assessment_id}!",
                          e, "completed_assessments")
        return response

class Completed_Assessment_Schema(ma.Schema):
    class Meta:
        fields = (
            'completed_assessment_id',
            'assessment_task_id',
            'team_id',
            'user_id',
            'initial_time',
            'last_update',
            'rating_observable_characteristics_suggestions_data'
        )

completed_assessment_schema = Completed_Assessment_Schema()
completed_assessment_schemas = Completed_Assessment_Schema(many=True)

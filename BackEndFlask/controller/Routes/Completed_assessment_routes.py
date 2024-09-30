from flask import request
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from models.assessment_task import get_assessment_task
from controller.security.CustomDecorators import AuthCheck, bad_token_check

from models.completed_assessment import (
    get_completed_assessments,
    get_completed_assessment_by_course_id,
    create_completed_assessment,
    replace_completed_assessment,
    completed_assessment_exists
)

from models.queries import (
    get_completed_assessment_by_ta_user_id,
    get_completed_assessment_with_team_name,
    get_completed_assessment_by_user_id,
    get_completed_assessment_with_user_name
)



@bp.route('/completed_assessment', methods = ['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_all_completed_assessments():
    try:
        if request.args and request.args.get("course_id") and request.args.get("role_id"):
            # if the args have a role id, then it is a TA so it should return their completed assessments

            course_id = int(request.args.get("course_id"))

            user_id = request.args.get("user_id")   

            completed_assessments_task_by_user = get_completed_assessment_by_ta_user_id(course_id, user_id)

            return create_good_response(completed_assessment_schemas.dump(completed_assessments_task_by_user), 200, "completed_assessments")

        if request.args and request.args.get("course_id") and request.args.get("user_id"):

            course_id = int(request.args.get("course_id"))

            user_id = request.args.get("user_id")

            completed_assessments_task_by_user = get_completed_assessment_by_user_id(course_id, user_id)

            return create_good_response(completed_assessment_schemas.dump(completed_assessments_task_by_user), 200, "completed_assessments")

        if request.args and request.args.get("assessment_task_id") and request.args.get("unit"):
            assessment_task_id = int(request.args.get("assessment_task_id"))
            unit = request.args.get("unit")

            get_assessment_task(assessment_task_id)  # Trigger an error if not exists.

            if (unit == "team"):
                completed_assessments_by_assessment_task_id = get_completed_assessment_with_team_name(assessment_task_id)
            else:
                completed_assessments_by_assessment_task_id = get_completed_assessment_with_user_name(assessment_task_id)

            return create_good_response(completed_assessment_schemas.dump(completed_assessments_by_assessment_task_id), 200, "completed_assessments")

        if request.args and request.args.get("assessment_task_id"):
            assessment_task_id = int(request.args.get("assessment_task_id"))

            get_assessment_task(assessment_task_id)  # Trigger an error if not exists.

            completed_assessments_by_assessment_task_id = get_completed_assessment_with_team_name(assessment_task_id)

            return create_good_response(completed_assessment_schemas.dump(completed_assessments_by_assessment_task_id), 200, "completed_assessments")

        if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))

            all_completed_assessments = get_completed_assessment_by_course_id(course_id)

            return create_good_response(completed_assessment_schemas.dump(all_completed_assessments), 200, "completed_assessments")
        
        if request.args and request.args.get("completed_assessment_task_id"):
            completed_assessment_task_id = int(request.args.get("completed_assessment_task_id"))

            one_completed_assessment = get_completed_assessment_with_team_name(completed_assessment_task_id)

            return create_good_response(completed_assessment_schema.dump(one_completed_assessment), 200, "completed_assessments")

        all_completed_assessments=get_completed_assessments()

        return create_good_response(completed_assessment_schemas.dump(all_completed_assessments), 200, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all completed assessments: {e}", "completed_assessments", 400)


@bp.route('/completed_assessment', methods = ['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def add_completed_assessment():
    try:
        assessment_data = request.json

        team_id = int(assessment_data["team_id"])
        assessment_task_id = int(request.args.get("assessment_task_id"))
        user_id = int(assessment_data["user_id"])
  
        completed = completed_assessment_exists(team_id, assessment_task_id, user_id)

        if completed:
            completed = replace_completed_assessment(request.json, completed.completed_assessment_id)
        else:
            completed = create_completed_assessment(request.json)

        return create_good_response(completed_assessment_schema.dump(completed), 201, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred creating a new completed assessment {e}", "completed_assessments", 400)


@bp.route('/completed_assessment', methods = ['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def update_completed_assessment():
    try:
        completed_assessment_id = request.args.get("completed_assessment_id")

        updated_completed_assessment = None

        if(completed_assessment_id):
            updated_completed_assessment = replace_completed_assessment(request.json, completed_assessment_id)

        else:
            updated_completed_assessment = create_completed_assessment(request.json)

        return create_good_response(completed_assessment_schema.dump(updated_completed_assessment), 201, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred replacing completed_assessment {e}", "completed_assessments", 400)


class CompletedAssessmentSchema(ma.Schema):
    class Meta:
        fields = (
            'completed_assessment_id',
            'assessment_task_id',
            'assessment_task_name',
            'completed_by',
            'team_id',
            'team_name',
            'user_id',
            'first_name',
            'last_name',                                
            'initial_time',
            'done',
            'last_update',
            'rating_observable_characteristics_suggestions_data',
            'course_id',
            'rubric_id'
        )


completed_assessment_schema = CompletedAssessmentSchema()
completed_assessment_schemas = CompletedAssessmentSchema(many=True)
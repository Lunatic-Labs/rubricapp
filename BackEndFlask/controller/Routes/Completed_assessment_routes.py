from flask import request
from marshmallow import fields
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from models.assessment_task import get_assessment_task

from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check,
)

from models.completed_assessment import (
    get_completed_assessments,
    get_completed_assessment_by_course_id,
    create_completed_assessment,
    replace_completed_assessment,
    completed_assessment_exists,
    get_completed_assessment_count,
    fetch_average,
    toggle_individual_lock_status,
    lock_individual_assessment,
    unlock_individual_assessment,
)

from models.queries import (
    get_completed_assessment_by_ta_user_id,
    get_completed_assessment_with_team_name,
    get_completed_assessment_by_user_id,
    get_completed_assessment_with_user_name,
    get_course_total_students,
)

from models.assessment_task import get_assessment_tasks_by_course_id


@bp.route('/completed_assessment_toggle_lock', methods=['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def toggle_complete_assessment_lock_status():
    try:
        # Changed to accept completed_assessment_id for individual toggle
        completed_assessment_id = request.args.get('completed_assessment_id')
        
        if not completed_assessment_id:
            return create_bad_response(
                "completed_assessment_id is required", "completed_assessments", 400
            )
        
        # Get the locked status from query params
        locked_status = request.args.get('locked')
        
        if locked_status is None:
            return create_bad_response(
                "locked parameter is required", "completed_assessments", 400
            )
        
        # Convert string 'true'/'false' to boolean
        locked = locked_status.lower() == 'true'
        
        toggle_individual_lock_status(completed_assessment_id, locked)
        
        return create_good_response(None, 201, "completed_assessments")

    except Exception as e:
        return create_bad_response(
            f"An error occurred toggling CAT lock: {e}", "completed_assessments", 400
        )

@bp.route('/completed_assessment_lock', methods=['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def lock_complete_assessment():
    try:
        # Changed to accept completed_assessment_id for individual lock
        completed_assessment_id = request.args.get('completed_assessment_id')
        
        if not completed_assessment_id:
            return create_bad_response(
                "completed_assessment_id is required", "completed_assessments", 400
            )
        
        lock_individual_assessment(completed_assessment_id)
        
        return create_good_response(None, 201, "completed_assessments")

    except Exception as e:
        return create_bad_response(
            f"An error occurred locking a CAT: {e}", "completed_assessments", 400
        )

@bp.route('/completed_assessment_unlock', methods=['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def unlock_complete_assessment():
    try:
        # Changed to accept completed_assessment_id for individual unlock
        completed_assessment_id = request.args.get('completed_assessment_id')
        
        if not completed_assessment_id:
            return create_bad_response(
                "completed_assessment_id is required", "completed_assessments", 400
            )
        
        unlock_individual_assessment(completed_assessment_id)
        
        return create_good_response(None, 201, "completed_assessments")

    except Exception as e:
        return create_bad_response(
            f"An error occurred unlocking a CAT: {e}", "completed_assessments", 400
        )

@bp.route('/completed_assessment', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_all_completed_assessments():
    try:
        # only_course is a marker parameter that prevents requests intended for routes
        #  below from hitting this route

        if request.args and request.args.get("course_id") and request.args.get("only_course") == "true":
            course_id = int(request.args.get("course_id"))
            all_completed_assessments = get_completed_assessment_by_course_id(course_id)
            assessment_tasks = get_assessment_tasks_by_course_id(course_id)

            result = []
            for task in assessment_tasks:
                completed_count = get_completed_assessment_count(task.assessment_task_id)
                completed_assessments = [ca for ca in all_completed_assessments if ca.assessment_task_id == task.assessment_task_id]

                result.append({
                    'assessment_task_id': task.assessment_task_id,
                    'assessment_task_name': task.assessment_task_name,
                    'completed_count': completed_count,
                    'unit_of_assessment': task.unit_of_assessment,
                    'completed_assessments': completed_assessment_schemas.dump(completed_assessments) if completed_assessments else []
                })
            return create_good_response(result, 200, "completed_assessments")

        if request.args and request.args.get("course_id") and request.args.get("role_id"):
            # if the args have a role id, then it is a TA so it should return their completed assessments

            course_id = int(request.args.get("course_id"))

            user_id = request.args.get("user_id")

            completed_assessments_task_by_user = get_completed_assessment_by_ta_user_id(course_id, user_id)

            return create_good_response(completed_assessment_schemas.dump(completed_assessments_task_by_user), 200, "completed_assessments")

        if request.args and request.args.get("course_id") and request.args.get("user_id"):
            if request.args.get("assessment_id"):
                course_id = request.args.get("course_id")

                assessment_id = request.args.get("assessment_id")

                course_total = get_course_total_students(course_id, assessment_id)

                return create_good_response(course_total, 200, "completed_assessments")
            else:
                course_id = int(request.args.get("course_id"))

                user_id = request.args.get("user_id")

                completed_assessments_task_by_user = get_completed_assessment_by_user_id(course_id, user_id)

                return create_good_response(completed_assessment_schemas.dump(completed_assessments_task_by_user), 200, "completed_assessments")

        if request.args and request.args.get("assessment_task_id") and request.args.get("unit"):
            assessment_task_id = int(request.args.get("assessment_task_id"))
            unit = request.args.get("unit")

            get_assessment_task(assessment_task_id)  # Trigger an error if not exists.

            if (unit == "team"):
                completed_assessments = get_completed_assessment_with_team_name(assessment_task_id)
            else:
                completed_assessments = get_completed_assessment_with_user_name(assessment_task_id)

            completed_count = get_completed_assessment_count(assessment_task_id)
            result = [
                {**completed_assessment_schema.dump(assessment), 'completed_count': completed_count}
                for assessment in completed_assessments
            ]
            return create_good_response(result, 200, "completed_assessments")

        if request.args and request.args.get("assessment_task_id"):
            assessment_task_id = int(request.args.get("assessment_task_id"))

            get_assessment_task(assessment_task_id)  # Trigger an error if not exists.
            completed_assessments = get_completed_assessment_with_team_name(assessment_task_id)

            if not completed_assessments:
                completed_assessments = get_completed_assessment_with_user_name(assessment_task_id)

            completed_count = get_completed_assessment_count(assessment_task_id)
            result = [
                {**completed_assessment_schema.dump(assessment), 'completed_count': completed_count}
                for assessment in completed_assessments
            ]
            return create_good_response(result, 200, "completed_assessments")

        if request.args and request.args.get("completed_assessment_task_id"):
            completed_assessment_task_id = int(request.args.get("completed_assessment_task_id"))
            one_completed_assessment = get_completed_assessment_with_team_name(completed_assessment_task_id)
            return create_good_response(completed_assessment_schema.dump(one_completed_assessment), 200, "completed_assessments")

        all_completed_assessments = get_completed_assessments()
        return create_good_response(completed_assessment_schemas.dump(all_completed_assessments), 200, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all completed assessments: {e}", "completed_assessments", 400)

@bp.route('/completed_assessment', methods = ['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_completed_assessment_by_team_or_user_id():
    try:
        completed_assessment_id = request.args.get("completed_assessment_id")
        unit = request.args.get("unit")
        if not completed_assessment_id:
            return create_bad_response("No completed_assessment_id provided", "completed_assessments", 400)

        if unit == "team":
            one_completed_assessment = get_completed_assessment_with_team_name(completed_assessment_id)
        elif unit == "user":
            one_completed_assessment = get_completed_assessment_with_user_name(completed_assessment_id)
        else:
            create_bad_response("Invalid unit provided", "completed_assessments", 400)
        return create_good_response(completed_assessment_schema.dump(one_completed_assessment), 200, "completed_assessments")
    except Exception as e:
        return create_bad_response(f"An error occurred fetching a completed assessment: {e}", "completed_assessments", 400)

@bp.route('/completed_assessment', methods = ['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def add_completed_assessment():
    try:
        assessment_data = request.json
        team_id = int(assessment_data["team_id"])
        if (team_id == -1):
            assessment_data["team_id"] = None
        assessment_task_id = int(request.args.get("assessment_task_id"))
        user_id = int(assessment_data["user_id"])
        if (user_id == -1):
            assessment_data["user_id"] = None

        completed = completed_assessment_exists(team_id, assessment_task_id, user_id)

        if completed:
            completed = replace_completed_assessment(assessment_data, completed.completed_assessment_id)
        else:
            completed = create_completed_assessment(assessment_data)

        return create_good_response(completed_assessment_schema.dump(completed), 201, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred creating a new completed assessment {e}", "completed_assessments", 400)


@bp.route('/completed_assessment', methods = ['PUT'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def update_completed_assessment():
    try:
        assessment_data = request.json
        team_id = int(assessment_data["team_id"])
        if (team_id == -1):
            assessment_data["team_id"] = None
        user_id = int(assessment_data["user_id"])
        if (user_id == -1):
            assessment_data["user_id"] = None
        
        completed_assessment_id = request.args.get("completed_assessment_id")

        updated_completed_assessment = None

        if(completed_assessment_id):
            updated_completed_assessment = replace_completed_assessment(assessment_data, completed_assessment_id)

        else:
            updated_completed_assessment = create_completed_assessment(assessment_data)

        return create_good_response(completed_assessment_schema.dump(updated_completed_assessment), 201, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred replacing completed_assessment {e}", "completed_assessments", 400)

#----------------------------------------
# gets the average of all completed
# assessment task into an array
#----------------------------------------
@bp.route('/average', methods=['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_average():
    try:
        if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            all_completed_assessments = get_completed_assessment_by_course_id(course_id)
            assessment_tasks = get_assessment_tasks_by_course_id(course_id)

            result = fetch_average(assessment_tasks, all_completed_assessments)
            return create_good_response(result, 200, "average")
    except Exception as e:
        return create_bad_response(f"An error occurred when gathering the average: {e}", "average", 400)


class CompletedAssessmentSchema(ma.Schema):
    completed_assessment_id = fields.Integer()
    assessment_task_id      = fields.Integer()
    assessment_task_name    = fields.String()
    completed_by            = fields.Integer()
    team_id                 = fields.Integer()
    team_name               = fields.String()
    user_id                 = fields.Integer()
    first_name              = fields.String()
    last_name               = fields.String()
    initial_time            = fields.DateTime()
    done                    = fields.Boolean()
    locked                  = fields.Boolean()
    last_update             = fields.DateTime()
    rating_observable_characteristics_suggestions_data = fields.Dict()
    course_id               = fields.Integer()
    rubric_id               = fields.Integer()
    completed_count         = fields.Integer()


completed_assessment_schema = CompletedAssessmentSchema()
completed_assessment_schemas = CompletedAssessmentSchema(many=True)
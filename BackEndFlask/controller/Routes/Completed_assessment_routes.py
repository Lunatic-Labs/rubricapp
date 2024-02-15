from flask import request
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from models.assessment_task import get_assessment_task
from controller.security.customDecorators import AuthCheck, badTokenCheck
from models.completed_assessment import (
    get_completed_assessments,
    get_completed_assessments_by_assessment_task_id,
    get_completed_assessment,
    get_completed_assessment_by_course_id,
    create_completed_assessment,
    replace_completed_assessment,
    completed_assessment_exists
)
from models.queries import get_users_by_team_id, send_teams_and_students_email_to_view_completed_assessment_feedback
from models.utility import email_students_feedback_is_ready_to_view
from models.team import get_team

@bp.route('/completed_assessment', methods = ['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def get_all_completed_assessments():
    try:
        if request.args and request.args.get("assessment_task_id"):
            assessment_task_id = int(request.args.get("assessment_task_id"))

            get_assessment_task(assessment_task_id)  # Trigger an error if not exists.

            completed_assessments_by_assessment_task_id = get_completed_assessments_by_assessment_task_id(assessment_task_id)

            return create_good_response(completed_assessment_schemas.dump(completed_assessments_by_assessment_task_id), 200, "completed_assessments")

        if request.args and request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            all_completed_assessments = get_completed_assessment_by_course_id(course_id)

            return create_good_response(completed_assessment_schemas.dump(all_completed_assessments), 200, "completed_assessments")

        all_completed_assessments=get_completed_assessments()

        return create_good_response(completed_assessment_schemas.dump(all_completed_assessments), 200, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving all completed assessments: {e}", "completed_assessments", 400)


@bp.route('/completed_assessment', methods = ['GET'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def get_one_completed_assessment():
    try:
        _id = request.args.get("completed_assessment_task_id")
        one_completed_assessment = get_completed_assessment(_id)

        return create_good_response(completed_assessment_schema.dump(one_completed_assessment), 200, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred fetching completed_assessment: {e}" "completed_assessments", 400)


@bp.route('/completed_assessment', methods = ['POST'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def add_completed_assessment():
    try:
        team_id = int(request.args.get("team_id"))

        assessment_task_id = int(request.args.get("assessment_task_id"))

        user_id = int(request.args.get("user_id"))

        completed = completed_assessment_exists(team_id, assessment_task_id, user_id)

        if completed:
            completed = replace_completed_assessment(request.json, completed.completed_assessment_id)
        else:
            completed = create_completed_assessment(request.json)

        # NOTE: Will need this to create a route to send notification
        # will need to delete after the new route is created
        # new route will need student id and team id and course id
        # team id to start
        if completed.team_id is not None:
            email_students_feedback_is_ready_to_view(
                get_users_by_team_id(
                    get_team(completed.team_id)
                )
            )

        return create_good_response(completed_assessment_schema.dump(completed), 201, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred creating a new completed assessment {e}", "completed_assessments", 400)

# NOTE: Currently working on this route
@bp.route('/completed_assessment', methods = ['PUT'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def send_feedback():
    try:
        assessment_task_id = request.args.get("assessment_task_id")
        list_of_completed_assessments = get_completed_assessments_by_assessment_task_id(assessment_task_id)

        return list_of_completed_assessments

    except Exception as e:
        return create_bad_response(f"An error occurred replacing completed_assessment {e}", "completed_assessments", 400)


@bp.route('/completed_assessment', methods = ['PUT'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
def update_completed_assessment():
    try:
        completed_assessment_id = request.args.get("completed_assessment_id")

        updated_completed_assessment = replace_completed_assessment(request.json, completed_assessment_id)


        # NOTE: Will need this to create a route to send notification
        # will need to delete after the new route is created
        # new route will need student id and team id
        # team id to start
        if updated_completed_assessment.team_id is not None:
            email_students_feedback_is_ready_to_view(
                get_users_by_team_id(
                    get_team(updated_completed_assessment.team_id)
                )
            )

        return create_good_response(completed_assessment_schema.dump(updated_completed_assessment), 201, "completed_assessments")

    except Exception as e:
        return create_bad_response(f"An error occurred replacing completed_assessment {e}", "completed_assessments", 400)

class Completed_Assessment_Schema(ma.Schema):
    class Meta:
        fields = (
            'completed_assessment_id',
            'assessment_task_id',
            'team_id',
            'user_id',
            'initial_time',
            'done',
            'last_update',
            'rating_observable_characteristics_suggestions_data'
        )

completed_assessment_schema = Completed_Assessment_Schema()
completed_assessment_schemas = Completed_Assessment_Schema(many=True)

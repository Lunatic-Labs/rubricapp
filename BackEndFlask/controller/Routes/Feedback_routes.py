from flask import request
from models.feedback import *
from controller import bp
from controller.Route_response import *
from datetime import datetime
from flask_jwt_extended import jwt_required
from marshmallow import fields
from controller.security.CustomDecorators import AuthCheck, bad_token_check

from core import db


@bp.route("/feedback", methods=["POST"])
@jwt_required()
@bad_token_check()
@AuthCheck()
def create_new_feedback():
    """
    Description:
        Creates a new Feedback record for a completed assessment.
        This endpoint is intended for any workflow where feedback
        needs to be stored explicitly (e.g., instructor-authored
        feedback, backfilling data, etc.).

    Transport:
        JSON body, passed directly through to create_feedback().
        The JSON must contain whatever fields the underlying
        models.feedback.create_feedback() function expects, for
        example:

            {
                "user_id": 1,
                "team_id": 10,                    # optional / nullable
                "completed_assessment_id": 42,
                ...                               # any other feedback fields
            }

        If feedback_time is not provided in the JSON, the server
        will set it to the current time.

    Returns:
        200 OK with the created Feedback serialized by
        StudentFeedbackSchema, or 400 on error.
    """
    try:
        payload = request.json or {}

        # If the caller did not provide a feedback_time, use
        # the current server time in the same string format
        # used elsewhere in the app.
        if "feedback_time" not in payload or payload["feedback_time"] is None:
            string_format = "%Y-%m-%dT%H:%M:%S.%fZ"
            payload["feedback_time"] = datetime.now().strftime(string_format)

        # Delegate creation to the model-layer helper.
        feedback = create_feedback(payload)

        return create_good_response(
            student_feedback_schema.dump(feedback),
            200,
            "feedbacks",
        )

    except Exception as e:
        return create_bad_response(
            f"An error occurred creating feedback: {e}",
            "feedbacks",
            400,
        )


class StudentFeedbackSchema(ma.Schema):
    feedback_id = fields.Integer()
    user_id = fields.Integer()
    team_id = fields.Integer()
    completed_assessment_id = fields.Integer()
    feedback_time = fields.DateTime()
    # lag_time is not stored directly by this route, but can be
    # computed by other parts of the system (see Rating_routes)
    # and attached to Feedback instances before serialization.
    lag_time = fields.DateTime()


student_feedback_schema = StudentFeedbackSchema()
student_feedbacks_schema = StudentFeedbackSchema(many=True)

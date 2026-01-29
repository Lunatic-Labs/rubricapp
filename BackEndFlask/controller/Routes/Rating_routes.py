from flask import request
from marshmallow import fields
from models.feedback import *
from controller import bp
from controller.Route_response import *
from models.completed_assessment import *
from models.queries import get_individual_ratings, get_team_ratings
from flask_jwt_extended import jwt_required

from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check,
)

# We also rely on datetime imported via models.completed_assessment.*
# and ma coming from models.feedback.*


def output(x):
    # kept for debugging if you still want it
    with open("ap.txt", "a") as out:
        print(x, file=out)


def _compute_lag(feedback_time, baseline_time):
    """
    Safely compute feedback_time - baseline_time and return a human-readable string,
    or None if either value is missing or invalid.
    """
    if feedback_time and baseline_time:
        try:
            delta = feedback_time - baseline_time
            total_seconds = int(delta.total_seconds())

            if total_seconds < 0:
                return "0s"

            days = total_seconds // 86400
            hours = (total_seconds % 86400) // 3600
            minutes = (total_seconds % 3600) // 60
            seconds = total_seconds % 60

            if days > 0:
                return f"{days}d {hours}h {minutes}m {seconds}s"
            if hours > 0:
                return f"{hours}h {minutes}m {seconds}s"
            if minutes > 0:
                return f"{minutes}m {seconds}s"
            return f"{seconds}s"
        except Exception:
            return None
    return None


@bp.route("/rating", methods=["GET"])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_ratings():
    """
    Description:
        Given the id of an assessment task, returns rating information.

        Query parameters:
            - assessment_task_id (required, int)
            - team_id (optional; if present, treat the task as a TEAM task)

        Behavior:
            • TEAM (team_id present):
                Returns one row per team member. Each row looks like:
                    {
                        "team_id": int,
                        "team_name": str,
                        "rating_observable_characteristics_suggestions_data": {...},
                        "first_name": str | None,
                        "last_name": str | None,
                        "lag_time": str | None
                    }

                lag_time is computed as:
                    Feedback.feedback_time - AssessmentTask.notification_sent
                and will be None if feedback has not been viewed yet.

            • INDIVIDUAL (no team_id):
                Returns one row per student. Each row looks like:
                    {
                        "first_name": str,
                        "last_name": str,
                        "rating_observable_characteristics_suggestions_data": {...},
                        "lag_time": str | None
                    }

                lag_time is computed as:
                    Feedback.feedback_time - CompletedAssessment.last_update
    """
    try:
        # Validate assessment_task_id
        assessment_task_id_raw = request.args.get("assessment_task_id")
        if assessment_task_id_raw is None:
            return create_bad_response(
                "assessment_task_id query parameter is required.",
                "ratings",
                400,
            )

        try:
            assessment_task_id = int(assessment_task_id_raw)
        except ValueError:
            return create_bad_response(
                "assessment_task_id must be an integer.",
                "ratings",
                400,
            )

        team_flag = request.args.get("team_id")

        # Fetch notification_sent for both team and individual branches
        from models.assessment_task import get_assessment_task
        at_obj = get_assessment_task(assessment_task_id)
        notification_sent_time = getattr(at_obj, "notification_sent", None)

        # --- TEAM RATINGS BRANCH ---
        if team_flag:

            ratings = get_team_ratings(assessment_task_id)

            if not ratings:
                return create_good_response([], 200, "ratings")

            result = []
            for row in ratings:
                # Expected shape from get_team_ratings:
                # 0: Team.team_id
                # 1: Team.team_name
                # 2: CompletedAssessment.rating_observable_characteristics_suggestions_data
                # 3: Feedback.feedback_time
                # 4: CompletedAssessment.last_update (submission time)
                # 5: Feedback.feedback_id
                # 6: User.first_name
                # 7: User.last_name
                team_id_val = row[0]
                team_name = row[1]
                rating_data = row[2]
                feedback_time = row[3]
                submission_time = row[4]  # kept for shape consistency, not used here
                first_name = row[6] if len(row) > 6 else None
                last_name = row[7] if len(row) > 7 else None

                # For teams we care about time from notification_sent -> feedback_time.
                baseline_time = notification_sent_time
                lag_time_str = _compute_lag(feedback_time, baseline_time)

                result.append(
                    {
                        "team_id": team_id_val,
                        "team_name": team_name,
                        "rating_observable_characteristics_suggestions_data": rating_data,
                        "first_name": first_name,
                        "last_name": last_name,
                        "lag_time": lag_time_str,
                        "notification_sent": notification_sent_time is not None,
                    }
                )

        # --- INDIVIDUAL RATINGS BRANCH ---
        else:
            ratings = get_individual_ratings(assessment_task_id)

            if not ratings:
                return create_good_response([], 200, "ratings")

            result = []
            for row in ratings:
                # Expected shape from get_individual_ratings:
                # 0: User.first_name
                # 1: User.last_name
                # 2: CompletedAssessment.rating_observable_characteristics_suggestions_data
                # 3: Feedback.feedback_time
                # 4: CompletedAssessment.last_update (submission time)
                # 5: Feedback.feedback_id
                first_name = row[0]
                last_name = row[1]
                rating_data = row[2]
                feedback_time = row[3]
                submission_time = row[4]

                # For individuals, keep the original behavior: feedback_time - submission_time
                lag_time_str = _compute_lag(feedback_time, submission_time)

                result.append(
                    {
                        "first_name": first_name,
                        "last_name": last_name,
                        "rating_observable_characteristics_suggestions_data": rating_data,
                        "lag_time": lag_time_str,
                        "notification_sent": notification_sent_time is not None,
                    }
                )

        return create_good_response(result, 200, "ratings")

    except Exception as e:
        return create_bad_response(
            f"An error occurred retrieving ratings: {e}",
            "ratings",
            400,
        )
@bp.route("/rating", methods=["POST"])
@jwt_required()
@bad_token_check()
@AuthCheck()
def student_view_feedback():
    """
    Description:
        Creates an entry in the Feedback table for that student and that
        completed assessment.

    Parameters (transport):
        - JSON body:
            completed_assessment_id: int
            team_id: int | null (only for team assessments)
            (any other feedback fields supported by create_feedback)
        - Querystring:
            user_id (automatically appended by the frontend via cookies)
    """
    try:
        payload = request.json or {}
        user_id = request.args.get("user_id")

        if user_id is None:
            return create_bad_response(
                "user_id query parameter is required.",
                "feedbacks",
                400,
            )

        completed_assessment_id = payload.get("completed_assessment_id")
        if completed_assessment_id is None:
            return create_bad_response(
                "completed_assessment_id is required in the JSON body.",
                "feedbacks",
                400,
            )

        team_id = payload.get("team_id")

        # Do not create duplicates for the same user + completed assessment
        exists = check_feedback_exists(user_id, completed_assessment_id)
        if exists:
            return create_bad_response(
                "Using server's existing data as source of truth.",
                "feedbacks",
                409,
            )

        feedback_data = dict(payload)
        feedback_data["user_id"] = user_id
        feedback_data["team_id"] = team_id if team_id is not None else None

        # Use server time as the feedback_time stamp
        string_format = "%Y-%m-%dT%H:%M:%S.%fZ"
        feedback_data["feedback_time"] = datetime.now().strftime(string_format)

        feedback = create_feedback(feedback_data)

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


student_feedback_schema = StudentFeedbackSchema()
student_feedbacks_schema = StudentFeedbackSchema(many=True)
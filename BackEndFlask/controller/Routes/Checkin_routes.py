from flask import request
from marshmallow import fields
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check
from models.checkin import *
from controller import bp
from controller.Route_response import *
from enums.http_status_codes import HttpStatus
from core import red
from models.assessment_task import get_assessment_task

from models.queries import (
    get_all_checkins_for_assessment,
    get_all_checkins_for_student_for_course
)

CHECK_IN_REDIS_CHANNEL = "check_in_updated"

@bp.route('/checkin', methods = ['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def checkin_user():
    # needs json with AT id, user id, and team id
    try:
        user_id = request.args.get("user_id")
        assessment_task_id = request.args.get("assessment_task_id")
        team_id = request.args.get("team_id")
        provided_password = request.json.get("password", "") if request.json else ""

        is_switching_teams = already_checked_in(user_id, assessment_task_id)
        if is_switching_teams:
            assessment_task = get_assessment_task(assessment_task_id)
            
            # Validate password if the assessment task has one set
            if assessment_task and assessment_task.create_team_password:
                if provided_password != assessment_task.create_team_password:
                    return create_bad_response(
                        "Incorrect team password. Please contact your instructor if you need to switch teams.", 
                        "checkin", 
                        403
                    )

        new_checkin = {}
        new_checkin["user_id"] = user_id
        new_checkin["assessment_task_id"] = assessment_task_id
        new_checkin["team_number"] = team_id

        if is_switching_teams: 
            update_checkin(new_checkin)
        else:
            create_checkin(new_checkin)
        
        red.publish(CHECK_IN_REDIS_CHANNEL, assessment_task_id)

        return create_good_response(new_checkin, 200, "checkin")

    except Exception as e:
        return create_bad_response(f"An error occurred checking in user: {e}", "checkin", 400)

@bp.route('/checkin', methods = ['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_checked_in():
    # given an asessment task id, return checked in information
    try:
        if request.args and request.args.get("course_id") and request.args.get("user_id"):
            course_id = int(request.args.get("course_id"))

            user_id = int(request.args.get("user_id"))

            assessment_task_ids = get_all_checkins_for_student_for_course(user_id, course_id)

            return create_good_response(assessment_task_ids, 200, "checkin")

        assessment_task_id = int(request.args.get("assessment_task_id"))

        checkins = get_all_checkins_for_assessment(assessment_task_id)

        return create_good_response(checkins_schema.dump(checkins), 200, "checkin")

    except Exception as e:
        return create_bad_response(f"An error occurred getting checked in user {e}", "checkin", 400)

@bp.route('/checkin_events', methods = ['POST']) 
@jwt_required()
@bad_token_check()
@AuthCheck()
def checkin_to_assessment():
    """
    Called by a Student/TA views to checkin to a specific assessement task.

    Args:
        assessment_task_id (int): Assessment task that they are logged into.
        is_team (bool): Is the caller a team member or a single user for the assessment task.
        user_id (int): The user id who made the call.
    """
    try:
        user_id = int(request.args.get("user_id"))
        assessment_task_id = int(request.args.get("assessment_task_id"))
        is_team = True if request.args.get("is_team") == "true" else False
        team_number = find_checkin_team_number(assessment_task_id, user_id) if is_team else 0

        filters = {
            'assessment_task_id':assessment_task_id,
            'is_team':is_team
        }
        filters['team_or_user_id'] = team_number if is_team else user_id

        checkin_record = find_latest_team_user_checkin(**filters)

        if checkin_record:
            update_checkin_to_server_time(checkin_record)
        else:
            create_checkin({
                'assessment_task_id': assessment_task_id,
                'user_id': user_id,
                'team_number': team_number,
            })

        return create_good_response("Checkin Created/Updated", HttpStatus.CREATED.value, "checkin")
    except Exception as e:
        return create_bad_response(f"Error with checkin: {e}", HttpStatus.BAD_REQUEST.value, "checkin")

@bp.route('/checkin_events', methods = ['GET']) 
@jwt_required()
@bad_token_check()
@AuthCheck()
def check_checkedin():
    """
    Called by Admins/teachers views to get who is logged in for a specific requested assessment task.

    Args:
        assessment_task_id (int): Assessment task that the client wishes to get info of.
    """
    try:
        assessment_task_id = int(request.args.get("assessment_task_id"))
        checkins = fetch_checkins_for_at_within_hr(assessment_task_id)

        return create_good_response(checkins_schema.dump(checkins), HttpStatus.OK.value, "checkin")
    except Exception as e:
        return create_bad_response(f"Error with polling: {e}", HttpStatus.BAD_REQUEST.value, "checkin")


class CheckinSchema(ma.Schema):
    checkin_id          = fields.Integer()        
    assessement_task_id = fields.Integer()                 
    team_number         = fields.Integer()         
    user_id             = fields.Integer()     
    time                = fields.DateTime()

checkin_schema = CheckinSchema()
checkins_schema = CheckinSchema(many=True)
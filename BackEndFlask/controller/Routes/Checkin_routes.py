import json
import gevent.exceptions
from flask import request, stream_with_context
from requests import Timeout
import flask
import gevent
from marshmallow import fields
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check, admin_check
from models.checkin import *
from controller import bp
from controller.Route_response import *
from enums.http_status_codes import HttpStatus
from models.queries import is_admin_by_user_id
from core import red, app

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

        new_checkin = {}
        new_checkin["user_id"] = user_id
        new_checkin["assessment_task_id"] = assessment_task_id
        new_checkin["team_number"] = request.args.get("team_id")

        if already_checked_in(user_id, assessment_task_id): 
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
def checkin_to_assessmet():
    """
    Called by student/TA views to log that they are checked into a specific assessement task.

    Args:
        user_id (int): The user who called the route.
        assessment_task_id (int): Assessment task that they are logged into.
    """
    try:
        user_id = int(request.args.get("user_id"))
        assessment_task_id = int(request.args.get("assessment_task_id"))



        return create_good_response("Ping", "checkin", HttpStatus.CREATED.value)
    except Exception as e:
        return create_bad_response(f"Error with checkin: {e}", "checkin", HttpStatus.BAD_REQUEST.value)

@bp.route('/checkin_events', methods = ['GET']) 
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def check_checkedin():
    """
    Called by Admins/teachers views to get who is logged in for a specific requested assessment task.

    Args:
        user_id (int): The user who called the route.
        assessment_task_id (int): Assessment task that the client wishes to get info of.
    """
    try:
        user_id = int(request.args.get("user_id"))
        assessment_task_id = int(request.args.get("assessment_task_id"))



        return create_good_response("Ping", "checkin", HttpStatus.OK.value)
    except Exception as e:
        return create_bad_response(f"Error with polling: {e}", "checkin", HttpStatus.BAD_REQUEST.value)


class CheckinSchema(ma.Schema):
    checkin_id          = fields.Integer()        
    assessement_task_id = fields.Integer()                 
    team_number         = fields.Integer()         
    user_id             = fields.Integer()     
    time                = fields.DateTime()

checkin_schema = CheckinSchema()
checkins_schema = CheckinSchema(many=True)

import json

import gevent.exceptions
from flask import request, stream_with_context
from requests import Timeout
import flask
import gevent
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check
from models.checkin import *
from controller import bp
from controller.Route_response import *
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

@bp.route('/checkin_events', methods = ['GET']) 
@jwt_required()
@bad_token_check()
@AuthCheck()
def stream_checked_in_events():
    """
        Description: Establishes SSE connection to stream checkin events.

        Parameters:
        assesment_task_id: <class int>(The id of an AT)

        Returns:
        <class 'str'>(Response of either new info or terminated connection)

        Exceptions:
            TypeError, ValueError : possible parameter error or json functions failing
            ConnectionError: Redis had an issue
            Exception: There was some other unexpected problem
    """
    try:

        assessment_task_id = int(request.args.get("assessment_task_id"))
        
        #collects data and serializes it to the proper format.
        def encode_message():
            with app.app_context():
                checkins = get_all_checkins_for_assessment(assessment_task_id)
                checkins_json = json.dumps(checkins_schema.dump(checkins))
                return f"data: {checkins_json}\n\n"
        
        # Keeps checking to see if there are any updates.
        def check_in_stream():
            with red.pubsub() as pubsub:
                pubsub.subscribe(CHECK_IN_REDIS_CHANNEL)
                yield encode_message() #Initial msg sent out to the client.
                gevent.sleep(0)
                for msg in pubsub.listen():
                    if msg["type"] == "message" and str(msg["data"]) == str(assessment_task_id):
                        yield encode_message()
                    gevent.sleep(3.0) # Pasued to save system resources.
                    gevent.idle()     # Hands control to other same priority requests first.

        gevent.sleep(0) # Yielding control to other coroutines.
        return flask.Response(check_in_stream(), mimetype="text/event-stream", status=200)
    except (TypeError, ValueError) as e:
        return create_bad_response(f"Potential encoding error {e}", "checkin", 400)
    except ConnectionError as e:
        return create_bad_response(f"Interupted redis connection {e}", "checkin", 400)
    except Exception as e:
        return create_bad_response(f"An error occurred getting checked in user {e}", "checkin", 400)
    

class CheckinSchema(ma.Schema):
    class Meta:
        fields = (
            'checkin_id',
            'assessment_task_id',
            'team_number',
            'user_id',
            'time'
        )
checkin_schema = CheckinSchema()
checkins_schema = CheckinSchema(many=True)
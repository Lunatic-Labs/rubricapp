import json
from flask import request, stream_with_context
from requests import Timeout
import flask
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check
from models.checkin import *
from controller import bp
from controller.Route_response import *
from core import red, app

import asyncio

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


# NOTE: This is async so that it does not block other routes since this one is a SSE.
@bp.route('/checkin_events', methods = ['GET']) 
@jwt_required()
@bad_token_check()
@AuthCheck()
async def stream_checked_in_events():
    """
    Description: Establishes SSE connection to stream checkin events.

    Parameters:
    assesment_task_id: <class int>(The id of an AT)
    
    Returns:
    <class 'str'>(Response of either new info or terminated connection)

    Exceptions:
        Timeout - due to server terminating a connection thats been inactive for too long
        OverflowError - json.dump being given too much
        TypeError - incorrect data for json.dump
        asyncio.CancelledError - client closed the connection
    """

    try:
        assessment_task_id = int(request.args.get("assessment_task_id"))
        queue =  asyncio.Queue()

        # Async code to query and encode a msg.
        async def encode_message():
            with app.app_context():
                checkins = get_all_checkins_for_assessment(assessment_task_id)
                checkins_json = json.dumps(checkins_schema.dump(checkins))
                return f"data: {checkins_json}\n\n"
            
        # Adds data to the queue
        async def redis_listener():
            pubsub = red.pubsub() 
            pubsub.subscribe(CHECK_IN_REDIS_CHANNEL)
            await queue.put(await encode_message())
            for message in pubsub.listen(): 
                if message["type"] == "message" and str(message["data"]) == str(assessment_task_id): 
                    encoded_message = await encode_message() 
                    await queue.put(encoded_message) 
                await asyncio.sleep(5.0) # Non-blocking sleep to save system resources.

        # Async code to keep viewing the stream of info and update client.
        async def check_in_stream():
            while True:
                message = await queue.get()
                yield message

        # Wrapper to make async_generator into a standard itterable for the response.
        def sync_generator():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                loop.create_task(redis_listener())
                async_gen = check_in_stream()
                while True:
                    yield loop.run_until_complete(async_gen.__anext__())
            except StopAsyncIteration:
                pass
            finally:
                loop.close()

        return flask.Response(sync_generator(), mimetype="text/event-stream", status=200)
    
    except Timeout as e:
        return create_bad_response(f"Connection closed by server {e}", "checkin", 400)
    except OverflowError as e:
        return create_bad_response(f"Overflow {e}", "checkin", 400)
    except TypeError as e:
        return create_bad_response(f"Possible serialization issue {e}", "checkin", 400)
    except asyncio.CancelledError as e:
        return create_bad_response(f"Connection closed by client {e}", "checkin", 400)
    except Exception as e:
        return create_bad_response(f"An error occurred getting checked in user {e}", "checkin", 400)

#@bp.route('/checkin_events', methods = ['GET']) 
#@jwt_required()
#@bad_token_check()
#@AuthCheck()
#def stream_checked_in_events():
#    #might need to change how we approach this code and it make it slightly more sse compliant\
#    #that woudl require modifiying the front end as well.
#    try:
#        assessment_task_id = int(request.args.get("assessment_task_id"))
#        #collects data and serializes it to the proper format.
#        def encode_message():
#            with app.app_context():
#                checkins = get_all_checkins_for_assessment(assessment_task_id)
#                checkins_json = json.dumps(checkins_schema.dump(checkins))
#                return f"data: {checkins_json}\n\n"
#        
#        def check_in_stream():
#            with red.pubsub() as pubsub:
#                pubsub.subscribe(CHECK_IN_REDIS_CHANNEL)
#                yield encode_message() #Initial msg sent out to the client.
#                for msg in pubsub.listen():
#                    # we hang here till time out leading to timeouts and infinate loading in form.js
#                    if msg["type"] == "message" and str(msg["data"]) == str(assessment_task_id):
#                        yield encode_message()
#                    sleep(3.0) # The seconds are needed to not block other requests.
#                    #testing needed to determin where the sleep timeout should be.
#        return flask.Response(check_in_stream(), mimetype="text/event-stream", status=200)
#
#    except Exception as e:
#        return create_bad_response(f"An error occurred getting checked in user {e}", "checkin", 400)

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
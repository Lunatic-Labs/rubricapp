from flask import request
from models.checkin import * 
from controller import bp
from controller.Route_response import *

@bp.route('/checkin', methods = ['POST'])
def checkin_user():
    # needs json with AT id, user id, and team id 
    try:
        new_checkin = {}
        new_checkin["user_id"] = request.args.get("user_id")
        new_checkin["assessment_task_id"] = request.args.get("assessment_task_id")
        new_checkin["team_number"] = request.args.get("team_id")

        checkin = create_checkin(new_checkin)

        return create_good_response(checkin_schema.dump(checkin), 200, "checkin")
    except Exception as e: 
        return create_bad_response(f"An error occurred checking in user: {e}", "checkin")

@bp.route('/checkin', methods = ['GET'])
def get_checked_in(): 
    # given an asessment task id, return checked in information 
    try: 
        assesment_task_id = request.args.get("assessment_task_id")
        checkins = get_checkins_by_assessment(assesment_task_id)

        return create_good_response(checkins_schema.dump(checkins), 200, "checkin")
    except Exception as e: 
        return create_bad_response(f"An error occurred getting checked in user {e}", "checkin")

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
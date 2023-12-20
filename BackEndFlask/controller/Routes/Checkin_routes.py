from flask import request
from models.checkin import * 
from controller import bp
from controller.Route_response import *

@bp.route('/checkin', methods = ['POST'])
def checkin_user():
    # needs json with AT id, user id, and team id 
    # is safe to assume that required args exist 
    new_checkin = {}
    new_checkin["user_id"] = request.args.get("user_id")
    new_checkin["assessment_task_id"] = request.args.get("assessment_task_id")
    new_checkin["team_number"] = request.args.get("team_id")
    checkin = create_checkin(new_checkin)

    if type(checkin) == str: 
        print(f"[Checkin_routes /checkin POST] An error occurred checking in user: {new_checkin['user_id']}")
        createBadResponse("An error occurred creating checkin!")
        return response
    
    print(f"[Checkin_routes /checkin POST] Successfully created checkin: {new_checkin['user_id']}!")
    createGoodResponse(f"Successfully checked in user: {new_checkin['user_id']}!", checkin_schema.dump(checkin), 200, "checkin")
    return response

@bp.route('/checkin', methods = ['GET'])
def get_checked_in(): 
    # given an asessment task id, return checked in information 
    assesment_task_id = request.args.get("assessment_task_id")

    checkins = get_checkins_by_assessment(assesment_task_id)
    
    if type(checkins) == str: 
        print("[Checkin_routes /checkin GET] An error occurred getting checked in users")
        createBadResponse("An error occurred getting checked in users!")
        return response
    
    print(f"[Checkin_routes /checkin GET] Successfully got checked in users for {assesment_task_id}")
    createGoodResponse(f"Successfully got checked in users:", checkins_schema.dump(checkins), 200, "checkin")
    return response

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
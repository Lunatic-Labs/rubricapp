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
    try:

        if (request.json.get("team_id") is not None):
            team_id = request.json.get("team_id")

            user_id = request.args.get("user_id")

            completed_assessment_id = request.json.get("completed_assessment_id")

            exists = check_feedback_exists(user_id, completed_assessment_id)
            if exists:
                return create_bad_response(f"Feedback already exists", "feedbacks", 409)

            feedback_data = request.json

            feedback_data["team_id"] = team_id

            feedback_data["user_id"] = user_id

            feedback_data["lag_time"] = None

            feedback_data["feedback_time"] = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
            
            feedback = create_feedback(request.json)

            return create_good_response(student_feedback_schema.dump(feedback), 200, "feedbacks")

        else:
            user_id = request.args.get("user_id")

            completed_assessment_id = request.json.get("completed_assessment_id")

            exists = check_feedback_exists(user_id, completed_assessment_id)
            if exists: 
                return create_bad_response(f"Feedback already exists", "feedbacks", 409)

            feedback_data = request.json

            feedback_data["user_id"] = user_id
            
            feedback_data["team_id"] = None
            
            feedback_data["lag_time"] = None

            feedback_data["feedback_time"] = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
            
            feedback = create_feedback(request.json)

            return create_good_response(student_feedback_schema.dump(feedback), 200, "feedbacks")

    except Exception as e:
        return create_bad_response(f"An error occurred creating feedback: {e}", "feedbacks", 400)


class StudentFeedbackSchema(ma.Schema):
    feedback_id             = fields.Integer()    
    user_id                 = fields.Integer()
    team_id                 = fields.Integer()
    completed_assessment_id = fields.Integer()                
    feedback_time           = fields.DateTime()      
    lag_time                = fields.DateTime()

student_feedback_schema = StudentFeedbackSchema()
student_feedbacks_schema = StudentFeedbackSchema(many=True)
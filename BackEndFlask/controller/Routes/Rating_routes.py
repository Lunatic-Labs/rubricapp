from flask import request
from marshmallow import fields
from models.feedback import *
from controller import bp
from flask import request
from controller.Route_response import *
from models.completed_assessment import *
from models.queries import get_individual_ratings
from flask_jwt_extended import jwt_required

from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check,
)

@bp.route("/rating", methods=["GET"])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_student_individual_ratings():
    """
        Description:
        Given an the id of an individual assessment task, gets all the students who completed it, their ratings,
        and the lag time for them to view their feedback. 
    """
    try:
        assessment_task_id = int(request.args.get("assessment_task_id"))

        student_ratings = get_individual_ratings(assessment_task_id)
        if student_ratings == None: return create_good_response([], 200, "ratings")

        result = {} 
        result = []
        for rating in student_ratings:
            feedback_time = rating[3]
            submission_time = rating[4]
            
            if feedback_time is not None and submission_time is not None: 
                lag_time = feedback_time - submission_time
            else: 
                lag_time = None

            data = {}
            data['first_name'] = rating[0]
            data['last_name'] = rating[1]
            data['rating_observable_characteristics_suggestions_data'] = rating[2]
            data['lag_time'] = str(lag_time) if lag_time is not None else None
            
            result.append(data)

        return create_good_response(result, 200, "ratings")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving ratings: {e}", "ratings", 400)


@bp.route("/rating", methods=["POST"])
@jwt_required()
@bad_token_check()
@AuthCheck()
def student_view_feedback(): 
    """
    Description:
        Creates an entry in the Feedback table for that student and that completed assessment.
    Parameters:
        user_id: <class 'str'>(The user's ID whos feedback time will be created)
        completed_assessment_id = <class 'str'>(Desired CAT_ID to modify the feedback for)
    Exceptions:
       Errors that the database can raise. 
    """
    try:
        user_id = request.args.get("user_id")
        completed_assessment_id = request.json.get("completed_assessment_id")
        
        exists = check_feedback_exists(user_id, completed_assessment_id)
        if exists:
            return create_bad_response(f"Using server's existing data as source of truth.", "feedbacks", 409)    
        
        feedback_data = request.json
        feedback_data["user_id"] = user_id
        string_format ='%Y-%m-%dT%H:%M:%S.%fZ'
        feedback_data["feedback_time"] = datetime.now().strftime(string_format)
        feedback = create_feedback(feedback_data)
        return create_good_response(student_feedback_schema.dump(feedback), 200, "feedbacks")
    except Exception as e:
        return create_bad_response(f"An error occurred creating feedback: {e}", "feedbacks", 400)

class StudentFeedbackSchema(ma.Schema):
    feedback_id             = fields.Integer()     
    user_id                 = fields.Integer() 
    completed_assessment_id = fields.Integer()                 
    feedback_time           = fields.DateTime()

student_feedback_schema = StudentFeedbackSchema()
student_feedbacks_schema = StudentFeedbackSchema(many=True)

from flask import request
from models.feedback import *
from controller import bp
from flask import request
from controller.Route_response import *
from models.completed_assessment import *
from models.queries import get_individual_ratings

@bp.route("/rating", methods=["GET"])
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
def student_view_feedback(): 
    """
        Description:
        Given a user_id and completed_assessment_id creates an entry in the Feedback table
        for that student and that completed assessment. Currently only stores the time of creation,
        used to calculate lag time. 
    """
    try: 
        user_id = request.json["user_id"]
        completed_assessment_id = request.json["completed_assessment_id"]

        exists = check_feedback_exists(user_id, completed_assessment_id)
        if exists: 
            return create_bad_response(f"Feedback already exists", "feedbacks", 409)    

        feedback_data = request.json
        feedback_data["feedback_time"] = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
        feedback = create_feedback(request.json)

        return create_good_response(student_feedback_schema.dump(feedback), 200, "feedbacks")
    
    except Exception as e:
        return create_bad_response(f"An error occurred creating feedback: {e}", "feedbacks", 400)

class StudentFeedbackSchema(ma.Schema):
    class Meta:
        fields = (
            'feedback_id',
            'user_id',
            'completed_assessment_id',
            'feedback_time',
            'lag_time'
        )

student_feedback_schema = StudentFeedbackSchema()
student_feedbacks_schema = StudentFeedbackSchema(many=True)
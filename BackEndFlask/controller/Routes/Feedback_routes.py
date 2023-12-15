from models.feedback import *
# from models.completed_assessment import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from datetime import datetime

@bp.route("/feedback", methods=["POST"])
def create_new_feedback(): 
    # given completed_assessment_id and user_id, create feedback entry
    user_id = request.json["user_id"]
    completed_assessment_id = request.json["completed_assessment_id"]
    
    feedback_data = request.json 
    feedback_data["lag_time"] = None
    
    feedback_data["feedback_time"] = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
    feedback = create_feedback(request.json)
    if feedback == str: 
        print(f"[ Feedback /feedback POST] An error occurred creating feedback for completed_assessment_id: {completed_assessment_id} and user_id {user_id}")
        createBadResponse(f"An error occurred creatingfeedback for completed_assessment_id: {completed_assessment_id} and user_id: {user_id}!")
        return response
    createGoodResponse("Successfully retrieved all the individual feedback times!", student_feedback_schema.dump(feedback), 200, "feedback")
    return response
    
    

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
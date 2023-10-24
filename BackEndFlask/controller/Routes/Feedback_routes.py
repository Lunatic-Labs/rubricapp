from models.feedback import *
# from models.completed_assessment import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route("/feedback", methods=["GET"])
def get_feedback_time_per_student():
    # given a completed_assessment_id and a user_id
    # get the feedback time of the user per the completed_assessment_id
    user_id = request.json["user_id"]
    completed_assessment_id = request.json["completed_assessment_id"]
    student_feedback_time = get_feedback_time_by_user_id_and_completed_assessment_id(user_id, completed_assessment_id)
    if student_feedback_time == type(""):
        print(f"[ Feedback /feedback GET] An error occurred retrieving the feedback_time for completed_assessment_id: {completed_assessment_id} and user_id {user_id}")
        createBadResponse(f"An error occurred retrieving the feedback time for completed_assessment_id: {completed_assessment_id} and user_id: {user_id}!")
        return response
    print(student_feedback_time)
    createGoodResponse("Successfully retrieved all the individual feedback times!", student_feedback_schema.dump(student_feedback_time), 200, "feedback_time")
    return response

class StudentFeedbackSchema(ma.Schema):
    class Meta:
        fields = (
            # 'feedback_id',
            'user_id',
            # 'completed_assessment_id',
            'feedback_time'
        )

student_feedback_schema = StudentFeedbackSchema()
student_feedbacks_schema = StudentFeedbackSchema(many=True)
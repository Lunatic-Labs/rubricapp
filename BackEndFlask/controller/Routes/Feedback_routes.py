from models.feedback import *
from controller import bp
from controller.Route_response import *
from datetime import datetime


@bp.route("/feedback", methods=["POST"])
def create_new_feedback():
    try:
        # given completed_assessment_id and user_id, create feedback entry
        user_id = request.json["user_id"]
        completed_assessment_id = request.json["completed_assessment_id"]

        feedback_data = request.json
        feedback_data["lag_time"] = None
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
from models.completed_assessment import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *

@bp.route("/rating", methods=["GET"])
def get_student_individual_ratings():
    # given an AssessmentTask ID
    # get all the names of all individuals who completed it
    # and their CompletedAssessmentTasks
    try:
        assessment_task_id = int(request.args.get("assessment_task_id"))
        student_completed_assessment_tasks =  get_individual_completed_and_student(assessment_task_id)

        createGoodResponse("Successfully retrieved all individual ratings!",
                           name_ratings_schema.dump(student_completed_assessment_tasks),
                           200, "ratings")
        return response

    except Exception as e:
        createBadResponse(f"An error occurred retrieving all ratings for assessment_task_id: {assessment_task_id}!")
        return response


class NameRatingSchema(ma.Schema):
    class Meta:
        fields = (
            'first_name',
            'last_name',
            'rating_observable_characteristics_suggestions_data'
        )

name_rating_schema = NameRatingSchema()
name_ratings_schema = NameRatingSchema(many=True)

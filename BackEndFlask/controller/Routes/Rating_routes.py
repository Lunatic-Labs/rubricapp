from models.completed_assessment import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from datetime import datetime

@bp.route("/rating", methods=["GET"])
def get_student_individual_ratings(): 
    # given an AssessmentTask ID 
    # get all the names of all individuals who completed it
    # and their CompletedAssessmentTasks
    assessment_task_id = int(request.args.get("assessment_task_id"))
    if assessment_task_id == type(""):
        print(f"[ Rating /rating GET] An error occurred retrieving all ratings for assessment_task_id: {assessment_task_id}")
        createBadResponse(f"An error occurred retrieving all ratings for assessment_task_id: {assessment_task_id}!")
        return response
    student_completed_assessment_tasks =  get_individual_completed_and_student(assessment_task_id)
    if student_completed_assessment_tasks == type(""):
        print(f"[ Rating /rating GET] An error occurred retrieving all ratings for assessment_task_id: {assessment_task_id}")
        createBadResponse(f"An error occurred retrieving all ratings for assessment_task_id: {assessment_task_id}!")
        return response
    print(type(student_completed_assessment_tasks[0][4]))
    print(student_completed_assessment_tasks)
    date = student_completed_assessment_tasks[0][4]
    print(f"date: {date}")
    lag_time = datetime.now() - date
    print(f"lag time: {lag_time}")
    createGoodResponse("Successfully retrieved all individual ratings!", name_ratings_schema.dump(student_completed_assessment_tasks), 200, "ratings")
    return response

class NameRatingSchema(ma.Schema):
    class Meta:
        fields = (
            'first_name',
            'last_name',
            'rating_observable_characteristics_suggestions_data',
            'feedback_time',
            'last_update'
            # TODO: feedback time in here
        )

name_rating_schema = NameRatingSchema()
name_ratings_schema = NameRatingSchema(many=True)
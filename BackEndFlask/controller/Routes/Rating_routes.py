from models.completed_assessment import *
from models.feedback import *
from controller import bp
from flask_marshmallow import Marshmallow
from controller.Route_response import *
from datetime import datetime

"""
assessment_task_id = 5 shows all the data for rating!
"""

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
    print(type(student_completed_assessment_tasks[0][4]))
    print(type(student_completed_assessment_tasks[0][5]))
    print(student_completed_assessment_tasks)
    feedback = student_completed_assessment_tasks[0][3]
    submission = student_completed_assessment_tasks[0][4]
    lag = student_completed_assessment_tasks[0][5]
    print(f"feedback: {feedback}")
    print(f"submission: {submission}")
    lag_time = feedback - submission
    print(type(lag_time))
    new_lag_time = update_lag_time(lag_time, 1)
    print(f"lag time: {lag_time}")
    print(f"lag: {lag}")
    print(f"new_lag_time: {new_lag_time}")
    student_completed_assessment_tasks2 =  get_individual_completed_and_student(assessment_task_id)
    if student_completed_assessment_tasks2 == type(""):
        print(f"[ Rating /rating GET] An error occurred retrieving all ratings for assessment_task_id: {assessment_task_id}")
        createBadResponse(f"An error occurred retrieving all ratings for assessment_task_id: {assessment_task_id}!")
        return response

    createGoodResponse("Successfully retrieved all individual ratings!", name_ratings_schema.dump(student_completed_assessment_tasks2), 200, "ratings")
    return response

class NameRatingSchema(ma.Schema):
    class Meta:
        fields = (
            'first_name',
            'last_name',
            'rating_observable_characteristics_suggestions_data',
            'feedback_time',
            'last_update',
            'lag_time'
        )

name_rating_schema = NameRatingSchema()
name_ratings_schema = NameRatingSchema(many=True)
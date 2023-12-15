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
    completed =  get_individual_completed_and_student(assessment_task_id)
    completed = list(completed)
    
    feedback = completed[3]
    submission = completed[4]
    lag_time = completed[5]
    feedback_id = completed[6]
    
    if lag_time is None: 
        lag_time = feedback - submission 
        update_lag_time(lag_time, feedback_id)
        
    data = {}
    data['first_name'] = completed[0]
    data['last_name'] = completed[1]
    data['rating_observable_characteristics_suggestions_data'] = completed[2]
    data['lag_time'] = str(lag_time)
    createGoodResponse("Successfully retrieved all individual ratings!", name_rating_schema.dump(data), 200, "ratings")
    return response

class NameRatingSchema(ma.Schema):
    class Meta:
        fields = (
            'first_name',
            'last_name',
            'rating_observable_characteristics_suggestions_data',
            'lag_time'
        )

name_rating_schema = NameRatingSchema()
name_ratings_schema = NameRatingSchema(many=True)
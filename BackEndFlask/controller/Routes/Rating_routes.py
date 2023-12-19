from models.completed_assessment import *
from models.feedback import *
from controller import bp
from flask import request
from controller.Route_response import *


@bp.route("/rating", methods=["GET"])
def get_student_individual_ratings():
    # given an AssessmentTask ID
    # get all the names of all individuals who completed it
    # and their CompletedAssessmentTasks
    try:
        assessment_task_id = int(request.args.get("assessment_task_id"))
        student_completed_assessment_tasks = get_individual_completed_and_student(
            assessment_task_id)

        completed = get_individual_completed_and_student(assessment_task_id)
    
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

        return create_good_response(name_rating_schema.dump(data), 200, "ratings")

    except Exception as e:
        return create_bad_response(f"An error occurred retrieving ratings {e}", "ratings")



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

#----------------------------------------------------------------------------------------------------
# Developer: Aldo Vera-Espinoza
# Date: 14 November, 2024
# File Purpose: 
#   Functions to create a csv file for (ocs and sfis) and ratings for a given assessment task.
#----------------------------------------------------------------------------------------------------
from flask import request
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from Functions.exportCsv import create_csv_strings
from models.assessment_task import get_assessment_task
from models.user import get_user

from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check, 
    admin_check
)

@bp.route('/csv_assessment_export', methods = ['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
def get_completed_assessment_csv() -> dict:
    """
    Description:
    Creates a csv according to the desired format.

    Parameter:
    assessment_task_id: int (desired at_id)
    format: int (desired data and format for the csv)
    
    Return:
    Response dictionary and possibly the file.
    """
    try:
        assessment_task_id = request.args.get("assessment_task_id")
        format = request.args.get("format")
    
        if format == None: raise ValueError("Format should be an int.")
        format = int(format)

        get_assessment_task(assessment_task_id)    # Trigger an error if not exists

        user_id = request.args.get("user_id")

        get_user(user_id)   # Trigger an error if not exist

        csv_data = create_csv_strings(assessment_task_id, format)
        
        return create_good_response({ "csv_data": csv_data.strip() }, 200, "csv_creation")

    except Exception as e:
        return create_bad_response(f"An error occurred attempting to generate the desired file: {e}", "csv_creation", 400)

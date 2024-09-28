#----------------------------------------------------------------------------------------------------
# Developer: Aldo Vera-Espinoza
# Date: 8 May, 2024
# File Purpose: 
#   Creates a way for the front end to ask for a csv file and get a properly filled
#   csv sent back.
#----------------------------------------------------------------------------------------------------

import os
import json
import pandas as pd
from flask import request
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check
from Functions.exportCsv import create_csv
from models.assessment_task import get_assessment_task
from models.user import get_user


@bp.route('/csv_assessment_export', methods = ['GET'])
@jwt_required()
@bad_token_check()
@AuthCheck()
def get_completed_assessment_csv() -> dict:
    """
    Description:
    Creates a csv that has the following info
    in this order respectively.

    Parameter:
    assessment_task_id: int
    
    Return:
    Response dictionary and possibly the file.
    """
    try:
        assessment_task_id = request.args.get("assessment_task_id")

        assessment = get_assessment_task(assessment_task_id)    # Trigger an error if not exists

        user_id = request.args.get("user_id")

        user = get_user(user_id)   # Trigger an error if not exist

        file_name = user.first_name + "_"

        file_name += user.last_name + "_"

        file_name += assessment.assessment_task_name.replace(" ", "_") + ".csv"

        create_csv(
            assessment_task_id,
            file_name
        )

        csv_data = None

        with open("./tempCsv/" + file_name) as fp:
            csv_data = fp.read()
        
        return create_good_response({ "csv_data": csv_data.strip() }, 200, "csv_creation")

    except Exception as e:
        return create_bad_response(f"An error occurred attempting to generate the desired file: {e}", "csv_creation", 400)

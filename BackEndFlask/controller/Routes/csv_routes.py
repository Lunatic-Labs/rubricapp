#----------------------------------------------------------------------------------------------------
# Developer: Aldo Vera-Espinoza
# Date: 8 May, 2024
# File Purpose: 
#   Creates a way for the front end to ask for a csv file and get a properly filled
#   csv sent back.
#----------------------------------------------------------------------------------------------------
from flask import request
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
from controller.security.CustomDecorators import AuthCheck, bad_token_check
from Functions.exportCsv import create_csv
import os

@bp.route('/csv_assessment_export', methods = ['POST'])
#@jwt_required()
#@bad_token_check()
#@AuthCheck()
def get_completed_assessment_csv():
    """
    Description:
    Creates a csv that has the following info in this order respectively:
        AWAITING CLIENT CONFIRMATION

    Parameter:
    ALSO SUBJECT TO CHANGE
    file_name:str
    Assessment_task_Name:str
    
    Return:
    Response dictionary and possibly the file.
    """
    try:
        assessment_task_name = request.args.get("assessment_task_name")
        file_name = request.args.get("file_name")
        create_csv(assessment_task_name, file_name)
        return send_downloadable_file(os.path.abspath("./tempCsv/"+file_name), True)
    except Exception as e:
        return create_bad_response(f"An error occurred attempting to generate the desired file: {e}", "csv creation", 400)
#remember to delete the file after it has been given back to ensure we do not overfill
#the server.

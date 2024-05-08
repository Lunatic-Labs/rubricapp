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
from models.assessment_task import get_assessment_task
from controller.security.CustomDecorators import AuthCheck, bad_token_check
from Functions.exportCsv import create_csv

@bp.route('/csv_assessment_export', methods = ['POST'])
#@jwt_required()
#@bad_token_check()
#@AuthCheck()
def get_completed_assessment_csv():
    try:
        exit()
    except Exception as e:
        return create_bad_response(f"An error occured attempting to generate the desired file: {e}", "csv creation", 400)


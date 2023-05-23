from flask import jsonify, request, Response
from flask_login import login_required
from models.team import *
from models.team_user import *
from controller import bp
from flask_marshmallow import Marshmallow
from requests import *
import pandas as pd
import csv


response = {
    "contentType": "application/csv",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message,errorMessage):
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage

def createGoodResponse(message, file, status):
    JSON = {"csv": []}
    csvreader = csv.DictReader(file)
    for row in csvreader:
        JSON["csv"].append(row)
    
    response["status"] = status
    response["success"] = True
    response["message"] = message
    response["content"] = JSON
    JSON = {"csv": []}

@bp.route('/up', methods = ['GET'])
def upload_CSV():
    file = request.files['csv_file']
    if not file:
        print("[UploadCsv_routes /upload POST] No file !")
        createBadResponse("Unsuccessfully uploaded a .csv file!", "No file")
        return response
    
    try:
        df = pd.read_csv(file)
        print("CSV file is valid")
        print("[UploadCsv_routes /upload POST] Successfully uploaded a .csv file!")
        createGoodResponse("Successfully uploaded a .csv file!",file,200)
        return response
    
    except Exception as e:
        print("[UploadCsv_routes /upload POST] Not a .csv file!")
        createBadResponse("Unsuccessfully uploaded a .csv file!", e)
        return response
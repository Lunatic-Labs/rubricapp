from flask import jsonify, request, Response
from flask_login import login_required
from controller import bp
from flask_marshmallow import Marshmallow
from requests import Request
import pandas as pd
import csv
import json
from Functions import teamImport
from io import StringIO, BytesIO
import os
import shutil
#from controller.Route_response import *

response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message, errorMessage):
    JSON = {"csv": []}
    response["content"] = JSON
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + str(errorMessage)

def createGoodResponse(message, file, status):
    JSON = {"csv": []}
    JSON["csv"].append(file)
    response["status"] = status
    response["success"] = True
    response["message"] = message
    response["content"] = JSON
    JSON = {"csv": []}

@bp.route('/team_bulk_upload', methods = ['POST'])
def upload_team_csv():
    file = request.files['csv_file']
    if not file:
        print("[Team_bulk_upload /team_bulk_upload POST] Unsuccessfully uploaded a .csv file! No file!")
        createBadResponse("Unsuccessfully uploaded a .csv file!", "No file selected!")
        return response
    extension = os.path.splitext(file.filename)
    if(extension[1]!= ".csv"):
        print("[Team_bulk_upload /team_bulk_upload POST] Unsuccessfully uploaded a .csv file! Wrong Format")
        createBadResponse("Unsuccessfully uploaded a .csv file!", "Wrong Format")
        return response
    try:
        directory = os.path.join(os.getcwd(), "Test")
        os.makedirs(directory, exist_ok=True)
        file_path = os.path.join(directory, file.filename)
        file.save(file_path)
        result = teamImport.teamcsvToDB(file_path,3,1)
        
        if isinstance(result, str):
            shutil.rmtree(directory)
            print("[UploadCsv_routes /upload POST] Unsuccessfully uploaded a .csv file! Error Raised!")
            createBadResponse("Unsuccessfully uploaded a .csv file!", result)
            return response
        shutil.rmtree(directory)
        
        file.seek(0,0)
        file_data = file.read()
        df = pd.read_csv(BytesIO(file_data))
        headers = df.columns
        print(len(headers))
        df.columns = ["team_name", "ta_email", "student1", "student2", "student3", "student4"]
        df.loc[len(df.index)] = headers
        results = json.loads(df.to_json(orient="records"))
        file.seek(0,0)

        print("[UploadCsv_routes /upload POST] Successfully uploaded a .csv file!")
        createGoodResponse("Successfully uploaded a .csv file!",results,200)
        return response
    except Exception:
        pass

    #insert into InstructorTaCourse (owner_id,ta_id,course_id) values (3,3,1);
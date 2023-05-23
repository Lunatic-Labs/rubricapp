from flask import jsonify, request, Response
from flask_login import login_required
from controller import bp
from flask_marshmallow import Marshmallow
from requests import Request
import pandas as pd
import csv
import json
from bulkupload import studentImport
from io import StringIO, BytesIO
import os
import shutil


response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5000, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def createBadResponse(message,errorMessage):
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

@bp.route('/upload', methods = ['POST'])
def upload_CSV():
    file = request.files['csv_file']
    if not file:
        print("[UploadCsv_routes /upload POST] No file!")
        createBadResponse("Unsuccessfully uploaded a .csv file!", "No file selected!")
        return response
    
    try:
        directory = os.path.join(os.getcwd(), "bulkupload", "csv_route_test")
        os.makedirs(directory, exist_ok=True)
        file_path = os.path.join(directory, file.filename)
        file.save(file_path)
        
        studentImport.studentcsvToDB(file_path)
        shutil.rmtree(directory)

        file.seek(0,0)
        file_data = file.read()
        df = pd.read_csv(BytesIO(file_data))
        results = json.loads(df.to_json(orient="records"))
        file.seek(0,0)

        print("[UploadCsv_routes /upload POST] Successfully uploaded a .csv file!")
        createGoodResponse("Successfully uploaded a .csv file!",results,200)

        return response
    
    except Exception as e:
        print("[UploadCsv_routes /upload POST] Error Raised")
        createBadResponse("Unsuccessfully uploaded a .csv file!", e)
        return response
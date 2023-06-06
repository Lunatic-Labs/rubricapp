from flask import jsonify, request, Response
from flask_login import login_required
from controller import bp
from flask_marshmallow import Marshmallow
from requests import Request
import pandas as pd
import csv
import json
from Functions import studentImport
from io import StringIO, BytesIO
import os
import shutil
from controller.Route_response import createBadResponse, createGoodResponse, response

@bp.route('/student_bulk_upload', methods = ['POST'])
def upload_CSV():
    file = request.files['csv_file']
    if not file:
        print("[UploadCsv_routes /upload POST] Unsuccessfully uploaded a .csv file! No file!")
        createBadResponse(f"Unsuccessfully uploaded a .csv file!", str("No file selected!"),"students")
        return response
    extension = os.path.splitext(file.filename)
    if(extension[1]!= ".csv"):
        print("[UploadCsv_routes /upload POST] Unsuccessfully uploaded a .csv file! Wrong Format")
        createBadResponse("Unsuccessfully uploaded a .csv file!", "Wrong Format","students")
        return response
    try:
        directory = os.path.join(os.getcwd(), "Test")
        os.makedirs(directory, exist_ok=True)
        file_path = os.path.join(directory, file.filename)
        file.save(file_path)
        result = studentImport.studentcsvToDB(file_path,1,1)
        if isinstance(result, str):
            shutil.rmtree(directory)
            print("[UploadCsv_routes /upload POST] Unsuccessfully uploaded a .csv file! Error Raised!")
            createBadResponse("Unsuccessfully uploaded a .csv file!", str(result),"students")
            return response
        shutil.rmtree(directory)
        
        file.seek(0,0)
        file_data = file.read()
        df = pd.read_csv(BytesIO(file_data))
        headers = df.columns
        df.columns = ["Student","lms_id", "email"]
        df.loc[len(df.index)] = headers
        results = json.loads(df.to_json(orient="records"))
        file.seek(0,0)
            
        print("[UploadCsv_routes /upload POST] Successfully uploaded a .csv file!")
        createGoodResponse("Successfully uploaded a .csv file!",results,200,"students")
        return response
    except Exception:
        pass
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
        createBadResponse(f"Unsuccessfully uploaded a .csv file!", "No file selected!", "students")
        return response
    extension = os.path.splitext(file.filename)
    if(extension[1]!= ".csv" and extension[1] != ".xlsx"):
        print("[UploadCsv_routes /upload POST] Unsuccessfully uploaded a .csv file! Wrong Format")
        createBadResponse("Unsuccessfully uploaded a .csv or .xlsx file!", "Wrong Format", "students")
        return response
    
    if request.args.get("course_id"):
        course_id = int(request.args.get("course_id"))
        try:
            directory = os.path.join(os.getcwd(), "Test")
            os.makedirs(directory, exist_ok=True)
            file_path = os.path.join(directory, file.filename)
            file.save(file_path)
            result = studentImport.studentcsvToDB(file_path, 2, course_id)

            if (result != "Upload Successful!"):
                shutil.rmtree(directory)
                print(f"[UploadCsv_routes /upload POST] Unsuccessfully uploaded a {extension[1]} file! Error Raised!")
                createBadResponse(f"Unsuccessfully uploaded a {extension[1]} file!", str(result), "students")
                return response
            shutil.rmtree(directory)
            
            file.seek(0,0)
            file_data = file.read()
            if extension[1] == ".csv":
                df = pd.read_csv(BytesIO(file_data))
            else:
                df = pd.read_excel(BytesIO(file_data))
            
            headers = df.columns
            df.columns = ["Student","lms_id", "email"]
            df.loc[len(df.index)] = headers
            results = json.loads(df.to_json(orient="records"))
            file.seek(0,0)
                
            print(f"[UploadCsv_routes /upload POST] Successfully uploaded a {extension[1]} file!")
            createGoodResponse(f"Successfully uploaded a {extension[1]} file!", results, 200, "students")
            return response
        except Exception:
            pass
    else:
        createBadResponse(f"Unsuccessfully uploaded a file!", "Course_id was not passed.", "students")
        return response, response.get("status")

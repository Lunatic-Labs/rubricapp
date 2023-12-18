from flask import jsonify, request, Response
from controller import bp
from flask_marshmallow import Marshmallow
import pandas as pd
import csv
import json
from Functions import teamImport
from io import StringIO, BytesIO
import os
import shutil
from controller.Route_response import *

@bp.route('/team_bulk_upload', methods = ['POST'])
def upload_team_csv():
    try:
        file = request.files['csv_file']
        if not file:
            print("[Team_bulk_upload /team_bulk_upload POST] Unsuccessfully uploaded a .csv or .xlsx file! No file!")
            createBadResponse("Unsuccessfully uploaded a .csv or .xlsx file!", "No file selected!", "team")
            return response
        extension = os.path.splitext(file.filename)
        if(extension[1]!= ".csv" and extension[1]!= ".xlsx"):
            print("[Team_bulk_upload /team_bulk_upload POST] Unsuccessfully uploaded a .csv or .xlsx file! Wrong Format")
            createBadResponse("Unsuccessfully uploaded a .csv or .xlsx file!", "Wrong Format", "team")
            return response

        if request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            directory = os.path.join(os.getcwd(), "Test")
            os.makedirs(directory, exist_ok=True)
            file_path = os.path.join(directory, file.filename)
            file.save(file_path)
            result = teamImport.teamcsvToDB(file_path, 2, course_id)

            if (result != "Upload successful!"):
                shutil.rmtree(directory)
                print(f"[UploadCsv_routes /upload POST] Unsuccessfully uploaded a {extension[1]} file! Error Raised!")
                createBadResponse(f"Unsuccessfully uploaded a {extension[1]} file!", str(result), "team")
                return response
            shutil.rmtree(directory)

            file.seek(0,0)
            file_data = file.read()
            if extension[1] == ".csv":
                df = pd.read_csv(BytesIO(file_data))
            else:
                df = pd.read_excel(BytesIO(file_data))

            headers = df.columns
            temp = []
            temp.append("team_name")
            for i in range(1, len(headers)):
                temp.append("email"+str(i))
            df.columns = temp
            df.loc[len(df.index)] = headers
            results = json.loads(df.to_json(orient="records"))
            file.seek(0,0)

            print(f"[UploadCsv_routes /upload POST] Successfully uploaded a {extension[1]} file!")
            createGoodResponse(f"Successfully uploaded a {extension[1]} file!", results, 200, "team")
            return response
        else:
            createBadResponse(f"Unsuccessfully uploaded a file!", "Course_id was not passed.", "students")
            return response, response.get("status")
    except Exception as e:
        createBadResponse(f"Unsuccessfully uploaded a file!", str(e), "team")
        return response, response.get("status")

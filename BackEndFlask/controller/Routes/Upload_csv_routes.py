import Functions.studentImport as studentImport
from controller.Route_response import *
from controller import bp
from flask import request
from io import BytesIO
import pandas as pd
import shutil
import json
import os

@bp.route('/studentbulkuploadcsv', methods = ['POST'])
def student_bulk_upload_csv():
    try:
        file = request.files['csv_file']
        directory = os.path.join(os.getcwd(), "Test")
        os.makedirs(directory, exist_ok=True)
        file_path = os.path.join(directory, file.filename)
        file.save(file_path)
        if(request.args and request.args.get("course_id") and request.args.get("owner_id")):
            try:
                int(request.args.get("course_id"))
                int(request.args.get("owner_id"))
            except TypeError as e:
                error = str(e.__dict__['orig'])
                print("[Upload_csv_routes /studentbulkuploadcsv POST] Invalid course_id or owner_id: ", error)
                createBadResponse("Invalid course_id or owner_id!", error, "studentbulkupload")
                return response
            result = studentImport.studentcsvToDB(file_path, request.args.get("owner_id"), request.args.get("course_id"))
            if result != "Upload Successful!":
                print("[Upload_csv_routes /studentbulkuploadcsv POST] An error occured Bulkuploading Students: ", result)
                createBadResponse("An error occurred bulkuploading Students!", result, "studentbulkupload")
                return response
            shutil.rmtree(directory)
            file.seek(0,0)
            file_data = file.read()
            df = pd.read_csv(BytesIO(file_data))
            results = json.loads(df.to_json(orient="records"))
            file.seek(0,0)
            print("[Upload_csv_routes /studentbulkuploadcsv POST] Successfully uploaded a .csv file!")
            createGoodResponse("Successfully uploaded a .csv file!", results, 200, "studentbulkupload")
            return response
        print("[Upload_csv_routes /studentbulkuploadcsv POST] Missing course_id or owner_id!")
        createBadResponse("Unsuccessfully uploaded a .csv file!", "Missing course_id or owner_id!", "studentbulkupload")
        return response
    except:
        error = "No file selected!"
        print("[Upload_csv_routes /studentbulkuploadcsv POST] Unsuccessfully uploaded a .csv file: ", error)
        createBadResponse("Unsuccessfully uploaded a .csv file!", error, "studentbulkupload")
        return response
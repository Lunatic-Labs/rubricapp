import os
import json
import shutil
import pandas as pd
from io import BytesIO
from flask import request
from controller import bp
from controller.Route_response import *
from flask_jwt_extended import jwt_required
import Functions.studentImport as studentImport
from controller.security.customDecorators import AuthCheck, badTokenCheck

@bp.route('/studentbulkuploadcsv', methods = ['POST'])
@jwt_required()
@badTokenCheck()
@AuthCheck()
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
                return create_bad_response("Invalid course_id or owner_id!", "studentbulkupload", 400)

            result = studentImport.studentcsvToDB(file_path, request.args.get("owner_id"), request.args.get("course_id"))

            if result != "Upload Successful!":
                return create_bad_response("An error occurred bulkuploading Students!", "studentbulkupload", 400)

            shutil.rmtree(directory)
            file.seek(0,0)
            file_data = file.read()
            df = pd.read_csv(BytesIO(file_data))
            results = json.loads(df.to_json(orient="records"))
            file.seek(0,0)
            return create_good_response([], results, 200, "studentbulkupload")

        return create_bad_response("Unsuccessfully uploaded a .csv file! Missing course_id or owner_id",

    except:
        return create_bad_response("No file selected", "studentbulkupload", 400)

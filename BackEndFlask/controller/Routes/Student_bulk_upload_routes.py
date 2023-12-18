from flask import jsonify, request, Response
from controller import bp
from flask_marshmallow import Marshmallow
import pandas as pd
import csv
import json
from Functions import studentImport
from io import StringIO, BytesIO
import os
import shutil
from controller.Route_response import *

@bp.route('/student_bulk_upload', methods = ['POST'])
def upload_CSV():
    try:
        file = request.files['csv_file']
        if not file:
            raise Exception("No file selected")
        extension = os.path.splitext(file.filename)
        if(extension[1]!= ".csv" and extension[1] != ".xlsx"):
           raise Exception("Wrong format")

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
                    raise Exception("Failed to uploaded " + str(result))
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

                return create_good_response(results, 200, "students")
            except Exception:
                pass
        else:
            raise Exception("Course_id not passed")
    except Exception as e:
        return create_bad_response(f"Failed to upload file: {e}", "students")

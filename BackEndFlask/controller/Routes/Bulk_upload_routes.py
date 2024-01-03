from flask import jsonify, request, Response
from controller import bp
from flask_marshmallow import Marshmallow
import pandas as pd
import csv
import json
# from Functions import studentImport
from Functions import genericImport
from io import StringIO, BytesIO
import os
import shutil
from controller.Route_response import create_bad_response, create_good_response

@bp.route('/bulk_upload', methods = ['POST'])
def upload_CSV():
    try:
        file = request.files['csv_file']
        if not file:
            return create_bad_response("Unsuccessfully uploaded a .csv file! No file selected.", "users", 400)
        extension = os.path.splitext(file.filename)
        if(extension[1]!= ".csv" and extension[1] != ".xlsx"):
            return create_bad_response(f"Unsuccessfully uploaded a {extension[1]} file! Wrong Format", "users", 400)

        if request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            try:
                directory = os.path.join(os.getcwd(), "Test")
                os.makedirs(directory, exist_ok=True)
                file_path = os.path.join(directory, file.filename)
                file.save(file_path)
                # result = studentImport.studentcsvToDB(file_path, 2, course_id)
                result = genericImport.genericcsv_to_db(file_path, 2, course_id)
                print(f'RESULT: {result}')

                if (result is not None):
                    shutil.rmtree(directory)
                    return create_bad_response(f"Unsuccessfully uploaded a {extension[1]} file! {str(result)}", "users", 400)
                # shutil.rmtree(directory)

                # file.seek(0,0)
                # file_data = file.read()
                # if extension[1] == ".csv":
                #     df = pd.read_csv(BytesIO(file_data))
                # else:
                #     df = pd.read_excel(BytesIO(file_data))

                # headers = df.columns
                # df.columns = ["Users","lms_id", "email"]
                # df.loc[len(df.index)] = headers
                # results = json.loads(df.to_json(orient="records"))
                # file.seek(0,0)
                return create_good_response([], 200, "users")

            except Exception as e:
                raise e
        else:
            response = create_bad_response(f"Unsuccessfully uploaded a file! Course_id was not passed.", "users", 400)
            return response, response.get("status")

    except Exception as e:
        return create_bad_response(f"An error occurred while uploading csv file: {e}", "users", 400)

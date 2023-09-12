from flask import request
from io import BytesIO
import os
import shutil

import pandas as pd
import json

from controller import bp
from Functions import studentImport
from controller.Route_response import createBadResponse, createGoodResponse, response


@bp.route('/generic_bulk_upload', methods=['POST'])
def upload_generic_CSV():
    """
    Endpoint for bulk uploading users/TAs.
    @return: controller.Route_response.response
    """
    file = request.files['csv_file']

    if not file:
        print("[UploadCsv_routes /upload POST] Unsuccessfully uploaded a .csv file! No file!")
        createBadResponse(f"Unsuccessfully uploaded a .csv file!", "No file selected!", "students")
        return response

    # NOTE: isn't this already implemented in the studentImport.studentcsvToDB()/genericImport.genericcsv_to_db()?
    extension = os.path.splitext(file.filename)
    if extension[1] != ".csv" and extension[1] != ".xlsx":
        print("[UploadCsv_routes /upload POST] Unsuccessfully uploaded a .csv file! Wrong Format")
        createBadResponse("Unsuccessfully uploaded a .csv or .xlsx file!", "Wrong Format", "students")
        return response
    # -----------------------------------------------------

    if request.args.get("course_id"):
        course_id = int(request.args.get("course_id"))
        try:
            directory = os.path.join(os.getcwd(), "Test")
            os.makedirs(directory, exist_ok=True)
            file_path = os.path.join(directory, file.filename)
            file.save(file_path)

            errmsg: str | None = studentImport.studentcsvToDB(file_path, 2, course_id)

            shutil.rmtree(directory)
            if errmsg is not None:
                print(f"[UploadCsv_routes /upload POST] Unsuccessfully uploaded a {extension[1]} file! Error Raised!")
                createBadResponse(f"Unsuccessfully uploaded a {extension[1]} file!", errmsg, "students")
                return response

            file.seek(0, 0)
            file_data = file.read()
            if extension[1] == ".csv":
                df = pd.read_csv(BytesIO(file_data))
            else:
                df = pd.read_excel(BytesIO(file_data))

            # TODO: passed this point
            headers = df.columns
            df.columns = ["Student", "lms_id", "email"]  # NOTE: not sure what this is for
            df.loc[len(df.index)] = headers
            results = json.loads(df.to_json(orient="records"))
            file.seek(0, 0)

            print(f"[UploadCsv_routes /upload POST] Successfully uploaded a {extension[1]} file!")
            createGoodResponse(f"Successfully uploaded a {extension[1]} file!", results, 200, "students")
            return response
        except Exception:
            pass
    else:
        createBadResponse(f"Unsuccessfully uploaded a file!", "Course_id was not passed.", "students")
        return response, response.get("status")

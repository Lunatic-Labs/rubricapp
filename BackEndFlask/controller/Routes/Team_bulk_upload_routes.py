import os
import json
import shutil
import pandas as pd
from io import BytesIO
from flask import request
from controller import bp
# from Functions import teamImport
from Functions import teamBulkUpload
from Functions import customExceptions
from controller.Route_response import *


@bp.route('/team_bulk_upload', methods=['POST'])
def upload_team_csv():
    try:
        file = request.files['csv_file']
        if not file:
            raise Exception("No file selected")

        extension = os.path.splitext(file.filename)

        if (extension[1] != ".csv" and extension[1] != ".xlsx"):
            raise Exception("Wrong format")

        if request.args.get("course_id"):
            course_id = int(request.args.get("course_id"))
            directory = os.path.join(os.getcwd(), "Test")
            os.makedirs(directory, exist_ok=True)
            file_path = os.path.join(directory, file.filename)
            file.save(file_path)

            user_id = int(request.args.get("user_id"))
            teamBulkUpload.team_bulk_upload(file_path, user_id, course_id)

            # if (result != "Upload successful!"):
            # if result != None:
            #     shutil.rmtree(directory)
            #     raise Exception("Failed to uploaded " + str(result))

            shutil.rmtree(directory)

            # file.seek(0, 0)
            # file_data = file.read()

            # if extension[1] == ".csv":
            #     df = pd.read_csv(BytesIO(file_data))
            # else:
            #     df = pd.read_excel(BytesIO(file_data))

            # headers = df.columns
            # temp = []
            # temp.append("team_name")

            # for i in range(1, len(headers)):
            #     temp.append("email"+str(i))

            # df.columns = temp
            # df.loc[len(df.index)] = headers
            # results = json.loads(df.to_json(orient="records"))
            # file.seek(0, 0)

            return create_good_response([], 200, "team")

        else:
            raise Exception("Course_id not passed!")

    except Exception as e:
        return create_bad_response(f"Error bulk uploading team: {e}", "team", 400)

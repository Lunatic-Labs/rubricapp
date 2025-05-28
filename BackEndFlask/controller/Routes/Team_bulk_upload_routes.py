import os
import uuid
import json
import shutil
import pandas as pd
from io import BytesIO
from flask import request
from controller import bp
# from Functions import team_import
from Functions import teamBulkUpload
from Functions import customExceptions
from controller.Route_response import *
from flask_jwt_extended import jwt_required

from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check,
    admin_check
)

def output(x, clear=False):
    flag = 'w' if clear else 'a'
    import threading
    current_thread_id = threading.current_thread().ident
    with open('ap.txt', flag) as out:
        print(f"{current_thread_id}: {x}", file=out)


@bp.route('/team_bulk_upload', methods=['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
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
            user_id = int(request.args.get("user_id"))

            output("hello")            

            directory = os.path.join(os.getcwd(), "Test")
            os.makedirs(directory, exist_ok=True)
            unique_filename = extension[0] + uuid.uuid4().hex + extension[1]
            file_path = os.path.join(directory, unique_filename)
            file.save(file_path)

            teamBulkUpload.team_bulk_upload(file_path, user_id, course_id)

            shutil.rmtree(directory)

            return create_good_response([], 200, "team")

        else:
            raise Exception("Course_id not passed!")

    except Exception as e:
        return create_bad_response(f"Error bulk uploading team: {str(e)}", "team", 400)
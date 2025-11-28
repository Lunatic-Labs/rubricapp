from flask import jsonify, request, Response
from controller import bp
from flask_marshmallow import Marshmallow
import pandas as pd
import csv
import json
from Functions import genericImport
from io import StringIO, BytesIO
import os
import shutil
from controller.Route_response import create_bad_response, create_good_response
from flask_jwt_extended import jwt_required
import uuid
from core import limiter

from controller.security.CustomDecorators import (
    AuthCheck, bad_token_check,
    admin_check
)

@bp.route('/bulk_upload', methods = ['POST'])
@jwt_required()
@bad_token_check()
@AuthCheck()
@admin_check()
@limiter.limit("1 per 3 seconds")
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

            user_id = int(request.args.get("user_id"))

            directory = os.path.join(os.getcwd(), "Test-" + uuid.uuid4().hex)

            os.makedirs(directory, exist_ok=True)

            file_path = os.path.join(directory, file.filename)

            file.save(file_path)

            genericImport.generic_csv_to_db(file_path, user_id, course_id)

            shutil.rmtree(directory)

            return create_good_response([], 200, "users")

        else:
            response = create_bad_response(f"Unsuccessfully uploaded a file! Course_id was not passed.", "users", 400)

            return response, response.get("status")

    except Exception as e:
        return create_bad_response(f"An error occurred while uploading csv file: {str(e)}", "users", 400)
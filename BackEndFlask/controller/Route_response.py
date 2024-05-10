from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
from flask import request
from flask import send_file
load_dotenv()
import os
from models.logger import logger 
import inspect
from core import app

ma = Marshmallow()


def __init_response() -> dict:
    response = {
        "contentType": "application/json",
        "Access-Control-Allow-Origin": f"http://127.0.0.1:5500, {os.environ.get('FRONT_END_URL')}, *",
        "Access-Control-Allow-Methods": ['GET', 'POST'],
        "Access-Control-Allow-Headers": "Content-Type",
        "headers": {}
    }

    return response


def create_bad_response(msg: str, content_type: str, status: int|None = None) -> dict:
    """
    Description:
    Creates a bad response.

    Parameters:
    msg: str: The message to be used in the response.
    content_type: str: The name of the resource returned.

    Returns:
    A dictionary for the response.
    """

    response = __init_response()

    JSON = {content_type: []}

    response['status'] = status if status else 500

    response["success"] = False

    response["message"] = f"An error occurred: {msg}"

    response["content"] = JSON

    logger.error(f"Bad response sent: user_id: {request.args.get('user_id')}, content type: {content_type}, msg: {msg}, status: {response['status']}, error raised from function: {inspect.stack()[1][3]}")

    return response


def create_good_response(whole_json: list[dict], status: int, content_type: str, jwt=None, refresh=None) -> dict:
    """
    Description:
    Creates a good response.

    Parameters:
    whole_json: list[dict]: List of fetch resources.
    status: int: Exit status.
    content_type: str: The name of the resource returned.

    Returns:
    A dictionary for the response.
    """
    response = __init_response()

    JSON = {content_type: []}

    response["status"] = status

    response["success"] = True

    JSON[content_type].append(whole_json)

    response["content"] = JSON

    if jwt is not None:
        response["headers"]["access_token"] = jwt

    if refresh is not None:
        response["headers"]["refresh_token"] = refresh

    JSON = {content_type: []}

    return response

def send_downloadable_file(file_location_name:str, deletion:bool=False) -> dict:
    """
    Description:
    Returns a file for the user to save.

    Parameters:
    file_location_name: str: should be an absolute path.
    deletion: bool: decision to remove the file once sent.

    Returns:
    Returns Bad response on any issue or returns the csv data on success.
    """
    
    if os.path.exists(file_location_name):
        try:
            #if deletion:
            #    os.remove(file_location_name)
            return send_file(file_location_name)
        except Exception as e:
            return create_bad_response(f"Unplanned for error: {e}", "Unaccounted for error", 400)
    return create_bad_response(f"Failed to find {file_location_name} to send", "File sending error.", 404)
        
"""
hold in memory
import io
import os

@app.route('/download')
def download_file():
    file_path = get_path_to_your_file()
    
    return_data = io.BytesIO()
    with open(file_path, 'rb') as fo:
        return_data.write(fo.read())
    # (after writing, cursor will be at last byte, so move it to start)
    return_data.seek(0)

    os.remove(file_path)

    return send_file(return_data, mimetype='application/pdf',
                     attachment_filename='download_filename.pdf')
"""
"""
@after-request operator in falsk but wont work for mac developers
"""
"""
threaded answer
import io
import os
from flask import send_file
from multiprocessing import Process

@app.route('/download')
def download_file():
    file_path = get_path_to_your_file()

    return_data = io.BytesIO()
    with open(file_path, 'rb') as fo:
        return_data.write(fo.read())
        return_data.seek(0)    

    background_remove(file_path)

    return send_file(return_data, mimetype='application/pdf',
                     attachment_filename='download_filename.pdf')


def background_remove(path):
    task = Process(target=rm(path))
    task.start()

    
def rm(path):
    os.remove(path)
"""
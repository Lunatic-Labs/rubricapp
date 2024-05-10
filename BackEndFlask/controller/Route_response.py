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

def send_downloadable_file(file_location_name:str, deletion:bool=False, cache_timeout:int=0) -> dict:
    """
    Description:
    Returns a file for the user to save.

    Parameters:
    file_location_name: str: should be an absolute path.
    deletion: bool: decision to remove the file once sent.
    cache_timeout: int: how long in seconds to keep a file cached so that less work is preformed.

    Returns:
    Returns Bad response on any issue or returns the csv data on success.
    """
    
    if os.path.exists(file_location_name):
        try:
            #sending a request to cron to delete the file
            
            return send_file(file_location_name, as_attachment=False, max_age=cache_timeout)
        except Exception as e:
            return create_bad_response(f"Unplanned for error: {e}", "Unaccounted for error", 400)
    return create_bad_response(f"Failed to find {file_location_name} to send", "File sending error.", 404)
        
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
from flask import request
load_dotenv()
import os
from models.logger import logger
import inspect

ma = Marshmallow()



def __init_response() -> dict:
    response = {
        "Access-Control-Allow-Origin": f"http://127.0.0.1:5500, {os.environ.get('FRONT_END_URL')}, *",
        "Access-Control-Allow-Methods": ['GET', 'POST'],
        "Access-Control-Allow-Headers": "Content-Type",
        "headers": {
            "Content-Type": "application/json",
        }
    }

    return response


def create_bad_response(msg: str, content_type: str, status: int|None = None) -> tuple[dict, int|None]:
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

    return response, response['status']


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

    return response, response['status']
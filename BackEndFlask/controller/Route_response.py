from flask_marshmallow import Marshmallow

ma = Marshmallow()


def __init_response() -> dict:
    response = {
        "contentType": "application/json",
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500, http://127.0.0.1:3000, *",
        "Access-Control-Allow-Methods": ['GET', 'POST'],
        "Access-Control-Allow-Headers": "Content-Type"
    }
    return response


def create_bad_response(msg: str, content_type: str) -> dict:
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
    response['status'] = 500
    response["success"] = False
    response["message"] = f"An error occurred: {msg}"
    response["content"] = JSON
    return response


def create_good_response(whole_json: list[dict], status: int, content_type: str) -> dict:
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
    JSON = {content_type: []}
    return response

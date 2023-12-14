from flask_marshmallow import Marshmallow

ma = Marshmallow()

# Soon to be deprecated.
response = {
    "contentType": "application/json",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500, http://127.0.0.1:3000, *",
    "Access-Control-Allow-Methods": ['GET', 'POST'],
    "Access-Control-Allow-Headers": "Content-Type"
}

def __init_response() -> dict:
    __response = {
        "contentType": "application/json",
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500, http://127.0.0.1:3000, *",
        "Access-Control-Allow-Methods": ['GET', 'POST'],
        "Access-Control-Allow-Headers": "Content-Type"
    }
    return __response


# TODO: Rename __response -> response once everything
#       has been refactored.
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
    _response = __init_response()
    JSON = {content_type: []}
    _response['status'] = 500
    _response["success"] = False
    _response["message"] = f"An error occurred: {msg}"
    _response["content"] = JSON
    return _response


# TODO: Rename __response -> response once everything
#       has been refactored.
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
    _response = __init_response()
    JSON = {content_type: []}
    _response["status"] = status
    _response["success"] = True
    JSON[content_type].append(whole_json)
    _response["content"] = JSON
    JSON = {content_type: []}
    return _response


# Soon to be deprecated
def createBadResponse(message, errorMessage, content_type):
    JSON = {content_type: []}
    response['status'] = 500
    response["success"] = False
    response["message"] = message + " " + errorMessage
    response["content"] = JSON

# Soon to be deprecated
def createGoodResponse(message, entire_JSON, status, content_type):
    JSON = {content_type: []}
    response["status"] = status
    response["success"] = True
    response["message"] = message
    JSON[content_type].append(entire_JSON)
    response["content"] = JSON
    JSON = {content_type: []}

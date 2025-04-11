#-------------------------------------------------------------------------
# The purpose of this file is to crate mock objects for google's 
# api so that at local host level we use fake objects and at a higher
# level we use the real api.
#
# Date Updated: Tue 08 Apr 2025 01:43:42 PM CDT
#-------------------------------------------------------------------------

import sys
from unittest.mock import MagicMock
from email_test_util import EmailConsts
import time
import importlib
import Functions

# NOTE: The sys functions are used to override the run time objects so all
# the other tests can also take advantage of these objects and logging.
# If undesired, comment out all of test_emails.py.

# Building blocks for checks on mock objects
#---------------------------------------------------------
def timeout_param(param):
    if param == "TIMEOUT":
        time.sleep(5)
        raise TimeoutError("Timed Out")
def param_check(param, correct_param):
    if param != correct_param:
        raise ValueError("Incorrect Params")
def flat_error(param):
    if param == "ERROR":
        raise Exception("Forced exception")
def error_param_type(param,list):
    for i in list:
        if isinstance(param,i):
            raise ValueError("Invalid type recived")

# Below are parameter and other function checks for mocks.
#---------------------------------------------------------   

def from_authorized_user_file_mock(token_fp, scopes) -> None:
    """ [USAGE]
    make token_fp == TIMEOUT leads to TimeoutError.
    make token_fp == ERROR to force an error.
    Wrong params lead to ValueError. 
    """
    timeout_param(token_fp)
    flat_error(token_fp)
    param_check(token_fp, EmailConsts.CORRECT_PATH_TO_TOKEN)
    param_check(scopes, EmailConsts.CORRECT_SCOPES)

def credentials_class_refresh_method_mock(object) -> None:
    timeout_param(object)
    flat_error(object)
    error_param_type(object, [str, int, list])

def build_param_mock(extension, ver, creds):
    param_check(extension, "email")
    param_check(ver, "ve1")
    param_check(creds.creds, EmailConsts.MOCKED_CREDS)

# Below are now the mock object creators.
#--------------------------------------------------------- 

def credentials_mock() -> None:
    """Replacing the Credentials class."""
    from google.oauth2.credentials import Credentials
    mock_creds = MagicMock()
    return_self = lambda i, j :(from_authorized_user_file_mock(i, j), mock_creds)[1]
    mock_creds.from_authorized_user_file.side_effect = return_self
    mock_creds.expired = True
    mock_creds.valid = True
    mock_creds.refresh_token = EmailConsts.MOCKED_REFRESH
    return_self = lambda i: (credentials_class_refresh_method_mock(i), mock_creds)[1]
    mock_creds.refresh = return_self
    mock_creds.creds = EmailConsts.MOCKED_CREDS
    sys.modules["google.oauth2.credentials"].Credentials = mock_creds

def request_mock() -> None:
    """Replacing the Request class."""
    from google.auth.transport.requests import Request
    mock_request = MagicMock()
    mock_request.Request = mock_request
    sys.modules["google.auth.transport.requests"] = mock_request

def build_service_mock() -> None:
    """Replacing the build function for the oauth service."""
    from googleapiclient.discovery import build
    mock_service = MagicMock()
    return_self = lambda x,y,z: (build_param_mock(x, y, z), mock_service)[1]
    mock_service.build = return_self
    sys.modules["googleapiclient.discovery.build"] = mock_service

def create_mock_email_objs() -> bool:
    """Takes commonly used objects and replaces them with the Mocked objects and its respective functions"""
    try:
        credentials_mock()
        request_mock()
        build_service_mock()

        # Forcing a cache reload so mock objects can take their place
        import core
        importlib.reload(core)

        return True
    except:
        return False
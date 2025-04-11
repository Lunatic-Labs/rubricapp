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
#---------------------------------------------------------   

def from_authorized_user_file_mock(token_fp, scopes):
    """ [USAGE]
    make token_fp == TIMEOUT leads to TimeoutError.
    make token_fp == ERROR to force an error.
    Wrong params lead to ValueError. 
    """
    timeout_param(token_fp)
    flat_error(token_fp)
    param_check(token_fp, EmailConsts.CORRECT_PATH_TO_TOKEN)
    param_check(scopes, EmailConsts.CORRECT_SCOPES)

def credentials_class_refresh_method_mock(object):
    timeout_param(object)
    flat_error(object)
    error_param_type(object, [str, int, list])

def create_mock_email_objs():
    """Takes commonly used objects and replaces them with the Mocked objects and its respective functions"""
    try:
        # Replacing the Credentials class.
        from google.oauth2.credentials import Credentials
        mock_creds = MagicMock()
        return_self = lambda i, j :(from_authorized_user_file_mock(i, j), mock_creds)[1]
        mock_creds.from_authorized_user_file.side_effect = return_self
        mock_creds.expired = True
        mock_creds.valid = True
        mock_creds.refresh_token = EmailConsts.MOCKED_REFRESH
        return_self = lambda i: (credentials_class_refresh_method_mock(i), mock_creds)[1]
        mock_creds.refresh = return_self
        sys.modules["google.oauth2.credentials"].Credentials = mock_creds

        # Replacing the Request class
        from google.auth.transport.requests import Request
        mock_request = MagicMock()
        mock_request.Request = mock_request
        sys.modules["google.auth.transport.requests"] = mock_request

        # Forcing a cache reload
        import core
        importlib.reload(core)
        return True
    except:
        return False
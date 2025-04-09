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
    return EmailConsts.MOCKED_CREDS

def credentials_class_refresh_method_mock(object, correct_obj):
    if not isinstance(object, correct_obj):
        raise ValueError("Make use Request was used")
    return True

def create_mock_email_objs():
    """Takes commonly used objects and replaces them with the Mocked objects and its respective functions"""
    try:
        # Replacing the Credentials class.
        from google.oauth2.credentials import Credentials
        mock_creds = MagicMock()
        mock_creds.from_authorized_user_file.side_effect = from_authorized_user_file_mock
        mock_creds.expired = False
        mock_creds.refresh_token = EmailConsts.MOCKED_REFRESH
        mock_creds.refresh = credentials_class_refresh_method_mock
        sys.modules["google.oauth2.credentials"].Credentials = mock_creds
        # Replacing the Request class
        from google.auth.transport.requests import Request

        return True
    except:
        return False
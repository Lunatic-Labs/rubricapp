#-------------------------------------------------------------------------
# The purpose of this file is to crate mock objects for google's 
# api so that at local host level we use fake objects and at a higher
# level we use the real api.
#
# Date Updated: Fri 11 Apr 2025 02:27:29 PM CDT
#-------------------------------------------------------------------------

import sys
from unittest.mock import MagicMock
from email_test_util import EmailConsts
import time
import importlib
import models

# NOTE: The sys functions are used to override the run time objects so all
# the other tests can also take advantage of these objects and logging.
# If undesired, comment out all of test_emails.py.

# Building blocks for checks on mock objects
#---------------------------------------------------------
def timeout_param(param) -> None:
    if param == "TIMEOUT":
        time.sleep(5)
        raise TimeoutError("Timed Out")
def param_check(param, expected_param) -> None:
    if param != expected_param:
        raise ValueError("Incorrect Params")
def flat_error(param) -> None:
    if param == "ERROR":
        raise Exception("Forced exception")
def param_type_is_only_allowed_types(param, allowed_types:list) -> None:
    if not isinstance(param, tuple(allowed_types)):
        raise ValueError("Paramater is not an allowed type.")
def param_singleton(param, expected_param) -> None:
    if param is not expected_param:
        raise ValueError("Incorrect Params")  
def param_is_email_simple(param:str) -> None:
    if '@' not in param:
        raise ValueError("Expected an email but got something else.")


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

def credentials_class_refresh_method_mock(param) -> None:
    timeout_param(param)
    flat_error(param)
    param_type_is_only_allowed_types(param, [object])

def build_param_mock(extension, ver, creds) -> None:
    param_check(extension, "email")
    param_check(ver, "ve1")
    param_check(creds.creds, EmailConsts.MOCKED_CREDS)

def email_msg_init(email_policy) -> None:
    param_singleton(email_policy, None)

def sending_email_param_check(x=None, y= None) -> None:
    param_check(x, "me")

def send_email_param(x, i, j, l) -> None:
    param_check(l, 0)
    allowed = [str]
    param_type_is_only_allowed_types(x, allowed)
    param_type_is_only_allowed_types(i, allowed)
    param_type_is_only_allowed_types(j, allowed)
    param_is_email_simple(x)

def check_bounced_emails(param) -> None:
    param_singleton(param, None)
    # NOTE: timestamp is not fully implemented to be able to check it correctly
    # Will need future work here to ensure that we are correcting mocking the function.
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

def build_service_mock(return_mock=False) -> None | MagicMock:
    """Replacing the build function for the oauth service."""
    from googleapiclient.discovery import build
    mock_service = MagicMock()
    return_self = lambda x,y,z: (build_param_mock(x, y, z), mock_service)[1]
    mock_service.build = return_self
    mock_service.users = mock_service
    mock_service.messages = mock_service
    return_self = lambda x, y : (sending_email_param_check(x, y))[1]
    mock_service.send = return_self
    mock_service.execute = "SENT EMAIL"
    sys.modules["googleapiclient.discovery.build"] = mock_service
    if return_mock: return mock_service

def mock_email_send_objects()-> None:
    """Replacing EmailMessage objects and anything else that might not run locally."""
    from email.message import EmailMessage
    mock_email_msg = MagicMock()
    return_self = lambda x=None: (email_msg_init(x), mock_email_msg)[1]
    mock_email_msg.EmailMessage = return_self
    def setValue(x):
        mock_email_msg.content = x
    return_self =  lambda x=None: (setValue(x), mock_email_msg)[1]
    mock_email_msg.set_content = return_self
    sys.modules["email.message.EmailMessage"] = mock_email_msg

def create_send_email_mock()-> MagicMock:
    """
    Descripition:
        Replaces our own built function send_email()
    """
    mock_send_email = MagicMock()
    return_self = lambda x, i, j, k: (send_email_param(x, i, j, k),mock_send_email)[1] 
    mock_send_email.send_email = return_self
    sys.modules["models.utility"].send_email = mock_send_email
    
    return mock_send_email

def create_check_bounced_emails() -> MagicMock:
    """
    Descripiton:
        Replaces our own built in function check_bounced_emails
    """
    mock_check_bounced_emails =  MagicMock()
    return_self = lambda from_timestamp=None:(send_email_param, mock_check_bounced_emails)[1]
    mock_check_bounced_emails.check_bounced_emails = return_self
    return mock_check_bounced_emails

def create_google_mock_email_objs() -> bool:
    """Takes commonly used objects and replaces them with the Mocked objects and its respective functions"""
    try:
        credentials_mock()
        request_mock()
        build_service_mock()
        mock_email_send_objects()

        # Forcing a cache reload so mock objects can take their place
        import core
        importlib.reload(core)
        importlib.reload(models)

        return True
    except:
        return False
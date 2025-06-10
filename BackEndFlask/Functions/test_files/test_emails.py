#-------------------------------------------------------------------------
# The purpose of this file is to have local tests that can check certain
# edge cases without needing a live service. The nameing convention is 
# to ensure that these tests are run first so that they can set up the
# mock objects.
#
# Date Updated: Fri 11 Apr 2025 02:27:01 PM CDT
#-------------------------------------------------------------------------

from email_test_util import EmailConsts, MockUtil
import pytest
import sys
from unittest.mock import patch, mock_open, MagicMock
from core import (
    config, oauth2_credentials, 
    oauth2_service, oauth2_token_fp, 
    oauth2_scopes, get_oauth2_credentials,
)
from email_mock import (
    create_send_email_mock,
    create_google_mock_email_objs,
    build_service_mock,
)
from Functions import conftest
from controller.Routes.User_routes import(
    add_user
)
from models.utility import(
    send_email, email_students_feedback_is_ready_to_view,
    send_reset_code_email, send_new_user_email,
    send_email_for_updated_email,send_bounced_email_notification,
    check_bounced_emails
)

#------------------------------------------------------------------------------
# These fixtures will override the emailing features and functions for the
# current running session.
#------------------------------------------------------------------------------
@pytest.fixture(scope="session", autouse=True)
def send_email():
    mocked_send_email = create_send_email_mock()
    with patch("models.utility.send_email", mocked_send_email):
        yield mocked_send_email

#------------------------------------------------------------------------------
# These next test that certain env vars are correct to ensure that everything
# works in prod. They also repalce the google objects/functions along the way.
#------------------------------------------------------------------------------

# NOTE: That the google objects must be running, so testing overrides certain defaults.
def test_001_we_are_mock_mode() -> None:
    MockUtil.singleton_comparision(config.rubricapp_running_locally, False, "rubricapp_running_locally needs to be False.")

def test_002_we_are_testing_mode() -> None:
    MockUtil.singleton_comparision(config.testing_mode, True, "testing_mode needs to be True.")

def test_003_credentials_were_None() -> None:
    must_be_none = [oauth2_credentials, oauth2_service]
    MockUtil.list_comparision(must_be_none, [], MockUtil.singleton_comparision, True, "All must be none to ensure proper clean up happend.")

def test_004_scopes_are_correct() -> None:
    MockUtil.equal(oauth2_scopes, EmailConsts.CORRECT_SCOPES, "These scopes sould be the same.")

def test_005_token_file_path() -> None:
    MockUtil.equal(oauth2_token_fp, EmailConsts.CORRECT_PATH_TO_TOKEN, "Ensure both paths are correctly typed.")

def test_007_check_fixtures_are_running(send_email) -> None:
    success = isinstance(send_email, MagicMock)
    MockUtil.singleton_comparision(success, True, "Must have objects running for everything else. If not possible then comment out the config changes in the setupEnv.py for testing.")

#------------------------------------------------------------------------------
# These next tests override our testing credentials and email object provided
# by Google.
#------------------------------------------------------------------------------

# NOTE: This overrides the google objects that run once in init.
def test_008_create_google_mock_objects() -> None:
    success = create_google_mock_email_objs()
    MockUtil.singleton_comparision(success, True, "Must have objects running for everything else. If not possible then comment out the config changes in the setupEnv.py for testing.")
    
# Forcing moduels to read the mock objects for only this tests scope.
@patch("builtins.open", new_callable=mock_open)
@patch('os.path.exists', return_value=True)
def test_009_attempt_to_fetch_creds(mock_exists, mock_open_func) -> None:
    creds = None
    try:   
        creds = get_oauth2_credentials(oauth2_token_fp, oauth2_scopes)
        exists_called = mock_exists.call_count == 1
        open_called = mock_open_func.call_count == 1 
        MockUtil.singleton_comparision(exists_called, True, f"Exists should be called once; was called {mock_exists.call_count}")
        MockUtil.singleton_comparision(open_called, True, f"open should be called once; called {mock_open_func.call_count}")
    except Exception as e:
        MockUtil.singleton_comparision(True, False, f"You should not let an exception through to here. {e}")
    MockUtil.neg_singleton_comparision(creds, None, "Creds should be populated by now")
    oauth2_credentials = creds

# Patching here is need to force the function to look elsewhere.
@patch('googleapiclient.discovery.build', new_callable=build_service_mock(True))
def test_010_attempt_to_start_email_service(mock_service) -> None:
    oauth2_service = None
    try:
        from googleapiclient.discovery import build
        oauth2_service = build("gmail", "v1", credentials=oauth2_credentials)
        correct_object_called = mock_service.call_count > 0
        MockUtil.singleton_comparision(correct_object_called, True, "We should have called at least more than once.")
    except Exception as e:
        MockUtil.singleton_comparision(True, False, f"You should not get here: {e}")
    MockUtil.neg_singleton_comparision(oauth2_service, None, "UNFINISHED")

#------------------------------------------------------------------------------
# These next few tests check that the general utitlity functions work as hoped.
# The past service objects and the functions that built them should not see 
# use in any other test.
#------------------------------------------------------------------------------
def test_011_test_email_send(send_email):
    # The function calls will be labled 0-max to help identify which failed.
    index = 0
    try:
        send_email(EmailConsts.FAKE_EMAIL, "Greetings", "Hello!", 0)
        index += 1
    except Exception as e:
        MockUtil.singleton_comparision(False, True, f"You should not get here: ERROR at func {index} due to {e}")
    MockUtil.singleton_comparision(index, 1, "This should be a higher value to account for every message sent.")
    MockUtil.equal(send_email.call_count, 1, "send_file should have been called once.")
    send_email.reset_mock()

def test_012_test_send_reset_code(send_email):
    send_reset_code_email(EmailConsts.FAKE_EMAIL, EmailConsts.FAKED_RESET_CODE)
    args = send_email.call_args[0]
    MockUtil.equal(args[0], EmailConsts.FAKE_EMAIL, "Emails are not identical.")
    MockUtil.equal(send_email.call_count, 1, "Send email should be called only once.")
    send_email.reset_mock()

def test_013_test_email_students_feedback_is_ready(send_email):
    class student:
        def __init__(self, first_name: str, last_name: str, email:str):
            self.first_name = first_name
            self.last_name = last_name
            self.email = email
    students = [student(EmailConsts.FIRST_NAME, EmailConsts.LAST_NAME, EmailConsts.FAKE_EMAIL)]
    email_students_feedback_is_ready_to_view(students, "Fake ready to view")
    args = send_email.call_args[0]
    MockUtil.equal(args[0], EmailConsts.FAKE_EMAIL, "Emails are not identical.")
    MockUtil.equal(1, send_email.call_count, "Send Email should have been called once.")
    send_email.reset_mock()

#------------------------------------------------------------------------------
# These next few test use the more general routes to ensure that routes that
# depend on these functions are still working as intended.
#------------------------------------------------------------------------------
#def test_009_test_add_user_route(flask_app_mock):
#    undecorated_func = add_user.__wrapped__.__wrapped__.__wrapped__.__wrapped__
#    mock_json = {
#        "first_name": "KUNG FU PANDA",
#        "last_name": "KUNG FU PANDA",
#        "email": "FAKEhkjhkjhkjhkjhkh@gmail.com",
#        "lms_id": None,  # Use `None` instead of "null"
#        "consent": None,
#        "owner_id": 2,
#        "role_id": 5,
#        "user_id": 1,
#        "email_consts": EmailConsts.FAKE_EMAIL
#    }
#    with flask_app_mock.test_request_context('/user', method='POST', json=mock_json):
#        reponse = undecorated_func()
#        print(reponse)
#        assert reponse.status_code == 780
#
#

"""
var body = JSON.stringify({
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "lms_id": lmsId !== "" ? lmsId : null,
            "consent": null,
            "owner_id": cookies.get('user')['user_id'],
            "role_id": navbar.props.isSuperAdmin ? 3 : role
        });

        let promise;
        let owner_id = cookies.get('user')['user_id'];

        if(user === null && addUser === false) {
            if(navbar.props.isSuperAdmin) {
                promise = genericResourcePOST(`/user`, this, body);
            } else {
                promise = genericResourcePOST(`/user?course_id=${chosenCourse["course_id"]}&owner_id=${owner_id}`, this, body);
            }
"""

#------------------------------------------------------------------------------
# EOF - You can add more tests here for thing that you are working on to
# ensure that you are working within the bounds of the email functionality.
# NOTE: Name the tests {test_[0-9][0-9][0-9]_[a-z0-9*+]} to ensue that it runs
# before other tests thanks to the naming convention.
#------------------------------------------------------------------------------

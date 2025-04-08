#-------------------------------------------------------------------------
# The purpose of this file is to have local tests that can check certain
# edge cases without needing a live service.
#
# Date Updated: Tue 08 Apr 2025 01:43:42 PM CDT
#-------------------------------------------------------------------------

from core import config, oauth2_credentials, oauth2_service, oauth2_token_fp, oauth2_scopes
from email_mock import *

class MockUtil:
    """This class just formats information passed to it for debugging purposes."""
    @staticmethod
    def dynamic_msg(i, j, symbol:str, expected):
        """This is used for the other static methods and only requires the symbol to be a string."""
        msg = f"\nAssertion failed:\n  {i} {symbol} {j}"
        if expected is not None:
            msg += f"\n  Expected: {expected}"
        return msg
    
    @staticmethod
    def equal(i, j, expected = None):
        """Assertion test for equality."""
        assert i == j, MockUtil.dynamic_msg(i, j, "==" ,expected)
    
    @staticmethod
    def nequal(i, j, expected = None):
        """Assertion test for not equal."""
        assert i != j, MockUtil.dynamic_msg(i, j, "!=" ,expected)

    @staticmethod
    def singleton_comparision(i, j, expected = None):
        """Assertion test for Boolean and None singleton."""
        assert i is j, MockUtil.dynamic_msg(i, j, "is", expected)

    @staticmethod
    def list_comparision(list_a, list_b, func, none_comparison=False, expected = None):
        """Usage: give it two lists and a MockUtil function to compare things faster.
            It is possible to give it one list and an empty list if none_comparision is true.
        """
        assert len(list_a) == len(list_b) or none_comparison, MockUtil.dynamic_msg("size of first", "size of second", "==", "lists must be the same size")
        for i in range (0, len(list_a)):
            func(list_a[i], list_b[i], expected + f"\nIndex {i} has an error") if not none_comparison else func(list_a[i], None ,expected + f"\nIndex {i} has an error")


# NOTE: That the google objects must be running, so testing overrides certain defaults.
def test_we_are_mock_mode():
    MockUtil.singleton_comparision(config.rubricapp_running_locally, False, "rubricapp_running_locally needs to be False.")

def test_we_are_testing_mode():
    MockUtil.singleton_comparision(config.testing_mode, True, "testing_mode needs to be True.")

def test_credentials_were_None():
    must_be_none = [oauth2_credentials, oauth2_service]
    MockUtil.list_comparision(must_be_none, [], MockUtil.singleton_comparision, True, "All must be none to ensure proper clean up happend.")

def test_scopes_are_correct():
    correct_scopes = [
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.readonly",
    ]
    MockUtil.equal(oauth2_scopes, correct_scopes, "These scopes sould be the same.")

def test_token_file_path():
    correct_path = "/home/ubuntu/private/token.json"
    MockUtil.equal(oauth2_token_fp, correct_path, "Ensure both paths are correctly typed.")

def test_init_mock_objects_are_up():
    MockUtil.singleton_comparision(create_init_service_and_creds_mock(), True, "Creds should be mocked.")

""" def test_replicate_credential_creation():
    # Initialize Gmail OAuth2 service
    try:
        oauth2_scopes = [
            "https://www.googleapis.com/auth/gmail.compose",
            "https://www.googleapis.com/auth/gmail.readonly",
        ]
        oauth2_token_fp = "/home/ubuntu/private/token.json"
        oauth2_service = None
        oauth2_credentials = None
        oauth2_credentials = get_oauth2_credentials(oauth2_token_fp, oauth2_scopes)
        oauth2_service = googleapiclient.discovery.build("gmail", "v1", credentials=oauth2_credentials)
    except Exception as e:
        config.logger.error(str(e))
        oauth2_credentials = None
        oauth2_service = None """




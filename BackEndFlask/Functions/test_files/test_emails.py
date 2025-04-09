#-------------------------------------------------------------------------
# The purpose of this file is to have local tests that can check certain
# edge cases without needing a live service. The nameing convention is 
# to ensure that these tests are run first so that they can set up the
# mock objects.
#
# Date Updated: Tue 08 Apr 2025 01:43:42 PM CDT
#-------------------------------------------------------------------------

from email_test_util import EmailConsts, MockUtil
from core import (
    config, oauth2_credentials, 
    oauth2_service, oauth2_token_fp, 
    oauth2_scopes
)
from email_mock import (
    create_mock_email_objs
)

# NOTE: That the google objects must be running, so testing overrides certain defaults.
def test_001_we_are_mock_mode():
    MockUtil.singleton_comparision(config.rubricapp_running_locally, False, "rubricapp_running_locally needs to be False.")

def test_002_we_are_testing_mode():
    MockUtil.singleton_comparision(config.testing_mode, True, "testing_mode needs to be True.")

def test_003_credentials_were_None():
    must_be_none = [oauth2_credentials, oauth2_service]
    MockUtil.list_comparision(must_be_none, [], MockUtil.singleton_comparision, True, "All must be none to ensure proper clean up happend.")

def test_004_scopes_are_correct():
    MockUtil.equal(oauth2_scopes, EmailConsts.CORRECT_SCOPES, "These scopes sould be the same.")

def test_005_token_file_path():
    MockUtil.equal(oauth2_token_fp, EmailConsts.CORRECT_PATH_TO_TOKEN, "Ensure both paths are correctly typed.")

def test_006_create_mock_objects():
    SUCCESS = create_mock_email_objs()
    MockUtil.singleton_comparision(SUCCESS, True, "Must have objects running for everything else. If not possible then comment out the config changes in the setupEnv.py for testing.")

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




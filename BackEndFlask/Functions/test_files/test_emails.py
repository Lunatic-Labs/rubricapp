#-------------------------------------------------------------------------
# The purpose of this file is to have local tests that can check certain
# edge cases without needing a live service. The nameing convention is 
# to ensure that these tests are run first so that they can set up the
# mock objects.
#
# Date Updated: Tue 08 Apr 2025 01:43:42 PM CDT
#-------------------------------------------------------------------------

from email_test_util import EmailConsts, MockUtil
from unittest.mock import patch, mock_open
from core import (
    config, oauth2_credentials, 
    oauth2_service, oauth2_token_fp, 
    oauth2_scopes, get_oauth2_credentials,
)
from email_mock import (
    create_mock_email_objs,
)

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

def test_006_create_mock_objects() -> None:
    success = create_mock_email_objs()
    MockUtil.singleton_comparision(success, True, "Must have objects running for everything else. If not possible then comment out the config changes in the setupEnv.py for testing.")

# Forcing moduels to read the mock objects for only this tests scope.
@patch('builtins.open', new_callable=mock_open)
@patch('os.path.exists', return_value=True)
def test_007_attempt_to_fetch_creds(mock_exists, mock_open_func) -> None:
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

#def test_008_attempt_to_start_email_service() -> None:
#    oauth2_service = None
#    try:
#        import googleapiclient.discovery
#        oauth2_service = googleapiclient.discovery.build("gmail", "v1", credentials=oauth2_credentials)
#    except Exception as e:
#        MockUtil.singleton_comparision(True, False, f"You should not get here: {e}")
#    MockUtil.neg_singleton_comparision(oauth2_service, None, "UNFINISHED")

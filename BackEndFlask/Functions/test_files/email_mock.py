#-------------------------------------------------------------------------
# The purpose of this file is to crate mock objects for google's 
# api so that at local host level we use fake objects and at a higher
# level we use the real api.
#
# Date Updated: Tue 08 Apr 2025 01:43:42 PM CDT
#-------------------------------------------------------------------------

from unittest.mock import patch

def create_mock_credentials():
    try:
        with patch('core.get_oauth2_credentials', return_value="mocked_credentials"):
            result = get_oauth2_credentials("test", [])
            assert result == "mocked_credentials"

        return True
    except:
        return None
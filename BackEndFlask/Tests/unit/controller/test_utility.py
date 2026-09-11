import pytest
from unittest.mock import patch, MagicMock
from controller.security.utility import create_new_tokens, revoke_tokens, token_expired, token_user_id, to_int
from flask import Flask, request
from jwt import ExpiredSignatureError
from flask_jwt_extended.exceptions import InvalidQueryParamError

app = Flask(__name__)

# ----------------------
# create_tokens tests
# ----------------------
# get_password_version is stubbed alongside the token factories: it reads the
# user's current password generation from the database, and these tests run
# without one.
@patch("controller.security.utility.get_password_version", return_value=0)
@patch("controller.security.utility.create_access_token")
@patch("controller.security.utility.create_refresh_token")
def test_create_tokens_new_refresh(mock_refresh, mock_access, mock_version):
    mock_access.return_value = "access_token_mock"
    mock_refresh.return_value = "refresh_token_mock"

    with app.test_request_context("/?refresh_token="):  # no refresh_token provided
        jwt, refresh = create_new_tokens(123)

    assert jwt == "access_token_mock"
    assert refresh == "refresh_token_mock"
    mock_access.assert_called_once()
    mock_refresh.assert_called_once()

@patch("controller.security.utility.get_password_version", return_value=0)
@patch("controller.security.utility.create_access_token")
def test_create_tokens_existing_refresh(mock_access, mock_version):
    mock_access.return_value = "access_token_mock"

    with app.test_request_context("/?refresh_token=existing_refresh"):
        jwt, refresh = create_new_tokens(123)

    assert jwt == "access_token_mock"
    assert refresh == "existing_refresh"
    mock_access.assert_called_once()


@patch("controller.security.utility.get_password_version", return_value=7)
@patch("controller.security.utility.create_access_token")
@patch("controller.security.utility.create_refresh_token")
def test_create_tokens_stamps_password_version(mock_refresh, mock_access, mock_version):
    """Both tokens must carry the generation, or a reset cannot retire them."""
    mock_access.return_value = "access_token_mock"
    mock_refresh.return_value = "refresh_token_mock"

    with app.test_request_context("/?refresh_token="):
        create_new_tokens(123)

    assert mock_access.call_args.kwargs["additional_claims"] == {"pv": 7}
    assert mock_refresh.call_args.kwargs["additional_claims"] == {"pv": 7}

# ----------------------
# revoke_tokens tests
# ----------------------

app = Flask(__name__)

def test_revoke_tokens_removes_tokens():
    # Use Flask test_request_context
    with app.test_request_context("/", headers={"access_token": "jwt", "refresh_token": "refresh"}):
        # Make a mutable copy of headers for testing
        mutable_headers = dict(request.headers)

        # Patch request.headers inside the function to our mutable copy
        from unittest.mock import patch
        with patch("controller.security.utility.request") as mock_request:
            mock_request.headers = mutable_headers
            revoke_tokens()
            
            # Check tokens removed
            assert "access_token" not in mock_request.headers
            assert "refresh_token" not in mock_request.headers


# ----------------------
# token_expired tests
# ----------------------
@patch("controller.security.utility.decode_token")
def test_token_expired_true(mock_decode):
    mock_decode.side_effect = ExpiredSignatureError
    with app.app_context():
        assert token_expired("some_token") is True

@patch("controller.security.utility.decode_token")
def test_token_expired_false(mock_decode):
    mock_decode.return_value = {"sub": "123"}
    with app.app_context():
        assert token_expired("some_token") is False

# ----------------------
# token_user_id tests
# ----------------------
@patch("controller.security.utility.decode_token")
def test_token_user_id_returns_int(mock_decode):
    mock_decode.return_value = {"sub": "42"}
    with app.app_context():
        assert token_user_id("token") == 42

# ----------------------
# to_int tests
# ----------------------
def test_to_int_valid():
    assert to_int("123", "test") == 123

def test_to_int_invalid_raises():
    with pytest.raises(InvalidQueryParamError):
        to_int("abc", "test")

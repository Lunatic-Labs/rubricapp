import pytest
from unittest.mock import patch, MagicMock
from flask import Flask
from flask_jwt_extended import decode_token
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidQueryParamError
from controller.security.CustomDecorators import (
    verify_against_blacklist,
    verify_token,
    verify_admin,
)


def create_request(app, headers=None, query=None):
    headers = headers or {}
    query = query or {}

    return app.test_request_context(
        "/dummy",
        headers=headers,
        query_string=query
    )


def test_verify_against_blacklist_allows_valid_token():
    """
    Covers lines 27–28 (normal success path)
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer VALID"}):
        with patch("controller.security.CustomDecorators.is_token_blacklisted", return_value=False):
            verify_against_blacklist()  # Should NOT raise


def test_verify_against_blacklist_raises_when_blacklisted():
    """
    Covers blacklist detection branch → raises NoAuthorizationError
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer BAD"}):
        with patch("controller.security.CustomDecorators.is_token_blacklisted", return_value=True):
            with pytest.raises(NoAuthorizationError):
                verify_against_blacklist()


def test_verify_against_blacklist_exception_logging_path():
    """
    Covers lines 46–54 (error logging branch)
    Ensures the 'except' block triggers correctly.
    """
    app = Flask(__name__)

    # Simulate missing Authorization header → triggers exception
    with create_request(app, headers={}):
        with patch("controller.security.CustomDecorators.course_redis_out") as log_mock:
            with pytest.raises(Exception):
                verify_against_blacklist()

            # Ensure logging was triggered
            assert log_mock.call_count > 0


def test_verify_token_success():
    """
    Covers lines 74–80: successful decode & ID match
    """
    app = Flask(__name__)

    with create_request(
        app,
        headers={"Authorization": "Bearer TOKEN"},
        query={"user_id": "10"}
    ):
        with patch("controller.security.CustomDecorators.decode_token", return_value={"sub": 10}):
            verify_token(refresh=False)  # Should not raise


def test_verify_token_id_mismatch():
    """
    Covers lines 83–86: ID mismatch branch → raises NoAuthorizationError
    """
    app = Flask(__name__)

    with create_request(
        app,
        headers={"Authorization": "Bearer TOKEN"},
        query={"user_id": "999"}  # mismatch
    ):
        with patch("controller.security.CustomDecorators.decode_token", return_value={"sub": 10}):
            with pytest.raises(NoAuthorizationError):
                verify_token(refresh=False)


def test_verify_token_invalid_missing_user_id():
    """
    Covers: missing user_id causes InvalidQueryParamError
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer TOKEN"}):
        with pytest.raises(InvalidQueryParamError):
            verify_token(refresh=False)


def test_verify_token_decode_failure():
    """
    Covers decode_token exception branch
    """
    app = Flask(__name__)

    with create_request(
        app,
        headers={"Authorization": "Bearer TOKEN"},
        query={"user_id": "10"}
    ):
        with patch("controller.security.CustomDecorators.decode_token", side_effect=Exception("bad token")):
            with pytest.raises(NoAuthorizationError):
                verify_token(refresh=False)


def test_verify_admin_success():
    """
    Successful admin branch
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer ADMIN"}):
        with patch("controller.security.CustomDecorators.decode_token", return_value={"sub": 1}):
            with patch("controller.security.CustomDecorators.is_admin_by_user_id", return_value=True):
                verify_admin(refresh=False)  # Should not raise


def test_verify_admin_denied_not_admin():
    """
    Covers lines 117–126: not admin → raises NoAuthorizationError
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer NOTADMIN"}):
        with patch("controller.security.CustomDecorators.decode_token", return_value={"sub": 12}):
            with patch("controller.security.CustomDecorators.is_admin_by_user_id", return_value=False):
                with pytest.raises(NoAuthorizationError):
                    verify_admin(refresh=False)


def test_verify_admin_decode_failure():
    """
    Covers failure in decoding token
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer BAD"}):
        with patch("controller.security.CustomDecorators.decode_token", side_effect=Exception("decode error")):
            with pytest.raises(NoAuthorizationError):
                verify_admin(refresh=False)

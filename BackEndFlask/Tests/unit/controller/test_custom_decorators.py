import pytest
from unittest.mock import patch, MagicMock
from flask import Flask
from flask_jwt_extended import decode_token
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidQueryParamError
from enums.roles import Roles
from controller.security.CustomDecorators import (
    verify_against_blacklist,
    verify_token,
    verify_admin,
    sufficent_privilege,
    verify_super_admin,
)


def create_request(app, headers=None, query=None):
    headers = headers or {}
    query = query or {}

    return app.test_request_context(
        "/dummy",
        headers=headers,
        query_string=query
    )


@pytest.fixture
def mock_logger():
    """Patches the shared logger these decorators log through, so tests
    can assert on what got logged without touching the real log file."""
    with patch("controller.security.CustomDecorators.logger") as m:
        yield m


def test_verify_against_blacklist_allows_valid_token(mock_logger):
    """
    Covers lines 27–28 (normal success path)
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer VALID"}):
        with patch("controller.security.CustomDecorators.is_token_blacklisted", return_value=False):
            verify_against_blacklist()  # Should NOT raise

    mock_logger.info.assert_called_once()
    assert "Blacklist check passed" in mock_logger.info.call_args[0][0]
    mock_logger.warning.assert_not_called()


def test_verify_against_blacklist_raises_when_blacklisted(mock_logger):
    """
    Covers blacklist detection branch → raises NoAuthorizationError
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer BAD"}):
        with patch("controller.security.CustomDecorators.is_token_blacklisted", return_value=True):
            with pytest.raises(NoAuthorizationError):
                verify_against_blacklist()

    mock_logger.warning.assert_called_once()
    assert "Blacklist check denied" in mock_logger.warning.call_args[0][0]
    mock_logger.info.assert_not_called()


def test_verify_against_blacklist_exception_logging_path(mock_logger):
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

    mock_logger.warning.assert_called_once()
    assert "Blacklist check denied" in mock_logger.warning.call_args[0][0]


def test_verify_token_success(mock_logger):
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

    mock_logger.info.assert_called_once()
    assert "AuthCheck passed" in mock_logger.info.call_args[0][0]
    mock_logger.warning.assert_not_called()


def test_verify_token_id_mismatch(mock_logger):
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

    mock_logger.warning.assert_called_once()
    msg = mock_logger.warning.call_args[0][0]
    assert "AuthCheck denied" in msg
    assert "claimed=999" in msg
    assert "token_identity=10" in msg


def test_verify_token_invalid_missing_user_id(mock_logger):
    """
    Covers: missing user_id causes InvalidQueryParamError
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer TOKEN"}):
        with pytest.raises(InvalidQueryParamError):
            verify_token(refresh=False)

    mock_logger.warning.assert_called_once()
    assert "missing user_id" in mock_logger.warning.call_args[0][0]


def test_verify_token_decode_failure(mock_logger):
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

    mock_logger.warning.assert_called_once()
    msg = mock_logger.warning.call_args[0][0]
    assert "could not decode token" in msg
    assert "bad token" in msg


def test_verify_admin_success(mock_logger):
    """
    Successful admin branch
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer ADMIN"}):
        with patch("controller.security.CustomDecorators.decode_token", return_value={"sub": 1}):
            with patch("controller.security.CustomDecorators.is_admin_by_user_id", return_value=True):
                verify_admin(refresh=False)  # Should not raise

    mock_logger.info.assert_called_once()
    assert "admin_check passed" in mock_logger.info.call_args[0][0]
    mock_logger.warning.assert_not_called()


def test_verify_admin_denied_not_admin(mock_logger):
    """
    Covers lines 117–126: not admin → raises NoAuthorizationError
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer NOTADMIN"}):
        with patch("controller.security.CustomDecorators.decode_token", return_value={"sub": 12}):
            with patch("controller.security.CustomDecorators.is_admin_by_user_id", return_value=False):
                with pytest.raises(NoAuthorizationError):
                    verify_admin(refresh=False)

    mock_logger.warning.assert_called_once()
    msg = mock_logger.warning.call_args[0][0]
    assert "admin_check denied" in msg
    assert "user_id=12" in msg
    assert "not an admin" in msg
    mock_logger.info.assert_not_called()


def test_verify_admin_decode_failure(mock_logger):
    """
    Covers failure in decoding token
    """
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer BAD"}):
        with patch("controller.security.CustomDecorators.decode_token", side_effect=Exception("decode error")):
            with pytest.raises(NoAuthorizationError):
                verify_admin(refresh=False)

    mock_logger.warning.assert_called_once()
    msg = mock_logger.warning.call_args[0][0]
    assert "admin_check denied" in msg
    assert "decode error" in msg


def test_sufficient_privilege_allows_when_role_matches(mock_logger):
    app = Flask(__name__)

    with create_request(
        app,
        headers={"Authorization": "Bearer TOKEN"},
        query={"course_id": "5"}
    ):
        with patch("controller.security.CustomDecorators.decode_token", return_value={"sub": 7}):
            with patch(
                "controller.security.CustomDecorators.get_role_from_usercourse_by_userid_courseid",
                return_value=Roles.ADMIN
            ):
                sufficent_privilege([Roles.ADMIN, Roles.TA_INSTRUCTOR], refresh=False)  # Should not raise

    mock_logger.info.assert_called_once()
    msg = mock_logger.info.call_args[0][0]
    assert "privilege_check passed" in msg
    assert "course_id=5" in msg
    mock_logger.warning.assert_not_called()


def test_sufficient_privilege_denies_when_role_not_in_list(mock_logger):
    app = Flask(__name__)

    with create_request(
        app,
        headers={"Authorization": "Bearer TOKEN"},
        query={"course_id": "5"}
    ):
        with patch("controller.security.CustomDecorators.decode_token", return_value={"sub": 7}):
            with patch(
                "controller.security.CustomDecorators.get_role_from_usercourse_by_userid_courseid",
                return_value=Roles.STUDENT
            ):
                with pytest.raises(NoAuthorizationError):
                    sufficent_privilege([Roles.ADMIN, Roles.TA_INSTRUCTOR], refresh=False)

    mock_logger.warning.assert_called_once()
    msg = mock_logger.warning.call_args[0][0]
    assert "privilege_check denied" in msg
    assert "course_id=5" in msg
    assert "required=['ADMIN', 'TA_INSTRUCTOR']" in msg
    mock_logger.info.assert_not_called()


def test_sufficient_privilege_denies_on_exception(mock_logger):
    app = Flask(__name__)

    with create_request(
        app,
        headers={"Authorization": "Bearer TOKEN"},
        query={"course_id": "5"}
    ):
        with patch("controller.security.CustomDecorators.decode_token", side_effect=Exception("db down")):
            with pytest.raises(NoAuthorizationError):
                sufficent_privilege([Roles.ADMIN], refresh=False)

    mock_logger.warning.assert_called_once()
    msg = mock_logger.warning.call_args[0][0]
    assert "privilege_check denied" in msg
    assert "db down" in msg


def test_verify_super_admin_allows_super_admin(mock_logger):
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer TOKEN"}):
        with patch("controller.security.CustomDecorators.get_jwt_identity", return_value="1"):
            with patch("controller.security.CustomDecorators.is_super_admin_by_user_id", return_value=True):
                verify_super_admin(refresh=False)  # Should not raise

    mock_logger.info.assert_called_once()
    assert "super_admin_check passed" in mock_logger.info.call_args[0][0]
    mock_logger.warning.assert_not_called()


def test_verify_super_admin_denies_non_super_admin(mock_logger):
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer TOKEN"}):
        with patch("controller.security.CustomDecorators.get_jwt_identity", return_value="2"):
            with patch("controller.security.CustomDecorators.is_super_admin_by_user_id", return_value=False):
                with pytest.raises(NoAuthorizationError):
                    verify_super_admin(refresh=False)

    mock_logger.warning.assert_called_once()
    msg = mock_logger.warning.call_args[0][0]
    assert "super_admin_check denied" in msg
    assert "user_id=2" in msg
    mock_logger.info.assert_not_called()


def test_verify_super_admin_denies_on_exception(mock_logger):
    app = Flask(__name__)

    with create_request(app, headers={"Authorization": "Bearer TOKEN"}):
        with patch("controller.security.CustomDecorators.get_jwt_identity", side_effect=Exception("no identity")):
            with pytest.raises(NoAuthorizationError):
                verify_super_admin(refresh=False)

    mock_logger.warning.assert_called_once()
    msg = mock_logger.warning.call_args[0][0]
    assert "super_admin_check denied" in msg
    assert "no identity" in msg

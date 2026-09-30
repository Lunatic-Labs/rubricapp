import pytest
from unittest.mock import patch
from core import app
from enums.http_status_codes import HttpStatus
from constants.ClientError import (
    MAX_MESSAGE_LENGTH,
    MAX_STACK_LENGTH,
    DEFAULT_LEVEL,
)
from controller.Routes.ClientError_routes import report_client_error


@pytest.fixture
def mock_client_logger():
    """Patches the dedicated client logger the route reports through, so
    tests can assert on what got logged without touching the real log file."""
    with patch("controller.Routes.ClientError_routes.client_logger") as m:
        yield m


def _post(payload):
    """Invokes the route directly in a request context: the handler needs
    no database, so this avoids standing one up."""
    with app.test_request_context("/api/client-error", method="POST", json=payload):
        return report_client_error()


def test_logs_report_and_returns_ok(mock_client_logger):
    _, status = _post({
        "level": "error",
        "url": "/admin/dashboard",
        "user_id": "42",
        "message": "boom",
        "extra": "at Foo (bundle.js:1)",
    })

    assert status == HttpStatus.OK.value

    msg = mock_client_logger.error.call_args[0][0]
    assert "level=error" in msg
    assert "url=/admin/dashboard" in msg
    assert "user_id=42" in msg
    assert "message=boom" in msg
    assert "at Foo (bundle.js:1)" in msg


def test_missing_fields_fall_back_to_empty_and_default_level(mock_client_logger):
    _, status = _post({})

    assert status == HttpStatus.OK.value

    msg = mock_client_logger.error.call_args[0][0]
    assert f"level={DEFAULT_LEVEL}" in msg
    assert "url=," in msg
    assert "user_id=," in msg


def test_client_warning_is_recorded_as_a_warning(mock_client_logger):
    """
    The frontend logger reports warnings as level "warn". Those must not
    land as ERROR records, or every client-side warning trips error-level
    alerting.
    """
    _post({"level": "warn", "message": "slow response"})

    mock_client_logger.error.assert_not_called()
    mock_client_logger.warning.assert_called_once()
    assert "level=warn" in mock_client_logger.warning.call_args[0][0]


@pytest.mark.parametrize("level,expected_method", [
    ("debug", "debug"),
    ("info", "info"),
    ("warn", "warning"),
    ("error", "error"),
    ("ERROR", "error"),
])
def test_each_reported_level_uses_its_own_log_method(mock_client_logger, level, expected_method):
    _post({"level": level, "message": "x"})

    getattr(mock_client_logger, expected_method).assert_called_once()


def test_unrecognised_level_falls_back_to_the_default(mock_client_logger):
    """A client can send anything here, so an unknown level must not be
    used to pick a method that doesn't exist."""
    _, status = _post({"level": "not-a-level", "message": "x"})

    assert status == HttpStatus.OK.value
    mock_client_logger.error.assert_called_once()
    assert f"level={DEFAULT_LEVEL}" in mock_client_logger.error.call_args[0][0]


def test_oversized_fields_are_truncated_to_their_caps(mock_client_logger):
    _post({
        "message": "m" * (MAX_MESSAGE_LENGTH + 500),
        "extra": "e" * (MAX_STACK_LENGTH + 500),
    })

    msg = mock_client_logger.error.call_args[0][0]
    assert "m" * MAX_MESSAGE_LENGTH in msg
    assert "m" * (MAX_MESSAGE_LENGTH + 1) not in msg
    assert "e" * MAX_STACK_LENGTH in msg
    assert "e" * (MAX_STACK_LENGTH + 1) not in msg


def test_logging_failure_returns_bad_request_without_leaking_details(mock_client_logger):
    """
    CodeQL flagged exception details reaching the client here, so the
    response must stay generic while the traceback goes to the log only.
    """
    mock_client_logger.error.side_effect = RuntimeError("secret internals")

    response, status = _post({"message": "boom"})

    assert status == HttpStatus.BAD_REQUEST.value
    assert "secret internals" not in response["message"]
    mock_client_logger.exception.assert_called_once()

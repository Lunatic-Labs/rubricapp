import pytest
import uuid
from unittest.mock import patch
from core import app, limiter
from enums.http_status_codes import HttpStatus
from constants.ClientError import (
    MAX_BODY_BYTES,
    MAX_MESSAGE_LENGTH,
    MAX_STACK_LENGTH,
    DEFAULT_LEVEL,
)
from controller.Routes.ClientError_routes import report_client_error


@pytest.fixture(autouse=True)
def limiter_disabled():
    """Most of these tests care about what the handler does, not about
    the rate limit, and each one would otherwise spend quota that leaks
    into the next. The limit itself is covered by
    test_rate_limit_rejects_a_flood_from_one_address, which re-enables it."""
    was_enabled = limiter.enabled
    limiter.enabled = False
    yield
    limiter.enabled = was_enabled


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


# ---------------------------------------------------------------------------
# Flood protection: this route is unauthenticated, so the rate limit and
# body cap are the only things bounding what one host can write.
# ---------------------------------------------------------------------------

def _unique_addr():
    """
    A client address no other test run has used.

    The limiter's counters live in Redis when it's reachable (the docker
    stack) and in per-process memory when it isn't (a bare local run), so
    a fixed address would carry quota over between runs in the first case
    and not the second - passing locally and failing in the container
    within the same minute. Deriving the address per call makes these
    tests independent of which backend is in play and of anything that
    ran before them, without needing limiter.reset() (which requires the
    Redis that may not be there).
    """
    h = uuid.uuid4().hex
    return "2001:db8:" + ":".join(h[i:i + 4] for i in range(0, 24, 4))


def test_oversized_body_is_refused_without_being_parsed(mock_client_logger):
    """The per-field caps only apply after parsing, so the body cap is
    what stops a huge payload from being parsed at all."""
    with app.test_request_context(
        "/api/client-error",
        method="POST",
        data="x" * (MAX_BODY_BYTES + 1),
        content_type="application/json",
    ):
        response, status = report_client_error()

    assert status == HttpStatus.CONTENT_TOO_LARGE.value
    assert "too large" in response["message"]
    mock_client_logger.error.assert_not_called()


def test_oversized_chunked_body_without_content_length_is_refused(mock_client_logger):
    """A chunked request carries no Content-Length, so the cap must be
    enforced while reading the stream, not only from the declared length."""
    import io
    body = ('{"message": "' + "x" * (MAX_BODY_BYTES * 3) + '"}').encode()

    with app.test_request_context(
        "/api/client-error",
        method="POST",
        environ_overrides={
            "wsgi.input": io.BytesIO(body),
            "wsgi.input_terminated": True,
            "HTTP_TRANSFER_ENCODING": "chunked",
            "CONTENT_TYPE": "application/json",
        },
    ):
        from flask import request
        assert request.content_length is None
        response, status = report_client_error()

    assert status == HttpStatus.CONTENT_TOO_LARGE.value
    assert "too large" in response["message"]
    mock_client_logger.error.assert_not_called()


def test_body_at_the_cap_is_still_accepted(mock_client_logger):
    """The cap is a ceiling, not a trigger - a legitimate report carrying
    a long stack trace must still get through."""
    body = '{"message": "' + "x" * (MAX_BODY_BYTES - 100) + '"}'
    assert len(body) <= MAX_BODY_BYTES

    with app.test_request_context(
        "/api/client-error", method="POST", data=body, content_type="application/json"
    ):
        _, status = report_client_error()

    assert status == HttpStatus.OK.value
    mock_client_logger.error.assert_called_once()


def test_rate_limit_rejects_a_flood_from_one_address():
    """
    A public collector has to bound how much one host can write. Runs
    through the test client rather than calling the view directly,
    because the limit is enforced by the decorator.

    Note this exercises the in-memory fallback, since the limiter's Redis
    isn't up in a unit-test run - which is itself worth having covered
    (see in_memory_fallback_enabled in core/__init__.py). Each test uses
    its own client address so counters can't leak between them, rather
    than calling limiter.reset(), which would need that Redis.
    """
    limiter.enabled = True

    client = app.test_client()
    payload = {"level": "error", "message": "flood"}
    addr = _unique_addr()

    with patch("controller.Routes.ClientError_routes.client_logger"):
        statuses = [
            client.post(
                "/api/client-error",
                json=payload,
                environ_overrides={"REMOTE_ADDR": addr},
            ).status_code
            for _ in range(25)
        ]

    assert statuses[0] == HttpStatus.OK.value
    assert HttpStatus.TOO_MANY_REQUESTS.value in statuses
    # 20 per minute is the tighter of the two configured limits.
    assert statuses.count(HttpStatus.OK.value) == 20


def test_rate_limit_is_keyed_per_address():
    """One noisy host must not silence reports from everyone else."""
    limiter.enabled = True

    client = app.test_client()
    payload = {"level": "error", "message": "x"}
    flooder, bystander = _unique_addr(), _unique_addr()

    with patch("controller.Routes.ClientError_routes.client_logger"):
        for _ in range(25):
            client.post(
                "/api/client-error",
                json=payload,
                environ_overrides={"REMOTE_ADDR": flooder},
            )

        other = client.post(
            "/api/client-error",
            json=payload,
            environ_overrides={"REMOTE_ADDR": bystander},
        )

    assert other.status_code == HttpStatus.OK.value


@pytest.mark.parametrize("body,content_type", [
    ("[1, 2]", "application/json"),
    ('"just a string"', "application/json"),
    ("not json at all", "application/json"),
    ('{"message": "boom"}', "text/plain"),
])
def test_non_object_body_is_rejected_without_a_traceback(mock_client_logger, body, content_type):
    with app.test_request_context(
        "/api/client-error", method="POST", data=body, content_type=content_type
    ):
        _, status = report_client_error()

    assert status == HttpStatus.BAD_REQUEST.value
    mock_client_logger.exception.assert_not_called()
    mock_client_logger.warning.assert_called_once()


def test_falsy_field_values_are_kept_not_blanked(mock_client_logger):
    _post({"user_id": 0, "message": False})

    msg = mock_client_logger.error.call_args[0][0]
    assert "user_id=0," in msg
    assert "message=False," in msg


def test_well_formed_failed_request_id_is_recorded(mock_client_logger):
    request_id = str(uuid.uuid4())
    _post({"message": "boom", "request_id": request_id})

    assert f"failed_request_id={request_id}," in mock_client_logger.error.call_args[0][0]


@pytest.mark.parametrize("bad_id", ["has spaces", "x" * 65, "a;b", ""])
def test_malformed_failed_request_id_is_dropped(mock_client_logger, bad_id):
    _post({"message": "boom", "request_id": bad_id})

    assert "failed_request_id=," in mock_client_logger.error.call_args[0][0]

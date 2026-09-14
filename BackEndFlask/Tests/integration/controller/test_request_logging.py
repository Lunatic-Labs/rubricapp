import logging
import uuid

from core import config
from models.log_context import get_request_id, get_user_id


class _CapturingHandler(logging.Handler):
    """
    Records, for each log record it sees, both the formatted message and
    whatever request_id/user_id were set *at the moment of emit* — i.e.
    still inside the request that produced the record, before
    teardown_request resets the context. Used to verify the summary log
    line in core/__init__.py's after_request hook is actually tagged with
    the request's context, not just that the context vars work in
    isolation (see test_logger_unit.py for that).
    """

    def __init__(self):
        super().__init__()
        self.records = []

    def emit(self, record):
        self.records.append({
            "message": record.getMessage(),
            "request_id": get_request_id(),
            "user_id": get_user_id(),
        })


def test_response_carries_a_generated_request_id(client):
    response = client.post("/api/login", json={"email": None, "password": None})

    request_id = response.headers.get("X-Request-ID")
    assert request_id
    # Should be a valid uuid4 when the caller didn't supply one.
    uuid.UUID(request_id)


def test_response_echoes_inbound_request_id(client):
    response = client.post(
        "/api/login",
        json={"email": None, "password": None},
        headers={"X-Request-ID": "client-supplied-id"},
    )

    assert response.headers.get("X-Request-ID") == "client-supplied-id"


def test_request_context_is_reset_after_the_request_completes(client):
    client.post(
        "/api/login",
        json={"email": None, "password": None},
        headers={"X-Request-ID": "should-not-leak"},
    )

    # Nothing outside the request/response cycle should still see this
    # request's context — otherwise it could bleed into whatever the
    # worker handles next.
    assert get_request_id() is None
    assert get_user_id() is None


def test_summary_log_line_is_tagged_with_the_request_context(client):
    handler = _CapturingHandler()
    config.logger.logger.addHandler(handler)
    try:
        response = client.post(
            "/api/login",
            json={"email": None, "password": None},
            headers={"X-Request-ID": "req-summary-test"},
        )
    finally:
        config.logger.logger.removeHandler(handler)

    summary_records = [r for r in handler.records if "POST /api/login" in r["message"]]
    assert len(summary_records) == 1

    summary = summary_records[0]
    assert str(response.status_code) in summary["message"]
    assert summary["request_id"] == "req-summary-test"


def test_user_id_query_param_is_captured_into_request_context(client):
    handler = _CapturingHandler()
    config.logger.logger.addHandler(handler)
    try:
        client.post(
            "/api/login?user_id=123",
            json={"email": None, "password": None},
        )
    finally:
        config.logger.logger.removeHandler(handler)

    summary_records = [r for r in handler.records if "POST /api/login" in r["message"]]
    assert len(summary_records) == 1
    assert summary_records[0]["user_id"] == "123"

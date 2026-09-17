import os
import json
import logging
import pytest
from models.logger import Logger
from models.log_context import set_request_id, reset_request_id, set_user_id, reset_user_id

@pytest.fixture(autouse=True)
def close_log_handlers():
    """Close all file handlers after each test to prevent Windows file locking."""
    yield
    for _, logger_instance in logging.Logger.manager.loggerDict.items():
        if isinstance(logger_instance, logging.Logger):
            for handler in logger_instance.handlers[:]:
                if isinstance(handler, logging.FileHandler):
                    handler.close()
                    logger_instance.removeHandler(handler)

@pytest.fixture
def temp_log_file(tmp_path):
    """Provide a temporary log file for each test."""
    log_file = tmp_path / "test.log"
    yield str(log_file)
    try:
        if os.path.exists(log_file):
            os.remove(log_file)
    except PermissionError:
        # On Windows this can still be held open here, since autouse
        # fixtures (close_log_handlers) tear down after this one; pytest's
        # tmp_path cleanup removes it later regardless.
        pass

def test_logger_creates_default_file(tmp_path, monkeypatch):
    """Logger should create default file if not provided."""
    logs_dir = tmp_path / "logs"
    logs_dir.mkdir()
    monkeypatch.setattr("models.logger.os.path.dirname", lambda _: str(tmp_path))
    monkeypatch.setattr("models.logger.os.path.abspath", lambda p: os.path.join(tmp_path, "logs", "all.log"))

    log = Logger("test_logger")
    assert any(isinstance(h, logging.FileHandler) for h in log.logger.handlers)

def test_logger_writes_to_custom_file(temp_log_file):
    """Ensure logs are written to the provided file."""
    log = Logger("test_logger_custom", logfile=temp_log_file)
    log.info("This is an info message")

    with open(temp_log_file, "r") as f:
        contents = f.read()
    assert "This is an info message" in contents

@pytest.mark.parametrize("level,method", [
    ("DEBUG", "debug"),
    ("INFO", "info"),
    ("WARNING", "warning"),
    ("ERROR", "error"),
    ("CRITICAL", "critical")
])
def test_log_levels_write_messages(temp_log_file, level, method):
    """Test that each level logs correctly."""
    # Ensure file exists before Logger tries to open it in r+ mode
    open(temp_log_file, "w").close()

    log = Logger("test_logger_levels", logfile=temp_log_file)
    getattr(log, method)(f"{level} message")

    with open(temp_log_file, "r") as f:
        contents = f.read()
        assert f"{level} message" in contents


def test_password_reset_logs_correct_format(temp_log_file):
    """Ensure password_reset logs formatted message."""
    log = Logger("test_logger_pw", logfile=temp_log_file)
    log.password_reset("u123", "l456", "John", "Doe", "john@example.com")

    with open(temp_log_file, "r") as f:
        content = f.read()
    assert "Password Reset Request" in content
    assert "User: u123" in content
    assert "LMS: l456" in content
    assert "Name: John Doe" in content
    assert "Email: john@example.com" in content

def test_logger_uses_timed_rotation_with_90_day_retention(temp_log_file):
    """Log files should rotate daily and keep 90 days of backups."""
    from logging.handlers import TimedRotatingFileHandler

    log = Logger("test_logger_rotation", logfile=temp_log_file)

    rotating_handlers = [
        h for h in log.logger.handlers if isinstance(h, TimedRotatingFileHandler)
    ]
    assert len(rotating_handlers) == 1
    assert rotating_handlers[0].when.upper() == "MIDNIGHT"
    assert rotating_handlers[0].backupCount == 90


# ---------------------------------------------------------------------------
# JsonFormatter / request_id / user_id correlation
# ---------------------------------------------------------------------------

def _read_json_lines(logfile):
    with open(logfile, "r") as f:
        return [json.loads(line) for line in f if line.strip()]


def test_log_output_is_valid_json_with_expected_fields(temp_log_file):
    """Each log line should be a single JSON object with the documented fields."""
    log = Logger("test_logger_json", logfile=temp_log_file)
    log.info("hello world")

    records = _read_json_lines(temp_log_file)
    assert len(records) == 1

    record = records[0]
    assert record["level"] == "INFO"
    assert record["logger"] == "test_logger_json"
    assert record["message"] == "hello world"
    assert "timestamp" in record
    assert "request_id" in record
    assert "user_id" in record


def test_log_output_has_null_request_and_user_id_outside_request_context(temp_log_file):
    """Log lines emitted with no request in flight should carry no request_id/user_id."""
    log = Logger("test_logger_json_no_context", logfile=temp_log_file)
    log.info("outside a request")

    record = _read_json_lines(temp_log_file)[0]
    assert record["request_id"] is None
    assert record["user_id"] is None


def test_log_output_is_tagged_with_request_and_user_id_when_set(temp_log_file):
    """Log lines emitted while a request_id/user_id is set should carry both."""
    log = Logger("test_logger_json_context", logfile=temp_log_file)

    rid_token = set_request_id("req-123")
    uid_token = set_user_id("42")
    try:
        log.info("inside a request")
    finally:
        reset_request_id(rid_token)
        reset_user_id(uid_token)

    record = _read_json_lines(temp_log_file)[0]
    assert record["request_id"] == "req-123"
    assert record["user_id"] == "42"


def test_context_reset_does_not_leak_into_later_log_lines(temp_log_file):
    """Resetting the context vars should stop tagging subsequent log lines."""
    log = Logger("test_logger_json_reset", logfile=temp_log_file)

    rid_token = set_request_id("req-456")
    log.info("first, tagged")
    reset_request_id(rid_token)
    log.info("second, untagged")

    records = _read_json_lines(temp_log_file)
    assert records[0]["request_id"] == "req-456"
    assert records[1]["request_id"] is None


def test_log_output_includes_exc_info_on_exception(temp_log_file):
    """logger.exception()-style calls should carry exception info in the JSON."""
    log = Logger("test_logger_json_exc", logfile=temp_log_file)

    try:
        raise ValueError("boom")
    except ValueError:
        log.logger.exception("something failed")

    record = _read_json_lines(temp_log_file)[0]
    assert "exc_info" in record
    assert "ValueError: boom" in record["exc_info"]

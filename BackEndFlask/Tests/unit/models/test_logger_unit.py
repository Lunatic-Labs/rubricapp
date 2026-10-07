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
    monkeypatch.setattr("models.logger.LOG_DIR", str(logs_dir))

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

def test_logger_does_not_rotate_in_process(temp_log_file):
    """
    Rotation must be left to logrotate (see the Logger docstring and
    LOGROTATE_CONFIG in Cloud/syscontrol.sh). Gunicorn's workers all hold
    the same file open, so any in-process rotating handler would race at
    the rollover and split or drop records.
    """
    from logging.handlers import BaseRotatingHandler

    log = Logger("test_logger_rotation", logfile=temp_log_file)

    file_handlers = [
        h for h in log.logger.handlers if isinstance(h, logging.FileHandler)
    ]
    assert len(file_handlers) == 1
    assert not isinstance(file_handlers[0], BaseRotatingHandler)
    # Appending rather than truncating is what makes copytruncate safe.
    assert file_handlers[0].mode == "a"


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

def _json_line(written_at, message):
    return json.dumps({"timestamp": written_at.isoformat(), "level": "INFO", "message": message}) + "\n"

def test_trim_expired_entries_drops_only_lines_past_retention(tmp_path, monkeypatch):
    """Startup trim keeps recent entries, drops expired ones, in every app log."""
    from datetime import datetime, timedelta
    from models.logger import trim_expired_entries, APP_LOG_FILES

    monkeypatch.setattr("models.logger.LOG_DIR", str(tmp_path))
    now = datetime.now()

    for name in APP_LOG_FILES:
        (tmp_path / name).write_text(
            _json_line(now - timedelta(days=120), "expired")
            + _json_line(now - timedelta(days=1), "recent")
        )

    trim_expired_entries(retention_days=90)

    for name in APP_LOG_FILES:
        content = (tmp_path / name).read_text()
        assert "expired" not in content
        assert "recent" in content

def test_trim_expired_entries_handles_legacy_lines_and_continuations(tmp_path, monkeypatch):
    """Old plain-text lines are dated by their prefix; untimed lines follow the entry before them."""
    from datetime import datetime, timedelta
    from models.logger import trim_expired_entries

    monkeypatch.setattr("models.logger.LOG_DIR", str(tmp_path))
    fmt = "%Y-%m-%d %H:%M:%S"
    old = (datetime.now() - timedelta(days=200)).strftime(fmt)
    new = (datetime.now() - timedelta(days=2)).strftime(fmt)
    (tmp_path / "all.log").write_text(
        f"{old} ERROR old failure\n"
        "Traceback line belonging to old failure\n"
        f"{new} ERROR new failure\n"
        "Traceback line belonging to new failure\n"
    )

    trim_expired_entries(retention_days=90)

    assert (tmp_path / "all.log").read_text() == (
        f"{new} ERROR new failure\n"
        "Traceback line belonging to new failure\n"
    )

def test_trim_expired_entries_keeps_open_handlers_writing_to_same_file(tmp_path, monkeypatch):
    """The file is rewritten in place, so an already-open append handler still lands in it."""
    from datetime import datetime, timedelta
    from models.logger import trim_expired_entries

    monkeypatch.setattr("models.logger.LOG_DIR", str(tmp_path))
    log_path = tmp_path / "all.log"
    log_path.write_text(_json_line(datetime.now() - timedelta(days=120), "expired"))
    log = Logger("trim_open_handler_logger", logfile=str(log_path))

    trim_expired_entries(retention_days=90)
    log.info("after trim")

    content = log_path.read_text()
    assert "expired" not in content
    assert "after trim" in content

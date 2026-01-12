import os
import io
import logging
import pytest
from datetime import datetime, timedelta
from models.logger import Logger

@pytest.fixture
def temp_log_file(tmp_path):
    """Provide a temporary log file for each test."""
    log_file = tmp_path / "test.log"
    yield str(log_file)
    if os.path.exists(log_file):
        os.remove(log_file)

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

def test_try_clear_removes_old_entries(temp_log_file):
    """Simulate a log older than 90 days and ensure it is removed."""
    old_date = (datetime.now() - timedelta(days=91)).strftime("%Y-%m-%d %H:%M:%S")
    new_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(temp_log_file, "w") as f:
        f.write(f"{old_date} - INFO - old log\n")
        f.write(f"{new_date} - INFO - new log\n")

    log = Logger("test_logger_clear", logfile=temp_log_file)
    log.info("Trigger cleanup")

    with open(temp_log_file, "r") as f:
        contents = f.read()
    assert "old log" not in contents
    assert "new log" in contents

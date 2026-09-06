import os
import logging
import pytest
from models.logger import Logger

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

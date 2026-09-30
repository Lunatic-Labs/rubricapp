import pytest
from unittest.mock import patch
from redis.exceptions import ConnectionError as RedisConnectionError
from controller.security.blacklist import FAIL_OPEN, is_token_blacklisted


@pytest.fixture
def mock_logger():
    """Patches the security logger is_token_blacklisted logs through, so
    tests can assert on what got logged without touching the real log file."""
    with patch("controller.security.blacklist.security_logger") as m:
        yield m


def test_returns_true_when_token_is_blacklisted(mock_logger):
    with patch("controller.security.blacklist.red") as mock_red:
        mock_red.get.return_value = "1"
        assert is_token_blacklisted("some-token") is True

    mock_logger.error.assert_not_called()


def test_returns_false_when_token_not_blacklisted(mock_logger):
    with patch("controller.security.blacklist.red") as mock_red:
        mock_red.get.return_value = None
        assert is_token_blacklisted("some-token") is False

    mock_logger.error.assert_not_called()


def test_fails_open_and_logs_error_on_redis_error(mock_logger):
    """
    A Redis outage must not lock every user out: the check should defer
    to FAIL_OPEN rather than raise, but that degradation is
    security-relevant and must be logged at error level rather than
    silently swallowed.
    """
    with patch("controller.security.blacklist.red") as mock_red:
        mock_red.get.side_effect = RedisConnectionError("redis unreachable")
        assert is_token_blacklisted("some-token") is not FAIL_OPEN

    mock_logger.error.assert_called_once()
    msg = mock_logger.error.call_args[0][0]
    assert "Redis error" in msg
    assert "redis unreachable" in msg


def test_fails_open_and_logs_error_on_unexpected_exception(mock_logger):
    with patch("controller.security.blacklist.red") as mock_red:
        mock_red.get.side_effect = RuntimeError("boom")
        assert is_token_blacklisted("some-token") is not FAIL_OPEN

    mock_logger.error.assert_called_once()
    msg = mock_logger.error.call_args[0][0]
    assert "unexpected error" in msg
    assert "boom" in msg

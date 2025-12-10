# Tests/unit/functions/test_time.py
import pytest
from datetime import datetime, timezone
import pytz
from types import SimpleNamespace
from Functions.time import parse_and_convert_timezone, ensure_utc_datetime

# ------------------------------
# parse_and_convert_timezone
# ------------------------------
def test_parse_and_convert_timezone_utc_string_with_z():
    time_str = "2025-10-28T15:30:00.123Z"
    task = SimpleNamespace(time_zone="PST")
    dt = parse_and_convert_timezone(time_str, task)
    assert dt.tzinfo.zone == "America/Los_Angeles"

    # Compute expected dynamically to handle DST
    expected = datetime(2025, 10, 28, 15, 30, tzinfo=timezone.utc).astimezone(pytz.timezone("America/Los_Angeles"))
    assert dt.hour == expected.hour

def test_parse_and_convert_timezone_no_milliseconds():
    time_str = "2025-10-28T15:30:00Z"
    task = SimpleNamespace(time_zone="EST")
    dt = parse_and_convert_timezone(time_str, task)
    assert dt.tzinfo.zone == "America/New_York"

    expected = datetime(2025, 10, 28, 15, 30, tzinfo=timezone.utc).astimezone(pytz.timezone("America/New_York"))
    assert dt.hour == expected.hour

def test_parse_and_convert_timezone_no_z():
    time_str = "2025-10-28T15:30:00.456"
    task = SimpleNamespace(time_zone="CST")
    dt = parse_and_convert_timezone(time_str, task)
    assert dt.tzinfo.zone == "America/Chicago"

    expected = datetime(2025, 10, 28, 15, 30, tzinfo=timezone.utc).astimezone(pytz.timezone("America/Chicago"))
    assert dt.hour == expected.hour

def test_parse_and_convert_timezone_unknown_timezone():
    time_str = "2025-10-28T15:30:00Z"
    task = SimpleNamespace(time_zone="UNKNOWN")
    dt = parse_and_convert_timezone(time_str, task)
    # Should fallback to UTC
    assert dt.tzinfo.zone == "UTC"
    assert dt.hour == 15

def test_parse_and_convert_timezone_none_task():
    time_str = "2025-10-28T15:30:00Z"
    dt = parse_and_convert_timezone(time_str, None)
    assert dt.tzinfo.zone == "UTC"
    assert dt.hour == 15

# ------------------------------
# ensure_utc_datetime
# ------------------------------
def test_ensure_utc_datetime_from_string_with_z():
    dt_str = "2025-10-28T15:30:00.123Z"
    dt = ensure_utc_datetime(dt_str)
    assert dt.tzinfo == timezone.utc
    assert dt.hour == 15

def test_ensure_utc_datetime_from_string_without_z():
    dt_str = "2025-10-28T15:30:00.123"
    dt = ensure_utc_datetime(dt_str)
    assert dt.tzinfo == timezone.utc
    assert dt.hour == 15

def test_ensure_utc_datetime_from_naive_datetime():
    naive_dt = datetime(2025, 10, 28, 15, 30, 0)
    dt = ensure_utc_datetime(naive_dt)
    assert dt.tzinfo == timezone.utc
    assert dt.hour == 15

def test_ensure_utc_datetime_from_aware_datetime():
    aware_dt = datetime(2025, 10, 28, 15, 30, 0, tzinfo=pytz.timezone("America/Los_Angeles"))
    dt = ensure_utc_datetime(aware_dt)
    # Should convert to UTC
    assert dt.tzinfo == timezone.utc
    assert dt.hour == 23  # 15:30 PDT -> 23:30 UTC

def test_ensure_utc_datetime_none():
    assert ensure_utc_datetime(None) is None

def test_ensure_utc_datetime_invalid_format_raises():
    dt_str = "2025-10-28T15:30:00.ABC"
    with pytest.raises(ValueError):
        ensure_utc_datetime(dt_str)



from datetime import datetime, timezone
from zoneinfo import ZoneInfo
timezone_list = {
    "PST": "America/Los_Angeles",
    "PDT": "America/Los_Angeles",
    "MST": "America/Denver",
    "MDT": "America/Denver",
    "CST": "America/Chicago",
    "CDT": "America/Chicago",
    "EST": "America/New_York",
    "EDT": "America/New_York",
}

def ensure_utc_datetime(dt):
    """
    Ensure a datetime object is timezone-aware and in UTC.
    If dt is a string, parse it as UTC.
    """
    if dt is None:
        return None
    if isinstance(dt, str):
        # Accepts ISO format with or without Z
        if dt.endswith("Z"):
            dt = dt[:-1]
        try:
            dt_obj = datetime.fromisoformat(dt)
        except Exception:
            dt_obj = datetime.strptime(dt, '%Y-%m-%dT%H:%M:%S.%f')
        return dt_obj.replace(tzinfo=timezone.utc)
    if getattr(dt, "tzinfo", None) is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)
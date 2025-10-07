#!/usr/bin/env python3
"""
Log cleanup script - removes entries older than retention period.
Handles multiple timestamp formats.
"""

import os
import re
from datetime import datetime, timedelta

def parse_timestamp(line):
    """
    Extract timestamp from multiple log formats.
    Supports:
    1. Logger format: 2024-05-10 09:15:00
    2. Gunicorn format: [01/Jan/2024:10:00:00 +0000]
    3. Gunicorn error format: [2024-01-01 10:00:00 +0000]
    """
    # Try Logger format first (at start of line)
    try:
        timestamp_str = line[:19]
        return datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
    except (ValueError, IndexError):
        pass

    # Try Gunicorn Apache format: [11/Dec/2024:05:10:15 +0000]
    match = re.search(r'\[(\d{2}/\w{3}/\d{4}:\d{2}:\d{2}:\d{2})\s+[+-]\d{4}\]', line)
    if match:
        timestamp_str = match.group(1)
        try:
            return datetime.strptime(timestamp_str, '%d/%b/%Y:%H:%M:%S')
        except ValueError:
            pass

    # Try error log format: [2024-01-01 10:00:00 +0000]
    match = re.search(r'\[(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+[+-]\d{4}\]', line)
    if match:
        timestamp_str = match.group(1)
        try:
            return datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
        except ValueError:
            pass

    return None


def cleanup_log_file(filepath, retention_days=90):
    """
    Clean up a log file by removing entries older than retention_days.
    """
    if not os.path.exists(filepath):
        print(f"  ⚠️  Skipping {os.path.basename(filepath)} (not found)")
        return

    now = datetime.now()
    cutoff = now - timedelta(days=retention_days)

    try:
        with open(filepath, 'r+') as f:
            lines = f.readlines()

            if not lines:
                print(f"  ⚠️  {os.path.basename(filepath)} is empty")
                return

            f.seek(0)

            last_parsed_time = None
            lines_kept = 0
            lines_removed = 0

            for line in lines:
                timestamp = parse_timestamp(line)

                if timestamp is not None:
                    # Found a timestamp
                    last_parsed_time = timestamp

                    if timestamp >= cutoff:
                        # Keep recent entries
                        f.write(line)
                        lines_kept += 1
                    else:
                        # Remove old entries
                        lines_removed += 1
                else:
                    # No timestamp (continuation line, stack trace, etc.)
                    # Keep it if the last parsed timestamp was recent
                    if last_parsed_time is not None and last_parsed_time >= cutoff:
                        f.write(line)
                        lines_kept += 1
                    else:
                        lines_removed += 1

            f.truncate()
            print(f"  ✅ {os.path.basename(filepath)}: kept {lines_kept}, removed {lines_removed}")

    except Exception as e:
        print(f"  ❌ Error processing {os.path.basename(filepath)}: {e}")


def main():
    # Configuration
    log_dir = os.path.dirname(os.path.abspath(__file__))
    retention_days = 90  # Change to 60 if you want
    log_files = [
        "gunicorn-access.log",
        "gunicorn-error.log",
        "all.log"
    ]

    cutoff_date = datetime.now() - timedelta(days=retention_days)

    print("="*60)
    print("🧹 Cleaning Up Logs")
    print("="*60)
    print(f"Retention: {retention_days} days")
    print(f"Cutoff date: {cutoff_date.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"(Removing logs older than this date)")
    print()

    for log_file in log_files:
        filepath = os.path.join(log_dir, log_file)
        cleanup_log_file(filepath, retention_days)

    print()
    print("="*60)
    print("✅ Cleanup complete!")
    print("="*60)


if __name__ == "__main__":
    main()
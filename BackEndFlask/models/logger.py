import os
import json
import shutil
import logging
import tempfile
from datetime import datetime, timedelta

from models.log_context import get_request_id, get_user_id

# Days of log history kept. In production, logrotate enforces this (the
# logrotate/CloudWatch configs in Cloud/syscontrol.sh must agree with it);
# elsewhere, trim_expired_entries() does, once at server start.
LOG_RETENTION_DAYS = 90

# Directory every log file lives in: /BackEndFlask/logs
LOG_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'logs'))

# Lowest level written. INFO by default so routine DEBUG lines (e.g. each
# auth decorator's "passed" line in CustomDecorators.py) don't multiply log
# volume and CloudWatch ingestion; set LOG_LEVEL=DEBUG to see them.
LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO').upper()

# The JSON log files this module writes (see the Logger instances at the
# bottom). gunicorn's own access/error logs aren't included: they only
# exist in production, where logrotate handles them.
APP_LOG_FILES = ('all.log', 'client_errors.log', 'security.log')


class JsonFormatter(logging.Formatter):
    """
    Description:
    Formats each log record as a single-line JSON object, tagging it with
    the request_id/user_id (if any) of the request currently being
    handled so every line touched by one request can be correlated.
    """

    def format(self, record: logging.LogRecord) -> str:
        payload = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": get_request_id(),
            "user_id": get_user_id(),
        }

        if record.exc_info:
            payload["exc_info"] = self.formatException(record.exc_info)

        return json.dumps(payload)


class Logger:
    """
    Description:
    Logs at different levels to the `logfile`.

    Rotation is deliberately NOT done in-process. Gunicorn runs several
    workers (see GUNICORN_CONFIG in Cloud/syscontrol.sh) and they all
    open the same file, so a TimedRotatingFileHandler in each one would
    race at the rollover: several processes renaming and reopening the
    same path can split or drop records. Instead logrotate rotates these
    files with `copytruncate`, which truncates in place rather than
    renaming, so the file descriptor held here stays valid and no worker
    needs to be signalled to reopen. Retention lives there too and must
    match LOG_RETENTION_DAYS. Outside production there's no logrotate, so
    trim_expired_entries() applies the same retention at server start.
    """

    def __init__(self, name: str, logfile: str|None = None):
        """
        Description:
        Create a new logger.

        Parameters:
        name: str: Name of the logger.
        logfile: str|None: The output of the logger. None for
                           logs/all.log, or provide a filepath.
        """
        self.logger = logging.getLogger(name)
        self.logger.setLevel(LOG_LEVEL)
        formatter = JsonFormatter()
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)

        # Default path to: /BackEndFlask/logs/all.log
        if logfile is None:
            logfile = os.path.join(LOG_DIR, 'all.log')

        # FileHandler creates the file itself if it doesn't exist yet.
        # Appending (the default) is what makes logrotate's copytruncate
        # safe across workers.
        filehandler = logging.FileHandler(logfile)
        filehandler.setFormatter(formatter)
        self.logger.addHandler(filehandler)


    def debug(self, msg: str) -> None:
        """
        Description:
        Log at level `debug`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.logger.debug(msg)


    def info(self, msg: str) -> None:
        """
        Description:
        Log at level `info`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.logger.info(msg)


    def warning(self, msg: str) -> None:
        """
        Description:
        Log at level `warning`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.logger.warning(msg)


    def error(self, msg: str) -> None:
        """
        Description:
        Log at level `error`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.logger.error(msg)


    def exception(self, msg: str) -> None:
        """
        Description:
        Log at level `error`, appending the traceback of the exception
        currently being handled. Only call from inside an except block.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.logger.exception(msg)


    def critical(self, msg: str) -> None:
        """
        Description:
        Log at level `critical`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.logger.critical(msg)

    def password_reset(self, user_id:str, lms_id:str, first_name:str, last_name:str, email:str):
        log_msg = (f"Password Reset Request - User: {user_id}, "
                   f"LMS: {lms_id}, "
                   f"Name: {first_name} {last_name}, "
                    f"Email: {email},")
        self.logger.info(log_msg)
    
def _entry_time(line: str) -> datetime|None:
    """
    Description:
    The timestamp a log line was written at: the "timestamp" field of a
    JSON line (JsonFormatter), or the leading "YYYY-MM-DD HH:MM:SS" of a
    line from the older plain-text format. None if the line has neither.
    """
    try:
        return datetime.fromisoformat(json.loads(line)["timestamp"])
    except (ValueError, KeyError, TypeError):
        pass

    try:
        return datetime.strptime(line[:19], "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None


def trim_expired_entries(retention_days: int = LOG_RETENTION_DAYS) -> None:
    """
    Description:
    Drops entries older than `retention_days` from the app's own log
    files. This is the retention for setups logrotate doesn't cover
    (Docker Compose and setupEnv.py, which never run Cloud/syscontrol.sh).
    setupEnv.py calls it once at server start, before the server process
    exists, so it can't race any worker's writes the way per-write
    trimming would. Production gets its retention from logrotate instead.

    Each file is rewritten in place (same inode) rather than replaced,
    so a FileHandler this process already opened in append mode stays
    valid. A line with no timestamp of its own (e.g. a continuation of an
    old multi-line entry) is kept or dropped along with the entry before it.
    """
    cutoff = datetime.now() - timedelta(days=retention_days)

    for name in APP_LOG_FILES:
        path = os.path.join(LOG_DIR, name)

        if not os.path.exists(path):
            continue

        with open(path, 'r+', encoding='utf-8', errors='replace') as f, \
                tempfile.TemporaryFile('w+', encoding='utf-8') as kept:
            keep = False

            for line in f:
                written_at = _entry_time(line)

                if written_at is not None:
                    keep = written_at >= cutoff

                if keep:
                    kept.write(line)

            kept.seek(0)
            f.seek(0)
            shutil.copyfileobj(kept, f)
            f.truncate()


# The application log. Everything the server itself decides to say.
logger = Logger("rubricapp_logger")

# Errors reported by the frontend. Kept out of `logger` because the volume is
# driven by clients we don't control, so it must not be able to bury or
# out-rotate the application's own records.
client_logger = Logger("rubricapp_client_logger", logfile=os.path.join(LOG_DIR, 'client_errors.log'))

# Security/infrastructure degradations (e.g. an unreachable Redis blacklist).
# Kept separate for the same reason: these fire once per request while the
# dependency is down, so they'd flood the application log.
security_logger = Logger("rubricapp_security_logger", logfile=os.path.join(LOG_DIR, 'security.log'))

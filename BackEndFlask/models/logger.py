import os
import logging
from logging.handlers import TimedRotatingFileHandler

# Number of daily rotated log files to keep before the oldest is deleted.
LOG_RETENTION_DAYS = 90

class Logger:
    """
    Description:
    Logs at different levels to the `logfile`. The log file rotates
    at midnight and rotated files older than LOG_RETENTION_DAYS are
    deleted automatically by the logging module.
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
        self.logger.setLevel(logging.DEBUG)
        formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)

        # Default path to: /BackEndFlask/logs/all.log
        if logfile is None:
            logfile = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'logs', 'all.log'))

        # TimedRotatingFileHandler creates the file itself if it doesn't
        # exist yet, and deletes rotated files past backupCount for us.
        filehandler = TimedRotatingFileHandler(
            logfile, when="midnight", backupCount=LOG_RETENTION_DAYS
        )
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
    
logger = Logger("rubricapp_logger")
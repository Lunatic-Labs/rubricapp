import os
import logging
from datetime import datetime, timedelta

class Logger:
    """
    Description:
    Logs at different levels to the `logfile`.
    After every log, if 90 days has passed, it
    will clear the file.
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
        self.__last_clear = datetime.now()

        # Default path to: /BackEndFlask/logging/all.log
        if logfile is None:
            default_logfile = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'logs', 'all.log'))
            if not os.path.exists(default_logfile):
                fp = open(default_logfile, "w").close()
            filehandler = logging.FileHandler(default_logfile)

        # Custom Path.
        else:
            filehandler = logging.FileHandler(logfile)

        filehandler.setFormatter(formatter)
        self.logger.addHandler(filehandler)

    def __try_clear(self):
        """
        Description:
        Clears all entries that are older than 90 days.
        """
        now = datetime.now()
        for handler in self.logger.handlers:
            if isinstance(handler, logging.FileHandler):
                self.__ensure_log_exists(handler.baseFilename)
                with open(handler.baseFilename, 'r+') as f:
                    lines = f.readlines()
                    f.seek(0)
                    kept_lines = []
                    for line in lines:
                        try:
                            timestamp_str = line.split(' - ')[0]
                            try:
                                entry_time = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S,%f")
                            except ValueError:
                                entry_time = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

                            # Keep only entries newer than 90 days
                            if (now - entry_time).days <= 90:
                                kept_lines.append(line)
                        except Exception:
                            kept_lines.append(line)
                    f.seek(0)
                    f.truncate()
                    f.writelines(kept_lines)


    def __ensure_log_exists(self, filepath):
        if not os.path.exists(filepath):
            open(filepath, "w").close()
    

    def debug(self, msg: str) -> None:
        """
        Description:
        Log at level `debug`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.__try_clear()
        self.logger.debug(msg)


    def info(self, msg: str) -> None:
        """
        Description:
        Log at level `info`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.__try_clear()
        self.logger.info(msg)


    def warning(self, msg: str) -> None:
        """
        Description:
        Log at level `warning`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.__try_clear()
        self.logger.warning(msg)


    def error(self, msg: str) -> None:
        """
        Description:
        Log at level `error`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.__try_clear()
        self.logger.error(msg)


    def critical(self, msg: str) -> None:
        """
        Description:
        Log at level `critical`.

        Paramters:
        msg: str: The message to be displayed.
        """
        self.__try_clear()
        self.logger.critical(msg)

    def password_reset(self, user_id:str, lms_id:str, first_name:str, last_name:str, email:str):
        self.__try_clear()
        log_msg = (f"Password Reset Request - User: {user_id}, "
                   f"LMS: {lms_id}, "
                   f"Name: {first_name} {last_name}, "
                    f"Email: {email},")
        self.logger.info(log_msg)
    
logger = Logger("rubricapp_logger")

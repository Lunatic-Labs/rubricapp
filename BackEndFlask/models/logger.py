import os
import logging
from datetime import datetime, timedelta

class Logger:
    """
    Description:
    Logs at different levels to the `logfile`.
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
            filehandler = logging.FileHandler(default_logfile)

        # Custom Path.
        else:
            filehandler = logging.FileHandler(logfile)

        filehandler.setFormatter(formatter)
        self.logger.addHandler(filehandler)


    def __try_clear(self):
        """
        Description:
        Checks if 90 days has passed since last clear.
        If 90 days has passed, it clears the logfile
        and resets the 90 day time period.
        """
        now = datetime.now()
        if now - self.__last_clear >= timedelta(days=90):
            self.__last_clear = now
            self.logger.handlers[1].doRollover()


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

logger = Logger("rubricapp_logger")

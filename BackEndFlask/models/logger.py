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

        self.password_logger = logger.getLogger(f"{name}_password_resets")
        self.password_logger.setLevel(logging.info)

        password_logfile = os.path.abspath(os.path.join(os.path.dirname(__file__),'..','logs','password_reset.log'))
        if not os.path.exists(password_logfile):
            open(password_logfile, "w").close()
    
        password_filehandler = logging.FileHandler(password_logfile)
        password_filehandler.setFormatter(formatter)
        self.password_logger.addHandler(password_filehandler)


    def __try_clear(self):
        """
        Description:
        Clears all entries that are older than 90 days.
        """
        now = datetime.now()

        for handler in self.logger.handlers:
            if isinstance(handler, logging.FileHandler):
                with open(handler.baseFilename, 'r+') as f:
                    lines = f.readlines()

                    f.seek(0)

                    last_parsed_time = None

                    for line in lines:
                        try:
                            date = datetime.strptime(line[:19], "%Y-%m-%d %H:%M:%S")

                            if now - date < timedelta(days=90):
                                f.write(line)

                            last_parsed_time = date

                        except:
                            if last_parsed_time != None and now - last_parsed_time < timedelta(days=90):
                                f.write(line)

                        else:
                            break

                    f.truncate()


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
        self.password_logger.info(log_msg)
    
logger = Logger("rubricapp_logger")

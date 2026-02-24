#---------------------------------------------------
# Contains system-wide email bounced enums.
#---------------------------------------------------

from enum import Enum

class BouncedEmailFields(Enum):
    """ Represents the feilds a bounced email dict has in the utility.py file."""
    ID = 'id'
    TO = 'to'
    MSG = 'msg'
    SENDER = 'sender'
    MAIN_FAILURE = 'main_failure'

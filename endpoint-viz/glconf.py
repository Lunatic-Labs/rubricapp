from enum import Enum

class Flag(Enum):
    NOCOLOR   = 1 << 0
    NOGUI     = 1 << 1
    EXPORTMAP = 1 << 2


class GlobalConfig:
    def __init__(self):
        self.flags   = 0x0000
        self.pypath  = None
        self.tsxpath = None


state = GlobalConfig()

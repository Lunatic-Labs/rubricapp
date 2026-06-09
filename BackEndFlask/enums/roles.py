#-----------------------------------------------------
# Contains system-wide roles that a given user can be. 
#-----------------------------------------------------

from enum import Enum

class Roles(Enum):
    """
    Represents a user role.
    
    Value(str)
    """

    RESEARCHER    = 1 
    SUPER_ADMIN   = 2
    ADMIN         = 3
    TA_INSTRUCTOR = 4
    STUDENT       = 5
    TEST_STUDENT  = 6

# Returns an array of roles with equal or greater authorization.
def roles_at_or_above(role: Roles):
    return [r for r in Roles if r.value <= role.value]

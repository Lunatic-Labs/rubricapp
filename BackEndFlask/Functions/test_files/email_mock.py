#-------------------------------------------------------------------------
# The purpose of this file is to crate mock objects for google's 
# api so that at local host level we use fake objects and at a higher
# level we use the real api.
#-------------------------------------------------------------------------

def switch_to_mock_infrastructure(switch:bool = False):
    return True
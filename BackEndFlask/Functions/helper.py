from Functions.test_files.PopulationFunctions import *
from Functions.customExceptions import *
from models.user import *
from models.team import *

def helper_ok(field: any) -> bool:
    """
    Description
    Checks if the field is of type str. Since we are checking
    if sqlalchemy objects returned a string, this is just
    a nice helper function to make the code more readable.

    Parameters
    field: any: The field to be checked.

    Returns
    Boolean: True if the field is *not* of type str, False otherwise.
    """
    if type(field) is str:
        return False
    return True


def helper_str_to_int_role(role: str) -> int:
    """
    Description
    Gives the appropriate role as an int from a string

    Parameters
    role: str: the verbose role name ie "student" or "ta"

    Returns
    int: the appropriate role number
    """
    lrole = role.lower()
    if lrole == "student":
        return 5
    elif lrole == "ta":
        return 4
    else:
        raise InvalidRole


def helper_verify_email_syntax(email: str) -> bool:
    """
    Description
    Checks if the email is valid.

    Parameters
    email: str: The email to be checked.

    Returns
    Boolean: True if the email is valid, False otherwise.
    """
    if ' ' in email or '@' not in email or not is_valid_email(email):
        return False
    return True


def helper_cleanup(cleanup_arr: list[any], return_val: any) -> any:
    """
    Description
    This function is used for when we want to clean up after some action.
    Mostly used for errors.

    Parameters
    cleanup_arr: List[any]: The list of things to clean up ordered as:
                            [xlsx_file, is_xlsx, csv_file]
    return_val:  any:       The value to return.

    Returns
        any: The return value.
    """

    # Constants for readability.
    XLSX_FILE: int = 0
    IS_XLSX: int = 1
    CSV_FILE: int = 2

    delete_xlsx(cleanup_arr[XLSX_FILE], cleanup_arr[IS_XLSX])
    if cleanup_arr[CSV_FILE] is not None:
        cleanup_arr[CSV_FILE].close()
    return return_val


"""
NOTE: removed `password` field from func arguments to
address a bug where bulk uploading users did not recieve
an email. Currently only "genericImport.py" and "teamBulkUpload.py"
use this function, and they do not specify a password. If any other
future modules need to use this function and need to set a password,
make sure to update those files accordingly.
"""
def helper_create_user(
        fname: str,
        lname: str,
        email: str,
        role_id: int,
        lms_id: int|None,
        owner_id: int,
        consent=None
    ):
    return create_user({
        "first_name": fname,
        "last_name":  lname,
        "email":      email,
        "role_id":    role_id,
        "lms_id":     lms_id,
        "owner_id":   owner_id,
        "consent":    consent
    })

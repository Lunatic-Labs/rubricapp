from Functions.test_files.population_functions import *
from Functions.customExceptions import *
from models.user import *


def helper_ok(field) -> bool:
    """
    Checks if `field` is an actual object returned from the database
    or if it contains an error message.
    @param field: the field to be checked
    @param roster_file: the file that will be deleted if `field` is an error message
    @param is_xlsx: boolean that states if it is a .xlsx file
    @return: boolean, true -> it exists, false -> error message
    """
    if type(field) is str:  # Is of type(str) if an error is returned.
        return False
    return True


def helper_verify_email_syntax(email):
    if ' ' in email or '@' not in email or not isValidEmail(email):
        return False
    return True


def helper_cleanup(cleanup_arr, return_val, save_point=None):
    """
    This function is to be called when an error is encountered.
    @param xlsx_file: TODO
    @param is_xlsx: whether or not the file is .xlsx
    @param return_val: the value to be returned
    @param csv_file: csv file we are working with
    @return: return_val
    """
    xlsx_file = 0
    is_xlsx = 1
    csv_file = 2
    # if save_point is not None:
    #     save_point.close()
    delete_xlsx(cleanup_arr[xlsx_file], cleanup_arr[is_xlsx])
    if cleanup_arr[csv_file] is not None:
        cleanup_arr[csv_file].close()
    return return_val


def helper_create_user(fname, lname, email, role_id, lms_id, owner_id, password="Skillbuilder", consent=None):
    return create_user({
        "first_name": fname,
        "last_name":  lname,
        "email":      email,
        "password":   password,
        "role_id":    role_id,
        "lms_id":     lms_id,
        "consent":    None,
        "owner_id":   owner_id
    }, commit=False)

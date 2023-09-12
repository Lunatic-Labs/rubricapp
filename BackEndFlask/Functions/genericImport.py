from typing import List

from Functions.test_files.population_functions import *
from Functions.customExceptions import *
from models.user import *
from models.role import get_role  # used for getting role id from string role
from models.user_course import *
from sqlalchemy import *
import itertools
import csv


def __field_exists(field, user_file, is_xlsx) -> bool:
    """
    Checks if `field` is an actual object returned from the database
    or if it contains an error message.
    @param field: the field to be checked
    @param user_file: the file that will be deleted if `field` is an error message
    @param is_xlsx: boolean that states if it is a .xlsx file
    @return: boolean, true -> it exists, false -> error message
    """
    if type(field) is str:  # Is of type(str) if a error is returned.
        delete_xlsx(user_file, is_xlsx)
        return False
    return True


# TODO: Require password.
# TODO: Do something with `owner_id`.
# TODO: Check to make sure role_id is not None.
# TODO: `isValidEmail()` should check for `' '` and `@` already.
# TODO: `lms_id` needs functionality to be taken as optional when instantiating a new `user`.
def genericcsv_to_db(user_file: str, owner_id: int, course_id: int) -> None | str:
    """
    For bulk uploading either a student or TA.
    @param user_file: file that is uploaded
    @param owner_id: ???
    @param course_id: ID of the course
    @return: None on success, str for an error message
    """
    if not user_file.endswith('.csv') and not user_file.endswith('.xlsx'):
        return WrongExtension.error

    # Determine if file is .xlsx.
    is_xlsx = user_file.endswith('.xlsx')
    if is_xlsx:
        user_file = xlsx_to_csv(user_file)

    try:
        student_csv = open(user_file, mode='r', encoding='utf-8-sig')
    except FileNotFoundError:
        delete_xlsx(user_file, is_xlsx)
        return FileNotFound.error

    # Renamed `reader` -> `roster`.
    roster: list[list[str]] = list(itertools.tee(csv.reader(student_csv))[0])

    for row in range(0, len(roster)):
        # Renamed `header` -> `person_attribs`.
        person_attribs: list[str] = roster[row]

        # Checking for 4 for: FN LN, email, role, (optional) LMS ID
        if len(person_attribs) < 3:
            delete_xlsx(user_file, is_xlsx)
            return NotEnoughColumns.error

        # Checking for 4 for: FN LN, email, role, (optional) LMS ID
        if len(person_attribs) > 4:
            delete_xlsx(user_file, is_xlsx)
            return TooManyColumns.error

        name = person_attribs[0].strip()  # FN,LN
        last_name = name.replace(",", "").split()[0].strip()
        first_name = name.replace(",", "").split()[1].strip()
        email = person_attribs[1].strip()
        role = person_attribs[2].strip()
        lms_id = None

        # Corrosponding role ID for the string `role`.
        role_id: int | None = get_role(role)

        # If the len of `header` == 4, then the LMS ID is present.
        if len(person_attribs) == 4:
            lms_id = person_attribs[3].strip()

        if ' ' in email or '@' not in email or not isValidEmail(email):
            delete_xlsx(user_file, is_xlsx)
            return SuspectedMisformatting.error

        # If `lms_id` is present, and it does not consist of digits
        # then it is invalid.
        if lms_id is not None and not lms_id.isdigit():
            delete_xlsx(user_file, is_xlsx)
            return SuspectedMisformatting.error

        user: str | None = get_user_by_email(email)

        if not __field_exists(user, user_file, is_xlsx):
            return user

        # If the user is not already in the DB.
        if user is None:
            created_user = create_user({
                "first_name": first_name,
                "last_name":  last_name,
                "email":      email,
                "password":   "Skillbuilder",
                "role_id":    role_id,
                "lms_id":     lms_id,  # TODO: This needs functionality to be taken as optional.
                "consent":    None,  # NOTE: Not sure what to do with this.
                "owner_id":   owner_id  # NOTE: Not sure what to do with this.
            })
            if not __field_exists(created_user, user_file, is_xlsx):
                return created_user

        user_id = get_user_user_id_by_email(email)
        if not __field_exists(user_id, user_file, is_xlsx):
            return user_id

        user_course: str | None = get_user_course_by_user_id_and_course_id(user_id, course_id)
        if not __field_exists(user_course, user_file, is_xlsx):
            return user_course

        if user_course is None:
            user_id = get_user_user_id_by_email(email)
            if not __field_exists(user_id, user_file, is_xlsx):
                return user_id

            user_course = create_user_course({
                "user_id": user_id,
                "course_id": course_id
            })

            if not __field_exists(user_course, user_file, is_xlsx):
                return user_course

    student_csv.close()
    delete_xlsx(user_file, is_xlsx)
    return None

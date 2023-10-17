from typing import List

from Functions.test_files.population_functions import *
from Functions.helper import helper_verify_email_syntax, helper_create_user, helper_ok, helper_cleanup
from Functions.customExceptions import *
from models.user import *
from models.role import get_role  # used for getting role id from string role
from models.user_course import *
from sqlalchemy import *
import itertools
import csv


# TODO: Require password.
# TODO: Check to make sure role_id is not None.
# TODO: `lms_id` needs functionality to be taken as optional when instantiating a new `user`.
def genericcsv_to_db(user_file: str, owner_id: int, course_id: int):
    """
    For bulk uploading either a student or TA.
      user_file: file that is uploaded
      owner_id: ???
      course_id: ID of the course
      return: None on success, str for an error message
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

        min_person_attribs_count = 3  # Checking for 3 for: FN LN, email, role
        max_person_attribs_count = 4  # Checking for 4 for: FN LN, email, role, (optional) LMS ID

        if len(person_attribs) < min_person_attribs_count:
            return helper_cleanup(user_file, is_xlsx, NotEnoughColumns.error, student_csv)

        if len(person_attribs) > max_person_attribs_count:
            return helper_cleanup(user_file, is_xlsx, TooManyColumns.error, student_csv)

        name = person_attribs[0].strip()  # FN,LN
        last_name = name.replace(",", "").split()[0].strip()
        first_name = name.replace(",", "").split()[1].strip()
        email = person_attribs[1].strip()
        role = person_attribs[2].strip()
        lms_id = None

        # Corresponding role ID for the string `role`.
        # TODO: returns tuple, check for the ID attr, or the name.
        role = get_role(role)
        if not helper_ok(role, user_file, is_xlsx):
            return helper_cleanup(user_file, is_xlsx, role, student_csv)
        role_id = role.role_id

        # If the len of `header` == 4, then the LMS ID is present.
        if len(person_attribs) == 4:
            lms_id = person_attribs[3].strip()

        if not helper_verify_email_syntax(email):
            return helper_cleanup(user_file, is_xlsx, SuspectedMisformatting.error, student_csv)

        # If `lms_id` is present, and it does not consist of digits
        # then it is invalid.
        if lms_id is not None and not lms_id.isdigit():
            return helper_cleanup(user_file, is_xlsx, SuspectedMisformatting.error, student_csv)

        user = get_user_by_email(email)

        if not helper_ok(user, user_file, is_xlsx):
            return helper_cleanup(user_file, is_xlsx, user, student_csv)

        # If the user is not already in the DB.
        if user is None:
            created_user = helper_create_user(first_name, last_name, email, role_id, lms_id, owner_id)
            if not helper_ok(created_user, user_file, is_xlsx):
                return created_user

        user_id = get_user_user_id_by_email(email)
        if not helper_ok(user_id, user_file, is_xlsx):
            return helper_cleanup(user_file, is_xlsx, user_id, student_csv)

        user_course = get_user_course_by_user_id_and_course_id(user_id, course_id)
        if not helper_ok(user_course, user_file, is_xlsx):
            return helper_cleanup(user_file, is_xlsx, user_course, student_csv)

        if user_course is None:
            user_id = get_user_user_id_by_email(email)
            if not helper_ok(user_id, user_file, is_xlsx):
                return helper_cleanup(user_file, is_xlsx, user_id, student_csv)

            user_course = create_user_course({
                "user_id": user_id,
                "course_id": course_id
            })

            if not helper_ok(user_course, user_file, is_xlsx):
                return helper_cleanup(user_file, is_xlsx, user_course, student_csv)

    return helper_cleanup(user_file, is_xlsx, None, student_csv)

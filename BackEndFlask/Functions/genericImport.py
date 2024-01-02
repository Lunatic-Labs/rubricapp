from typing import List

from core import db
from Functions.test_files.population_functions import *
from Functions.helper import helper_verify_email_syntax, helper_create_user, helper_ok, helper_cleanup
from Functions.customExceptions import *
from models.user import *
from models.role import get_role  # used for getting role id from string role
from models.user_course import *
from sqlalchemy import *
import itertools
import csv

def genericcsv_to_db(user_file: str, owner_id: int, course_id: int) -> None|str:
    """
    DESCRIPTION:
    Takes a csv file and creates users of any type (student, TA, etc.)
    and adds them to the database.

    PARAMETERS:
    user_file: str: The path to the csv file.
    owner_id: int:  The user_id of the owner of the course.
    course_id: int: The course_id of the course to add the users to.

    RETURNS:
    None|str: None if the function was successful, otherwise an error message.
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

    cleanup_arr: List[any] = [user_file, is_xlsx, student_csv]

    # Renamed `reader` -> `roster`.
    roster: list[list[str]] = list(itertools.tee(csv.reader(student_csv))[0])

    created_user_ids: list[int] = []
    created_course_id: int = None

    for row in range(0, len(roster)):
        person_attribs: list[str] = roster[row]

        MIN_PERSON_ATTRIBS_COUNT: int = 3  # Checking for 3 for: FN LN, email, role
        MAX_PERSON_ATTRIBS_COUNT: int = 4  # Checking for 4 for: FN LN, email, role, (optional) LMS ID

        if len(person_attribs) < MIN_PERSON_ATTRIBS_COUNT:
            return helper_cleanup(cleanup_arr, NotEnoughColumns.error)

        if len(person_attribs) > MAX_PERSON_ATTRIBS_COUNT:
            return helper_cleanup(cleanup_arr, TooManyColumns.error)

        name: str = person_attribs[0].strip()  # FN,LN
        last_name: str = name.replace(",", "").split()[0].strip()
        first_name: str = name.replace(",", "").split()[1].strip()
        email: str = person_attribs[1].strip()
        role: int = person_attribs[2].strip()
        lms_id: int|None = None

        # Corresponding role ID for the string `role`.
        # TODO: returns tuple, check for the ID attr, or the name.
        role = get_role(role)
        if isinstance(role, str):
            return helper_cleanup(cleanup_arr, role)
        role_id = role.role_id

        # If the len of `header` == 4, then the LMS ID is present.
        if len(person_attribs) == 4:
            lms_id = person_attribs[3].strip()

        if not helper_verify_email_syntax(email):
            return helper_cleanup(cleanup_arr, SuspectedMisformatting.error)

        # If `lms_id` is present, and it does not consist of digits
        # then it is invalid.
        if lms_id is not None and not lms_id.isdigit():
            return helper_cleanup(cleanup_arr, SuspectedMisformatting.error)

        user = get_user_by_email(email)

        if isinstance(user, str):
            return helper_cleanup(cleanup_arr, user)

        # If the user is not already in the DB.
        if user is None:
            created_user = helper_create_user(first_name, last_name, email, role_id, lms_id, owner_id)
            if isinstance(created_user, str):
                return helper_cleanup(cleanup_arr, created_user)
            created_user_ids.append(created_user.user_id)

        user_id = get_user_user_id_by_email(email)
        if isinstance(user_id, str):
            return helper_cleanup(cleanup_arr, user_id)

        user_course = get_user_course_by_user_id_and_course_id(user_id, course_id)
        if isinstance(user_course, str):
            return helper_cleanup(cleanup_arr, user_course)

        if user_course is None:
            user_id = get_user_user_id_by_email(email)
            if isinstance(user_id, str):
                return helper_cleanup(cleanup_arr, user_id)

            user_course = create_user_course({
                "user_id": user_id,
                "course_id": course_id,
                "role_id": role_id,
            })

            if isinstance(user_course, str):
                return helper_cleanup(cleanup_arr, user_course)
            user_course_id = user_course.user_course_id

    return helper_cleanup(cleanup_arr, "Upload Successful!")

from typing import List

from core import db
from Functions.test_files.PopulationFunctions import *
from Functions.helper import *
from Functions.customExceptions import *
from models.user import *
from models.role import get_role  # used for getting role id from string role
from models.user_course import *
from sqlalchemy import *
import itertools
import csv

def __add_user(owner_id, course_id, first_name, last_name, email, role_id, lms_id):
        """
        Description
        Adds the user to the DB based on the function parameters

        Parameters
        owner_id: int:  The user_id of the owner of the course.
        course_id: int: The course_id of the course to add the users to.
        first_name: str: first name of the user
        last_name: str: last name of the user
        email: str: email of the user
        role_id: int: role ID of the user
        lms_id: int: LMS ID of the user

        Returns
        None
        """

        user = get_user_by_email(email)

        # If the user is not already in the DB.
        if user is None:
            helper_create_user(first_name, last_name, email, role_id, lms_id, owner_id)

        else:
            updated_user_first_name = user.first_name

            if first_name != user.first_name:
                updated_user_first_name = first_name

            updated_user_last_name = user.last_name

            if last_name != user.last_name:
                updated_user_first_name = last_name

            updated_user_lms_id = user.lms_id

            if lms_id != user.lms_id:
                updated_user_lms_id = lms_id

            user_data = {
                "first_name": updated_user_first_name,
                "last_name": updated_user_last_name,
                "lms_id": updated_user_lms_id,
                "email": user.email,
                "password": user.password,
                "consent": user.consent,
                "owner_id": user.owner_id,
            }

            replace_user(user_data, user.user_id)

        user_id = get_user_user_id_by_email(email)

        user_course = get_user_course_by_user_id_and_course_id(user_id, course_id)

        if user_course is None:
            create_user_course({
                "user_id": user_id,
                "course_id": course_id,
                "role_id": role_id,
            })

        else:
            set_inactive_status_of_user_to_active(user_course.user_course_id)


def generic_csv_to_db(user_file: str, owner_id: int, course_id: int) -> None|str:
    """
    Description:
    Takes a csv file and creates users of any type (student, TA, etc.)
    and adds them to the database.

    Parameters:
    user_file: str: The path to the csv file.
    owner_id: int:  The user_id of the owner of the course.
    course_id: int: The course_id of the course to add the users to.

    Returns:
    None: On success.
    """
    student_csv: None|object = None

    is_xlsx: bool|None = None

    try:
        if not user_file.endswith('.csv') and not user_file.endswith('.xlsx'):
            raise WrongExtension

        # Determine if file is .xlsx.
        is_xlsx = user_file.endswith('.xlsx')

        if is_xlsx:
            user_file = xlsx_to_csv(user_file)

        try:
            student_csv = open(user_file, mode='r', encoding='utf-8-sig')

        except FileNotFoundError:
            delete_xlsx(user_file, is_xlsx)

            raise FileNotFound

        # Renamed `reader` -> `roster`.
        roster: list[list[str]] = list(itertools.tee(csv.reader(student_csv))[0])

        # For keeping students in a "queue" as we are parsing
        # the file. During parsing, we add the relevant information
        # to this list (first_name, last_name, email, role_id, lms_id).
        students: list[tuple] = []

        for row in range(0, len(roster)):
            person_attribs: list[str] = roster[row]

            # Skip all newlines for convenience
            if len(person_attribs) == 0:
                continue

            MIN_PERSON_ATTRIBS_COUNT: int = 3  # Checking for 3 for: FN LN, email, role

            MAX_PERSON_ATTRIBS_COUNT: int = 4  # Checking for 4 for: FN LN, email, role, (optional) LMS ID

            if len(person_attribs) < MIN_PERSON_ATTRIBS_COUNT:
                raise NotEnoughColumns

            if len(person_attribs) > MAX_PERSON_ATTRIBS_COUNT:
                raise TooManyColumns

            name: str = person_attribs[0].strip()  # FN,LN

            last_name: str = name.replace(",", "").split()[0].strip()

            first_name: str = name.replace(",", "").split()[1].strip()

            email: str = person_attribs[1].strip()

            role: str = person_attribs[2].strip()

            lms_id: int|None = None

            role = helper_str_to_int_role(role)

            # Corresponding role ID for the string `role`.
            # TODO: returns tuple, check for the ID attr, or the name.
            role = get_role(role)

            role_id = role.role_id

            # If the len of `header` == 4, then the LMS ID is present.
            if len(person_attribs) == 4:
                lms_id = person_attribs[3].strip()

            if not helper_verify_email_syntax(email):
                raise SuspectedMisformatting

            students.append((first_name, last_name, email, role_id, lms_id))

        for first_name, last_name, email, role_id, lms_id in students:
            __add_user(owner_id, course_id, first_name, last_name, email, role_id, lms_id)

        student_csv.close()

        delete_xlsx(user_file, is_xlsx)

        return None

    except Exception as e:
        if student_csv is not None:
            student_csv.close()

        if is_xlsx is not None:
            delete_xlsx(user_file, is_xlsx)

        raise e

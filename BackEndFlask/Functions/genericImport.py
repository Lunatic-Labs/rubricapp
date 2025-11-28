from typing import List, Dict, Tuple as TypingTuple

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

def validate_row(row: List[str], row_num: int, seen_emails: Dict[str, int], 
                seen_lms_ids: Dict[str, int], valid_roles: List[str]) -> TypingTuple[str, str, str, str, str]:
    """Validates a single row of CSV data and returns parsed values"""

    # Check column count
    if len(row) < 3:
        raise NotEnoughColumns(row_num, 3, len(row))
    if len(row) > 4:
        raise TooManyColumns(row_num, 4, len(row))

    # Validate and parse name
    name = row[0].strip()
    if ',' not in name:
        raise InvalidNameFormat(row_num, name)

    last_name = name.split(',')[0].strip()
    first_name = name.split(',')[1].strip()

    if not last_name or not first_name:
        raise InvalidNameFormat(row_num, name)

    # Validate email
    email = row[1].strip()
    if not helper_verify_email_syntax(email):
        raise InvalidEmail(row_num, email)

    if email in seen_emails:
        raise DuplicateEmail(email, [seen_emails[email], row_num])
    seen_emails[email] = row_num

    # Validate role
    role = row[2].strip()
    if role not in valid_roles:
        raise InvalidRole(row_num, role, valid_roles)

    # Validate optional LMS ID
    lms_id = None
    if len(row) == 4 and row[3].strip():
        lms_id = row[3].strip()
        if not lms_id.isdigit():
            raise InvalidLMSID(row_num, lms_id)
        if lms_id in seen_lms_ids:
            raise DuplicateLMSID(lms_id, [seen_lms_ids[lms_id], row_num])
        seen_lms_ids[lms_id] = row_num

    return first_name, last_name, email, role, lms_id

def __add_user(owner_id, course_id, first_name, last_name, email, role_id, lms_id, validate_emails):
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
        validate_emails: bool: whether or not create_user should spawn a thread
                               checking for bounced emails after creating the user.

        Returns
        None
        """

        user = get_user_by_email(email)

        # If the user is not already in the DB.
        if user is None:
            helper_create_user(first_name, last_name, email, role_id, lms_id, owner_id, validate_emails)

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

        if not roster:
            raise EmptyFile()

        # For keeping students in a "queue" as we are parsing
        # the file. During parsing, we add the relevant information
        # to this list (first_name, last_name, email, role_id, lms_id).
        students: list[tuple] = []
        
        # Track duplicate checks
        seen_emails: dict[str, int] = {}
        seen_lms_ids: dict[str, int] = {}
        valid_roles = ["Student", "TA", "Instructor"]

        for row in range(0, len(roster)):
            person_attribs: list[str] = roster[row]

            # Skip empty rows
            if len(person_attribs) == 0:
                continue

            MIN_PERSON_ATTRIBS_COUNT: int = 3  # Checking for 3 for: FN LN, email, role

            MAX_PERSON_ATTRIBS_COUNT: int = 4  # Checking for 4 for: FN LN, email, role, (optional) LMS ID

            if len(person_attribs) < MIN_PERSON_ATTRIBS_COUNT:
                raise NotEnoughColumns(row + 1, MIN_PERSON_ATTRIBS_COUNT, len(person_attribs))

            if len(person_attribs) > MAX_PERSON_ATTRIBS_COUNT:
                raise TooManyColumns(row + 1, MAX_PERSON_ATTRIBS_COUNT, len(person_attribs))

            name: str = person_attribs[0].strip()  # FN,LN

            # Validate name format
            if ',' not in name:
                raise InvalidNameFormat(row + 1, name)

            last_name: str = name.split(',')[0].strip()
            first_name: str = name.split(',')[1].strip()

            if not last_name or not first_name:
                raise InvalidNameFormat(row + 1, name)

            email: str = person_attribs[1].strip()

            # Check for duplicate emails
            if email in seen_emails:
                raise DuplicateEmail(email, [seen_emails[email], row + 1])
            seen_emails[email] = row + 1

            role: str = person_attribs[2].strip()

            # Validate role before conversion
            if role not in valid_roles:
                raise InvalidRole(row + 1, role, valid_roles)

            lms_id: int|None = None

            role = helper_str_to_int_role(role)
            role = get_role(role)
            role_id = role.role_id

            # If the len of person_attribs == 4, then the LMS ID is present.
            if len(person_attribs) == 4:
                lms_id = person_attribs[3].strip()
                if lms_id:  # Only validate if not empty
                    if not lms_id.isdigit():
                        raise InvalidLMSID(row + 1, lms_id)
                    if lms_id in seen_lms_ids:
                        raise DuplicateLMSID(lms_id, [seen_lms_ids[lms_id], row + 1])
                    seen_lms_ids[lms_id] = row + 1

            if not helper_verify_email_syntax(email):
                raise InvalidEmail(row + 1, email)

            students.append((first_name, last_name, email, role_id, lms_id))

        i = 0
        for first_name, last_name, email, role_id, lms_id in students:
            validate_emails = i == len(students)-1
            __add_user(owner_id, course_id, first_name, last_name, email, role_id, lms_id, validate_emails)
            i += 1

        student_csv.close()

        delete_xlsx(user_file, is_xlsx)

        return None

    except Exception as e:
        if student_csv is not None:
            student_csv.close()

        if is_xlsx is not None:
            delete_xlsx(user_file, is_xlsx)

        raise e

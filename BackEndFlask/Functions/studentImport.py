from Functions.helper import *
from Functions.customExceptions import *
from models.user import *
from models.user_course import *
from sqlalchemy import *
import itertools
import csv
from typing import List, Dict, Tuple as TypingTuple

def validate_student_row(row: List[str], row_num: int, seen_emails: Dict[str, int], 
                        seen_lms_ids: Dict[str, int]) -> TypingTuple[str, str, str, str]:
    """Validates a single row of student CSV data and returns parsed values"""
    
    # Check column count
    if len(row) < 3:
        raise NotEnoughColumns(row_num, 3, len(row))
    if len(row) > 3:
        raise TooManyColumns(row_num, 3, len(row))

    # Validate and parse name
    name = row[0].strip()
    if ',' not in name:
        raise InvalidNameFormat(row_num, name)
    
    last_name = name.split(',')[0].strip()
    first_name = name.split(',')[1].strip()
    
    if not last_name or not first_name:
        raise InvalidNameFormat(row_num, name)

    # Validate LMS ID (required for students)
    lms_id = row[1].strip()
    if not lms_id or not lms_id.isdigit():
        raise InvalidLMSID(row_num, lms_id)
    
    if lms_id in seen_lms_ids:
        raise DuplicateLMSID(lms_id, [seen_lms_ids[lms_id], row_num])
    seen_lms_ids[lms_id] = row_num

    # Validate email
    email = row[2].strip()
    if not is_valid_email(email):
        raise InvalidEmail(row_num, email)
    
    if email in seen_emails:
        raise DuplicateEmail(email, [seen_emails[email], row_num])
    seen_emails[email] = row_num

    return first_name, last_name, lms_id, email

# student_csv_to_db()
#   - takes three parameters:
#       - the file path to the csv file (studentcsvfile)
#       - the TA/Instructor or Admin creating the students (owner_id)
#   - the course with which the students will be enrolled in (course_id)
#   - reads in the csv file
#   - extracts the students from the csv file
#   - creates the new student users as long their emails are unique
#   - returns an array of students made
#   - expects the format of:
#       - "last_name, first_name", lms_id, email, owner_id
def student_csv_to_db(student_file, owner_id, course_id):
    if not student_file.endswith('.csv') and not student_file.endswith('.xlsx'):
        raise WrongExtension

    is_xlsx = False
    if student_file.endswith('.xlsx'):
        is_xlsx = True
        student_file = xlsx_to_csv(student_file)
    try:
        with open(student_file, mode='r', encoding='utf-8-sig') as studentcsv:
            # Renamed `reader` -> `roster`.
            roster: list[list[str]] = list(itertools.tee(csv.reader(studentcsv))[0])

            if not roster:
                raise EmptyFile()

            # Track duplicate checks
            seen_emails = {}
            seen_lms_ids = {}

            for row in range(0, len(roster)):
                # Skip empty rows
                if not roster[row]:
                    continue

                if len(roster[row]) < 3:
                    raise NotEnoughColumns(row + 1, 3, len(roster[row]))
                if len(roster[row]) > 3:
                    delete_xlsx(student_file, is_xlsx)
                    raise TooManyColumns(row + 1, 3, len(roster[row]))

                student_name = roster[row][0].strip()
                lms_id = roster[row][1].strip()
                student_email = roster[row][2].strip()

                # Validate name format
                if ',' not in student_name:
                    raise InvalidNameFormat(row + 1, student_name)

                last_name = student_name.split(',')[0].strip()
                first_name = student_name.split(',')[1].strip()

                if not last_name or not first_name:
                    raise InvalidNameFormat(row + 1, student_name)

                # Validate LMS ID
                if not lms_id or not lms_id.isdigit():
                    raise InvalidLMSID(row + 1, lms_id)

                if lms_id in seen_lms_ids:
                    raise DuplicateLMSID(lms_id, [seen_lms_ids[lms_id], row + 1])
                seen_lms_ids[lms_id] = row + 1

                # Validate email
                if not is_valid_email(student_email):
                    raise InvalidEmail(row + 1, student_email)

                if student_email in seen_emails:
                    raise DuplicateEmail(student_email, [seen_emails[student_email], row + 1])
                seen_emails[student_email] = row + 1

                user = get_user_by_email(
                    student_email
                )

                # Only validate the emails once the last
                # user is being created.
                validate_emails = row == len(roster)-1

                if user is None:
                    created_user = create_user({
                        "first_name": first_name,
                        "last_name": last_name,
                        "email": student_email,
                        "password": "Skillbuilder",
                        "lms_id": lms_id,
                        "consent": None,
                        "owner_id": owner_id
                    }, validate_emails=validate_emails)
                user_id = get_user_user_id_by_email(
                    student_email
                )

                user_course = get_user_course_by_user_id_and_course_id(
                    user_id,
                    course_id
                )

                if user_course is None:
                    user_id = get_user_user_id_by_email(
                        student_email
                    )

                    user_course = create_user_course({
                        "user_id": user_id,
                        "course_id": course_id,
                        # role_id of 5 is a "Student"
                        "role_id": 5
                    })

        delete_xlsx(student_file, is_xlsx)
        return "Upload Successful!"
    except Exception as e:
        delete_xlsx(student_file, is_xlsx)
        raise e

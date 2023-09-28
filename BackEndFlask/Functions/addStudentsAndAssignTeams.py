#!/bin/python3

from typing import List

from Functions.test_files.population_functions import *
from Functions.customExceptions import *
from models.user import *
from models.user_course import *
from sqlalchemy import *
from datetime import date
import itertools
import csv

# TODO: Move to separate 'helper' file.
def __field_exists(field, roster_file, is_xlsx) -> bool:
    """
    Checks if `field` is an actual object returned from the database
    or if it contains an error message.
    @param field: the field to be checked
    @param roster_file: the file that will be deleted if `field` is an error message
    @param is_xlsx: boolean that states if it is a .xlsx file
    @return: boolean, true -> it exists, false -> error message
    """
    if type(field) is str:  # Is of type(str) if an error is returned.
        delete_xlsx(roster_file, is_xlsx)
        return False
    return True


def __deal_with_tas(ta_email, roster_file, owner_id, is_xlsx, course_id):
    """
    Contains all logic for checking a TA.
    @param ta_email: the email for the TA
    @param roster_file: the (xlsx/csv) file with information from the user
    @param is_xlsx: boolean to check whether or not the file has the extension `.xlsx`
    @param course_id: the course ID.
    @return: boolean, true -> it exists, false -> error message
    """

    if ' ' in ta_email or '@' not in ta_email or not isValidEmail(ta_email):
        return SuspectedMisformatting.error

    user_id = get_user_user_id_by_email(ta_email)

    if not __field_exists(user_id, roster_file, is_xlsx):
        return user_id

    if user_id is None:
        return UserDoesNotExist.error

    user_course = get_user_course_by_user_id_and_course_id(
        user_id,
        course_id
    )

    if not __field_exists(user_course, roster_file, is_xlsx):
        return user_course

    if user_course is None:
        return TANotYetAddedToCourse.error

    if not __field_exists(user_course, roster_file, is_xlsx):
        return user_course

    # NOTE: Not sure what to do about the `team_name`.
    team_name = 'tmp'
    team = create_team({
        "team_name": team_name,
        # "observer_id": (lambda: owner_id, lambda: (lambda: user_id, lambda: owner_id)[missingTA]())[courseUsesTAs](),
        # NOTE: Made `missingta` = False and `courseUsesTAs` = True as we are requiring to TAs.
        "observer_id": (lambda: owner_id, lambda: (lambda: user_id, lambda: owner_id)[False]())[True](),
        "date_created": str(date.today().strftime("%m/%d/%Y"))
    })

    assert False and "UNIMPLEMENTED"

    return None


def __deal_with_students(last_name, first_name, email, owner_id, roster_file, is_xlsx):
    if ' ' in email or '@' not in email or not isValidEmail(email):
        return SuspectedMisformatting.error

    user = get_user_by_email(email)
    if not __field_exists(user, roster_file, is_xlsx):
        return user

    # If the user is not already in the DB.
    if user is None:
        created_user = create_user({
            "first_name": first_name,
            "last_name":  last_name,
            "email":      email,
            "password":   "Skillbuilder",
            "role_id":    5,
            "lms_id":     None,  # NOTE: should we allow for an LMS ID?
            "consent":    None,
            "owner_id":   owner_id
        })
        if not __field_exists(created_user, roster_file, is_xlsx):
            return created_user

    return None


# NOTE: We already have a function to add students and a function to add teams.
#       However, those functions only accept a file. We should consider either
#       refactoring those, or creating new ones. If I want to use those as they
#       currently stand, I would have to construct a new CSV file. This is not
#       a good option since file I/O is very expensive. So for now, this function
#       basically re-implements them.
def student_and_team_to_db(roster_file: str, owner_id: int, course_id: int):
    if not roster_file.endswith('.csv') and not roster_file.endswith('.xlsx'):
        return WrongExtension.error

    # Determine if file is .xlsx.
    is_xlsx = roster_file.endswith('.xlsx')
    if is_xlsx:
        roster_file = xlsx_to_csv(roster_file)

    try:
        student_and_team_csv = open(roster_file, mode='r', encoding='utf-8-sig')
    except FileNotFoundError:
        delete_xlsx(roster_file, is_xlsx)
        return FileNotFound.error

    roster: list[list[str]] = list(itertools.tee(csv.reader(student_and_team_csv))[0])

    for row in range(0, len(roster)):
        person_attribs: list[str] = roster[row]

        # Checking for 4 for: FN LN, email, Team# / NA, TA
        if len(person_attribs) != 4:
            delete_xlsx(roster_file, is_xlsx)
            return (NotEnoughColumns.error if len(person_attribs) < 4
                    else TooManyColumns.error)

        name = person_attribs[0].strip()  # FN,LN
        last_name = name.replace(",", "").split()[0].strip()
        first_name = name.replace(",", "").split()[1].strip()
        email = person_attribs[1].strip()
        team_number = person_attribs[2].strip()
        ta_email = person_attribs[3].strip()

        errmsg = __deal_with_students(last_name, first_name, email, owner_id, roster_file, is_xlsx)

        if errmsg is not None:
            delete_xlsx(roster_file, is_xlsx)
            return errmsg

        errmsg = __deal_with_tas(ta_email, roster_file, owner_id, is_xlsx, course_id)

        if errmsg is not None:
            delete_xlsx(roster_file, is_xlsx)
            return errmsg

    # Success
    student_and_team_csv.close()
    delete_xlsx(roster_file, is_xlsx)
    return None

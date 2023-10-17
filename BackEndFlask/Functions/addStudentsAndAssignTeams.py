#!/bin/python3

from typing import List

from Functions.test_files.population_functions import *
from Functions.helper import helper_verify_email_syntax, helper_create_user, helper_ok, helper_cleanup
from Functions.customExceptions import *
from models.user import *
from models.user_course import *
from sqlalchemy import *
from datetime import date
import itertools
import csv


def __create_new_team(team_name, observer_id, date_created):
    assert False and "__create_new_team unimplemented"
    team_data = {"team_name": team_name, "observer_id": observer_id, "date_created": date_created}
    success_status = create_team(team_data)
    return success_status


def __add_user_to_existing_team():
    assert False and "unimplemented"


def __handle_ta(ta_email, roster_file, owner_id, is_xlsx, course_id):
    """
    Contains all logic for checking a TA.
    @param ta_email: the email for the TA
    @param roster_file: the (xlsx/csv) file with information from the user
    @param owner_id: the ID of the creator
    @param is_xlsx: boolean to check whether or not the file has the extension `.xlsx`
    @param course_id: the course ID.
    @return: None -> success, str -> error message from sqlalchemy
    """

    if not helper_verify_email_syntax(ta_email):
        return SuspectedMisformatting.error

    user_id = get_user_user_id_by_email(ta_email)

    if not helper_ok(user_id, roster_file, is_xlsx):
        return user_id

    if user_id is None:
        return UserDoesNotExist.error

    user_course = get_user_course_by_user_id_and_course_id(
        user_id,
        course_id
    )

    if not helper_ok(user_course, roster_file, is_xlsx):
        return user_course

    if user_course is None:
        return TANotYetAddedToCourse.error

    if not helper_ok(user_course, roster_file, is_xlsx):
        return user_course

    assert False and "UNIMPLEMENTED"

    return None


def __handle_student(last_name, first_name, email, owner_id, roster_file, is_xlsx):
    """
    Contains all logic for checking a student.
    @param last_name: last name of the student
    @param first_name: first name of the student
    @param email: email of the student
    @param owner_id: the ID of the creator
    @param roster_file: the (xlsx/csv) file with information from the user
    @param is_xlsx: boolean to check whether or not the file has the extension `.xlsx`
    @return: None -> success, str -> error message from sqlalchemy
    """

    if not helper_verify_email_syntax(email):
        return SuspectedMisformatting.error

    user = get_user_by_email(email)
    if not helper_ok(user, roster_file, is_xlsx):
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
        if not helper_ok(created_user, roster_file, is_xlsx):
            return created_user

    return None



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

    csv_reader = csv.reader(student_and_team_csv)
    roster = []

    # Build up the roster with the format of:
    # [[team_name, ta_email], ["lname1, fname1", email1, lms_id1], ["lname2, fname2", email2, lms_id2], ...]
    for row in csv_reader:
        team_name, ta, *person_attribs = row
        person_attribs = [p.strip() for p in person_attribs]  # Remove leading/trailing whitespaces
        roster.append([team_name, ta] + person_attribs)

    ta_info = roster[0]
    if len(ta_info) != 2:
        pass # not enough information or too much information

    team_name = ta_info[0]
    ta_email = ta_info[1]

    # handle ta...
    # __handle_ta()

    # check if team exists...
    # if not team_exists():
    #     pass

    for student_info in roster[1:]:
        if len(student_info) > 3:
            # too many columns
            assert False and "too many columns"
        elif len(student_info) < 2:
            # not enough columns
            assert False and "not enough columns"

        name = student_info[0].strip()  # FN,LN
        last_name = name.replace(",", "").split()[0].strip()
        first_name = name.replace(",", "").split()[1].strip()
        email = student_info[1].strip()
        lms_id = None

        if len(student_info) == 3:
            lms_id = student_info[2]

        # handle student...
        # __handle_student()

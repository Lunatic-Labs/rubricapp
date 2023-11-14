from typing import List

from Functions.helper import *
from Functions.customExceptions import *
from models.user import *
from models.user_course import *
from sqlalchemy import *
from datetime import date
import itertools
import csv


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
        return helper_cleanup(roster_file, is_xlsx, FileNotFound.error)

    csv_reader = csv.reader(student_and_team_csv)
    roster = []
    save_point = db.session.begin_nested()

    # Build up the roster with the format of:
    # [[team_name, ta_email], ["lname1, fname1", email1, lms_id1], ["lname2, fname2", email2, lms_id2], ...]
    for row in csv_reader:
        team_name, ta, *person_attribs = row
        # Remove leading/trailing whitespaces
        person_attribs = [p.strip() for p in person_attribs]
        roster.append([team_name, ta] + person_attribs)

    ta_info = roster[0]
    if len(ta_info) != 2:
        return helper_cleanup(roster_file, is_xlsx, NotEnoughColumns.error, student_and_team_csv)

    team_name = ta_info[0]
    ta_email = ta_info[1]

    team = get_team_by_team_name_and_course_id(team_name, course_id)
    if not helper_ok(team, roster_file, is_xlsx):
        return helper_cleanup(roster_file, is_xlsx, team, student_and_team_csv)

    course_uses_tas = get_course_use_tas(course_id)
    if not helper_ok(course_uses_tas, roster_file, is_xlsx):
        return helper_cleanup(roster_file, is_xlsx, course_uses_tas, student_and_team_csv)

    # Begin handling TA's.

    ta_course = None
    missing_ta=None
    if course_uses_tas:
        missing_ta = False

        if not helper_verify_email_syntax(ta_email):
            return helper_cleanup(roster_file, is_xlsx, SuspectedMisformatting.error, student_and_team_csv)

        user = get_user_by_email(ta_email)
        if not helper_ok(user, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, user, student_and_team_csv)

        # If the user is not already in the DB. # TODO: FIX
        if user is None:
            
            # delete_xlsx(roster_file, is_xlsx)
            # return helper_cleanup(UserDoesNotExist.error, student_and_team_csv)

        if user.role_id == 5:
            missing_ta = True

        user_id = get_user_user_id_by_email(ta_email)

        if not helper_ok(user_id, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, user_id, student_and_team_csv)

        ta_course = get_user_course_by_user_id_and_course_id(
            user_id, course_id)
        if not helper_ok(ta_course, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, ta_course, student_and_team_csv)

        if ta_course is None: # TODO: FIX
            return helper_cleanup(roster_file, is_xlsx, TANotYetAddedToCourse.error, student_and_team_csv)
    else:
        user = get_user(owner_id)
        if not helper_ok(user, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, user, student_and_team_csv)

        if user is None: # TODO: FIX
            delete_xlsx(roster_file, is_xlsx)
            return helper_cleanup(UserDoesNotExist.error, student_and_team_csv)

        course = get_course(course_id)
        if not helper_ok(course, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, course, student_and_team_csv)

        courses = get_courses_by_admin_id(owner_id)
        if not helper_ok(courses, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, courses, student_and_team_csv)

        course_found = False
        for admin_course in courses:
            if course is admin_course:
                course_found = True
        if not course_found: # TODO: FIX
            delete_xlsx(roster_file, is_xlsx)
            return helper_cleanup(OwnerIDDidNotCreateTheCourse.error, student_and_team_csv)
    # End handling TA's.

    if team is None:
        team = create_team({
            "team_name": team_name,
            "observer_id": (lambda: owner_id, lambda: (lambda: user_id, lambda: owner_id)[missing_ta]())[course_uses_tas](),
            "date_created": str(date.today().strftime("%m/%d/%Y"))
        })
        if not helper_ok(team, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, team, student_and_team_csv)

    # Begin handling students.
    for student_info in roster[1:]:
        if len(student_info) > 3:
            # too many columns
            return helper_cleanup(roster_file, is_xlsx, TooManyColumns.error, student_and_team_csv)
        elif len(student_info) < 2:
            # not enough columns
            return helper_cleanup(roster_file, is_xlsx, NotEnoughColumns.error, student_and_team_csv)

        name = student_info[0].strip()  # FN,LN
        last_name = name.replace(",", "").split()[0].strip()
        first_name = name.replace(",", "").split()[1].strip()
        email = student_info[1].strip()
        lms_id = None

        if len(student_info) == 3:
            lms_id = student_info[2]

        if not helper_verify_email_syntax(email):
            return helper_cleanup(roster_file, is_xlsx, SuspectedMisformatting.error, student_and_team_csv)

        user = get_user_by_email(email)
        if not helper_ok(user, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, user, student_and_team_csv)

        user_id = None
        if user is None:
            user = helper_create_user(first_name, last_name, email, 4, lms_id, owner_id)
            if not helper_ok(user, roster_file, is_xlsx):
                return helper_cleanup(roster_file, is_xlsx, user, student_and_team_csv)
        user_id = user.user_id

        user_course = get_user_course_by_user_id_and_course_id(
            user_id, course_id)
        if not helper_ok(user_course, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, user_course, student_and_team_csv)

        if user_course is None:
            user_course = create_user_course({
                "user_id": user_id,
                "course_id": course_id
            })
            if not helper_ok(user_course, roster_file, is_xlsx):
                return helper_cleanup(roster_file, is_xlsx, user_course, student_and_team_csv)

        # add student to team
        team_user = create_team_user({
            "team_id": team.team_id,
            "user_id": user_id
        })
        if not helper_ok(team_user, roster_file, is_xlsx):
            return helper_cleanup(roster_file, is_xlsx, team_user, student_and_team_csv)

    return None



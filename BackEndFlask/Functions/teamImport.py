from Functions.test_files.population_functions import *
from Functions.customExceptions import *
from models.user import *
from models.course import *
from models.user_course import *
from models.team import *
from models.team_user import *
from datetime import date
import itertools
import csv

# TODO: Currently if a course uses TAs, however the csv file does not contain a TA,
# the Teacher is not automatically assigned to the team as an observer.
# Need to implement the solution to automatically assign the Teacher as an
# observer to the team!

# team_csv_to_db()
#   - takes in three parameters:
#       - the path to the file containing the bulkuploaded teams (teamcsvfile)
#       - the id of the user logged in (owner_id)
#       - the id of the course (course_id)
#   - reads in the csv file (teamcsvfile)
#   - creates teams
#   - assigns newly created teams to the course (course_id)
#   - assigns students to the newly created teams
#   - expects the following values for courses that do not use TAs
#       - TeamName
#       - StudentEmails
#   - expects the following values for courses that do use TAs
#       - TeamName
#       - StudentEmails
#       - TAEmail


def team_csv_to_db(team_file, owner_id, course_id):
    if not team_file.endswith(".csv") and not team_file.endswith(".xlsx"):
        raise WrongExtension
    is_xlsx = False
    if team_file.endswith(".xlsx"):
        is_xlsx = True
        team_file = xlsx_to_csv(team_file)
    try:
        with open(team_file, mode="r", encoding="utf-8-sig") as teamcsv:
            teams = get_team_by_course_id(course_id)
            for team in teams:
                deactivated_team = deactivate_team(team.team_id)

            course_uses_tas = get_course_use_tas(course_id)

            reader = itertools.tee(csv.reader(teamcsv))[0]
            for row in reader:
                row_list = list(row)
                team_name = row_list[0].strip()
                ta_email = row_list[1].strip()
                missing_ta = False
                if not is_valid_email(ta_email):
                    raise SuspectedMisformatting
                if course_uses_tas:
                    user = get_user_by_email(ta_email)

                    if user is None:
                        return UserDoesNotExist


                    user_id = get_user_user_id_by_email(
                        ta_email)

                    user_course = get_user_course_by_user_id_and_course_id(
                        user_id,
                        course_id
                    )

                    if user_course is None:
                        raise TANotYetAddedToCourse

                    if user_course.role_id == 5:
                        missing_ta = True
                else:
                    user = get_user(owner_id)
                    if user is None:
                        raise UserDoesNotExist

                    course = get_course(course_id)
                    courses = get_courses_by_admin_id(owner_id)

                    course_found = False
                    for admin_course in courses:
                        if course is admin_course:
                            course_found = True
                    if not course_found:
                        raise OwnerIDDidNotCreateTheCourse

                students = []
                lower_bound = 1 if course_uses_tas == 0 else 2
                for index in range(lower_bound, len(row_list)):
                    student_email = row_list[index].strip()
                    if not is_valid_email(student_email):
                        raise SuspectedMisformatting

                    user = get_user_by_email(student_email)

                    if user is None:
                        raise UserDoesNotExist

                    user_id = get_user_user_id_by_email(student_email)
                    user_course = get_user_course_by_user_id_and_course_id(
                        user_id, course_id
                    )
                    if user_course is None:
                        raise StudentNotEnrolledInThisCourse

                    students.append(user_id)

                user_id = get_user_user_id_by_email(ta_email)
                if course_uses_tas:
                    observer_id = owner_id if missing_ta else user_id
                else:
                    observer_id = owner_id
                team = create_team(
                    {
                        "team_name": team_name,
                        "observer_id": observer_id,
                        "date_created": str(date.today().strftime("%m/%d/%Y")),
                        "active_until": None,
                        "course_id": course_id,
                    }
                )

                if course_uses_tas:
                    user_id = get_user_user_id_by_email(ta_email)
                    team_user = create_team_user(
                        {"team_id": team.team_id, "user_id": user_id}
                    )
                for student_i_d in students:
                    team_user = create_team_user(
                        {"team_id": team.team_id, "user_id": student_i_d}
                    )
            delete_xlsx(team_file, is_xlsx)
            return "Upload successful!"
    except Exception as e:
        delete_xlsx(team_file, is_xlsx)
        raise e
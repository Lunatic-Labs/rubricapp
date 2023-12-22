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

# teamcsvToDB()
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


def teamcsvToDB(teamFile, owner_id, course_id):
    if not teamFile.endswith(".csv") and not teamFile.endswith(".xlsx"):
        raise WrongExtension
    isXlsx = False
    if teamFile.endswith(".xlsx"):
        isXlsx = True
        teamFile = xlsx_to_csv(teamFile)
    try:
        with open(teamFile, mode="r", encoding="utf-8-sig") as teamcsv:
            teams = get_team_by_course_id(course_id)
            for team in teams:
                deactivated_team = deactivate_team(team.team_id)

            courseUsesTAs = get_course_use_tas(course_id)

            reader = itertools.tee(csv.reader(teamcsv))[0]
            for row in reader:
                rowList = list(row)
                team_name = rowList[0].strip()
                ta_email = rowList[1].strip()
                missingTA = False
                if not isValidEmail(ta_email):
                    raise SuspectedMisformatting
                if courseUsesTAs:
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
                        missingTA = True
                else:
                    user = get_user(owner_id)
                    if user is None:
                        raise UserDoesNotExist
                    
                    course = get_course(course_id)
                    courses = get_courses_by_admin_id(owner_id)
                    
                    courseFound = False
                    for admin_course in courses:
                        if course is admin_course:
                            courseFound = True
                    if not courseFound:
                        raise OwnerIDDidNotCreateTheCourse

                students = []
                lower_bound = 1 if courseUsesTAs == 0 else 2
                for index in range(lower_bound, len(rowList)):
                    student_email = rowList[index].strip()
                    if not isValidEmail(student_email):
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
                if courseUsesTAs:
                    observer_id = owner_id if missingTA else user_id
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
                
                if courseUsesTAs:
                    user_id = get_user_user_id_by_email(ta_email)
                    team_user = create_team_user(
                        {"team_id": team.team_id, "user_id": user_id}
                    )
                for studentID in students:
                    team_user = create_team_user(
                        {"team_id": team.team_id, "user_id": studentID}
                    )
            delete_xlsx(teamFile, isXlsx)
            return "Upload successful!"
    except Exception as e:
        delete_xlsx(teamFile, isXlsx)
        raise e
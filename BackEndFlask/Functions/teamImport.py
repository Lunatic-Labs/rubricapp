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
    if not teamFile.endswith('.csv') and not teamFile.endswith('.xlsx'):
        return WrongExtension.error
    isXlsx = False
    if teamFile.endswith('.xlsx'):
        isXlsx = True
        teamFile = xlsx_to_csv(teamFile)
    try:
        with open(teamFile, mode='r', encoding='utf-8-sig') as teamcsv:
            teams = get_team_by_course_id(course_id)
            if type(teams) is type(""):
                delete_xlsx(teamFile, isXlsx)
                return teams
            for team in teams:
                deactivated_team = deactivate_team(team.team_id)
                if type(deactivated_team) is type(""):
                    delete_xlsx(teamFile, isXlsx)
                    return deactivated_team
            courseUsesTAs = get_course_use_tas(
                course_id
            )
            if type(courseUsesTAs) is type(""):
                delete_xlsx(teamFile, isXlsx)
                return courseUsesTAs
            reader = itertools.tee(csv.reader(teamcsv))[0]
            for row in reader:
                rowList = list(row)
                team_name = rowList[0].strip()
                ta_email = rowList[1].strip()
                missingTA = False
                if ' ' in ta_email or '@' not in ta_email or not isValidEmail(ta_email):
                    delete_xlsx(teamFile, isXlsx)
                    return SuspectedMisformatting.error
                if courseUsesTAs:
                    user = get_user_by_email(
                        ta_email
                    )
                    if type(user) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return user
                    if user is None:
                        delete_xlsx(teamFile, isXlsx)
                        return UserDoesNotExist.error
                    # The following code no longer works because role_id has been removed from the User table!
                    # The role_id is now in the UserCourse table!
                    # TODO: Update logic to retrieve the user_course for course_id and user_id then retrieve the role_id in user_course!
                    # if user.role_id == 5:
                    #     missingTA = True
                    user_id = get_user_user_id_by_email(
                        ta_email
                    )
                    if type(user_id) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return user_id
                    user_course = get_user_course_by_user_id_and_course_id(
                        user_id,
                        course_id
                    )
                    if type(user_course) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return user_course
                    if user_course is None:
                        delete_xlsx(teamFile, isXlsx)
                        return TANotYetAddedToCourse.error
                else:
                    user = get_user(
                        owner_id
                    )
                    if type(user) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return user
                    if user is None:
                        delete_xlsx(teamFile, isXlsx)
                        return UserDoesNotExist.error
                    course = get_course(
                        course_id
                    )
                    if type(course) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return course
                    courses = get_courses_by_admin_id(
                        owner_id
                    )
                    if type(courses) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return courses
                    courseFound = False
                    for admin_course in courses:
                        if course is admin_course:
                            courseFound = True
                    if not courseFound:
                        delete_xlsx(teamFile, isXlsx)
                        return OwnerIDDidNotCreateTheCourse.error
                students = []
                for index in range((lambda: 1, lambda: 2)[courseUsesTAs](), len(rowList)):
                    student_email = rowList[index].strip()
                    if ' ' in student_email or '@' not in student_email or not isValidEmail(student_email):
                        delete_xlsx(teamFile, isXlsx)
                        return SuspectedMisformatting.error
                    user = get_user_by_email(
                        student_email
                    )
                    if type(user) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return user
                    if user is None:
                        delete_xlsx(teamFile, isXlsx)
                        return UserDoesNotExist.error
                    user_id = get_user_user_id_by_email(
                        student_email
                    )
                    if type(user_id) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return user_id
                    user_course = get_user_course_by_user_id_and_course_id(
                        user_id,
                        course_id
                    )
                    if type(user_course) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return user_course
                    if user_course is None:
                        delete_xlsx(teamFile, isXlsx)
                        return StudentNotEnrolledInThisCourse.error
                    students.append(user_id)
                user_id = get_user_user_id_by_email(
                    ta_email
                )
                if type(user_id) is type(""):
                    delete_xlsx(teamFile, isXlsx)
                    return user_id
                team = create_team({
                    "team_name": team_name,
                    "observer_id": (lambda: owner_id, lambda: (lambda: user_id, lambda: owner_id)[missingTA]())[courseUsesTAs](),
                    "date_created": str(date.today().strftime("%m/%d/%Y")), 
                    "active_until": None,
                    "course_id": course_id
                })
                if type(team) is type(""):
                    delete_xlsx(teamFile, isXlsx)
                    return team
                if courseUsesTAs:
                    user_id = get_user_user_id_by_email(
                        ta_email
                    )
                    if type(user_id) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return user_id
                    team_user = create_team_user({
                        "team_id": team.team_id,
                        "user_id": user_id
                    })
                    if type(team_user) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return team_user
                for studentID in students:
                    team_user = create_team_user({
                        "team_id": team.team_id,
                        "user_id": studentID
                    })
                    if type(team_user) is type(""):
                        delete_xlsx(teamFile, isXlsx)
                        return team_user
            delete_xlsx(teamFile, isXlsx)
            return "Upload successful!"
    except FileNotFoundError:
        delete_xlsx(teamFile, isXlsx)
        return FileNotFound.error
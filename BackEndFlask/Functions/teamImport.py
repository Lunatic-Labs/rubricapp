import customExceptions
from models.user import *
from models.course import *
from models.user_course import *
from models.instructortacourse import *
from models.team import *
from models.team_course import *
from models.team_user import *
from datetime import date
import itertools
import csv

"""
teamcsvToDB() takes in three parameters:
    - the path to the file containing the bulkuploaded teams (teamcsvfile) 
    - the id of the user logged in (owner_id)
    - the id of the course (course_id)
teamcsvToDB()
    - reads in the csv file (teamcsvfile)
    - creates teams
    - assigns newly created teams to the course (course_id)
    - assigns students to the newly created teams
teamcsvToDB()
    - expects the following values for courses that do not use TAs
        - TeamName
        - StudentEmails
    - expects the following values for courses that do use TAs
        - TeamName
        - StudentEmails
        - TAEmail
"""
def teamcsvToDB(teamcsvfile, owner_id, course_id):
    if not teamcsvfile.endswith('.csv'):
        return customExceptions.WrongExtension.error
    try:
        with open(teamcsvfile, mode='r', encoding='utf-8-sig') as teamcsv:
            courseUsesTAs = get_course_use_tas(course_id)
            reader = itertools.tee(csv.reader(teamcsv))[0]
            for row in reader:
                rowList = list(row)
                team_name = rowList[0]
                ta_email = rowList[1]
                if ' ' in ta_email or '@' not in ta_email:
                    return customExceptions.SuspectedMisformatting.error
                if courseUsesTAs:
                    if get_user_by_email(ta_email) is None:
                        return customExceptions.UserDoesNotExist.error
                    if get_user_course_by_user_id_and_course_id(get_user_user_id_by_email(ta_email), course_id) is None:
                        return customExceptions.TANotYetAddedToCourse.error
                else:
                    if get_user(owner_id) is None:
                        return customExceptions.UserDoesNotExist.error
                    if get_course(course_id) not in get_courses_by_admin_id(owner_id):
                        return customExceptions.OwnerIDDidNotCreateTheCourse.error
                students = []
                for index in range((lambda: 1, lambda: 2)[courseUsesTAs](), len(rowList)):
                    student_email = rowList[index]
                    if ' ' in student_email or '@' not in student_email:
                        return customExceptions.SuspectedMisformatting.error
                    if get_user_by_email(student_email) is None:
                        return customExceptions.UserDoesNotExist.error
                    if get_user_course_by_user_id_and_course_id(get_user_user_id_by_email(student_email), course_id) is None:
                        return customExceptions.StudentNotEnrolledInThisCourse.error
                    students.append(get_user_user_id_by_email(student_email))
                team = create_team({
                    "team_name": team_name,
                    "observer_id": (lambda: owner_id, lambda: get_user_user_id_by_email(ta_email))[courseUsesTAs](),
                    "date_created": str(date.today().strftime("%m/%d/%Y"))
                })
                team_course = create_team_course({
                    "team_id": team.team_id,
                    "course_id": course_id
                })
                if courseUsesTAs:
                    create_team_user({
                        "team_id": team.team_id,
                        "user_id": get_user_user_id_by_email(ta_email)
                    })
                for studentID in students:
                    create_team_user({
                        "team_id": team.team_id,
                        "user_id": studentID
                    })
            return "Upload successful!"
    except FileNotFoundError:
        return customExceptions.FileNotFoundError.error
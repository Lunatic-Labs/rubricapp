from Functions.test_files.population_functions import *
from Functions.customExceptions import *
from models.user import *
from models.user_course import *
from sqlalchemy import *
import itertools
import csv

# studentcsvToDB()
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
def studentcsvToDB(studentFile, owner_id, course_id):
    if not studentFile.endswith('.csv') and not studentFile.endswith('.xlsx'):
        return WrongExtension.error
    isXlsx = False
    if studentFile.endswith('.xlsx'):
        isXlsx = True
        studentFile = xlsx_to_csv(studentFile)
    try:
        with open(studentFile, mode='r', encoding='utf-8-sig') as studentcsv:
            reader = list(itertools.tee(csv.reader(studentcsv))[0])
            header = reader[0]
            if len(header) < 3:
                delete_xlsx(studentFile, isXlsx)
                return NotEnoughColumns.error
            if len(header) > 3:
                delete_xlsx(studentFile, isXlsx)
                return TooManyColumns.error
            for row in range(0, len(reader)):
                student_name = reader[row][0].strip()
                lms_id = reader[row][1].strip()
                student_email = reader[row][2].strip()
                last_name = student_name.replace(",", "").split()[0].strip()
                first_name = student_name.replace(",", "").split()[1].strip()
                if ' ' in student_email or '@' not in student_email or not lms_id.isdigit() or not isValidEmail(student_email):
                    delete_xlsx(studentFile, isXlsx)
                    return SuspectedMisformatting.error
                user = get_user_by_email(
                    student_email
                )
                if type(user) is type(""):
                    delete_xlsx(studentFile, isXlsx)
                    return user
                if user is None:
                    # TODO: Update the following code by adding isAdmin=False
                    created_user = create_user({
                        "first_name": first_name,
                        "last_name": last_name,
                        "email": student_email,
                        "password": "Skillbuilder",
                        "lms_id": lms_id,
                        "consent": None,
                        "owner_id": owner_id
                    })
                    if type(created_user) is type(""):
                        delete_xlsx(studentFile, isXlsx)
                        return created_user
                user_id = get_user_user_id_by_email(
                    student_email
                )
                if type(user_id) is type(""):
                    delete_xlsx(studentFile, isXlsx)
                    return user_id
                user_course = get_user_course_by_user_id_and_course_id(
                    user_id,
                    course_id
                )
                if type(user_course) is type(""):
                    delete_xlsx(studentFile, isXlsx)
                    return user_course
                if user_course is None:
                    user_id = get_user_user_id_by_email(
                        student_email
                    )
                    if type(user_id) is type(""):
                        delete_xlsx(studentFile, isXlsx)
                        return user_id
                    user_course = create_user_course({
                        "user_id": user_id,
                        "course_id": course_id,
                        # role_id of 5 is a "Student"
                        "role_id": 5
                    })
                    if type(user_course) is type(""):
                        delete_xlsx(studentFile, isXlsx)
                        return user_course
        delete_xlsx(studentFile, isXlsx)
        return "Upload Successful!"
    except FileNotFoundError:
        delete_xlsx(studentFile, isXlsx)
        return FileNotFound.error

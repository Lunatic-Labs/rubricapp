from models.schemas import Users, UserCourse
from models.user import create_user
from models.user_course import create_user_course
from customExceptions import TooManyColumns, NotEnoughColumns, SuspectedMisformatting, WrongExtension, InvalidLMSID
import pandas as pd 
import csv
import os
import re

"""
    The function studentfileToDB() takes in three parameters:
        the path to the studentFile (files supported are .csv and .xlsx),
        the owner_id,
        and the course_id.
    If the file ends with .xlsx, it is then converted to a csv file.
    The function attempts to read the passed in csv file to insert students into the Users table.

    NO HEADERS!
    lms_id is an optional field.
    A valid csv file contains student information in the format of:
        "last_name, first_name", email, lms_id
"""

def isValidEmail(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if(re.fullmatch(regex, email)):
        return True
    return False

def verifyColumnsQuantity(col):
    if (len(col) > 3):
        raise TooManyColumns
    elif (len(col) < 2):
        raise NotEnoughColumns

def xlsx_to_csv(csvFile):
    read_file = pd.read_excel(csvFile)
    sample_files = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
    temp_file = "/temp.csv"
    read_file.to_csv(sample_files+temp_file, index=None, header=True)
    return sample_files + os.path.join(os.path.sep, temp_file)

def studentfileToDB(studentfile, owner_id, course_id):
    try:
        students = []
        isXlsx = False
        # Verify appropriate extension of .csv
        if not (studentfile.endswith('.csv') or studentfile.endswith('.xlsx')):
            raise WrongExtension
        if studentfile.endswith('.xlsx'):
            isXlsx = True
            studentfile = xlsx_to_csv(studentfile)
        with open(studentfile, mode='r', encoding='utf-8-sig') as studentcsv:
            reader = csv.reader(studentcsv)
            row_in_question = None
            for row in reader:
                verifyColumnsQuantity(row)
                if isValidEmail(row[1].strip()):
                    # parses the "last_name, first_name" format from csv file
                    fullname = row[0].strip("\"").split(",")
                    lms_id = None
                    if len(row) == 3:
                        if not row[2].strip().isdigit:
                            raise InvalidLMSID
                        lms_id = int(row[2].strip())
                    # Each student's
                    #   password is set to 'skillbuilder',
                    #   role is set to 5 aka "Student",
                    #   consent to None.
                    students.append({
                        "first_name": fullname[1].strip(),
                        "last_name": fullname[0].strip(),
                        "email": row[1].strip(),
                        "password": "skillbuilder",
                        "role_id": 5,
                        "lms_id": lms_id,   
                        "consent": None,
                        "owner_id": owner_id
                    })                    
                else:
                    row_in_question = row
                    raise SuspectedMisformatting
            for student in students:
                # In order to assign students to a course, each student must first be created.
                # After each student is created, the user_id is retrieved for each user
                #   by querying the email of the last added user. 
                created_user = Users.query.filter_by(email=student["email"]).first()
                if created_user is None:
                    create_user(student)
                    created_user = Users.query.filter_by(email=student["email"]).first()
                    create_user_course({
                        "user_id": created_user.user_id,
                        "course_id": course_id
                    })
                # Then the user_id corresponding to student email is assigned to current course_id
                elif (UserCourse.query.filter_by(user_id=created_user.user_id, course_id=course_id).first() is None):
                    create_user_course({
                        "user_id": created_user.user_id,
                        "course_id": course_id
                    })
        return "Upload Successful!"
    except WrongExtension:
        error = "Wrong filetype submitted! Please submit a .csv file."
        return error
    except FileNotFoundError:
        error = "File not found or does not exist!"
        return error
    except TooManyColumns:
        error = "File contains more than the maximum 3 columns: \"last_name, first_name\", lms_id, email"
        return error
    except NotEnoughColumns:
        error = "File contains less than the minimum 2 columns: \"last_name, first_name\", email"
        return error
    except SuspectedMisformatting:
        error = "The following row does not contain a valid email where email is expected:"
        error += "\n" + str(list(row_in_question))
        return error
    except InvalidLMSID:
        error = "Value in lms_id column is not valid. Please enter an integer."
        return error
    finally:
        if isXlsx:
            os.remove(studentfile)

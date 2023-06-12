from customExceptions import *
from models.user import *
from models.user_course import *
from sqlalchemy import *
import pandas as pd
import csv
import os
import re


"""
studentfileToDB() takes three parameters:
    - the file path to the csv file (studentfile)
    - the TA/Instructor or Admin creating the students (owner_id)
    - the course with which the students will be enrolled in (course_id)
studentfileToDB()
    - reads in the file
    - converts file to csv if it has a .xlsx extension
    - extracts the students from the csv file
    - creates the new student users as long their emails are unique
    - returns the list of students made

studentfileToDBO() expects the format of:
    - "last_name, first_name", email, lms_id
    - NO HEADERS!
    - lms_id is an optional field.
"""
def isValidEmail(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    if(re.fullmatch(regex, email)):
        return True
    return False

def xlsx_to_csv(csvFile):
    read_file = pd.read_excel(csvFile)
    sample_files = os.getcwd() + os.path.join(os.path.sep, "Functions") + os.path.join(os.path.sep, "sample_files")
    temp_file = "/temp.csv"
    read_file.to_csv(sample_files+temp_file, index=None, header=True)
    return sample_files + os.path.join(os.path.sep, temp_file)


def studentfileToDB(studentfile, owner_id, course_id):
    students = []
    # Verify appropriate extension of .csv or .xlsx
    isXlsx = False
    misformattedRow=None
    if not (studentfile.endswith('.csv') or studentfile.endswith('.xlsx')):
        return WrongExtension.error
    if studentfile.endswith('.xlsx'):
        isXlsx = True
        studentfile = xlsx_to_csv(studentfile)    
    # Read file
    try:
        with open(studentfile, mode='r', encoding='utf-8-sig') as studentcsv:
            reader = csv.reader(studentcsv)
            for row in reader:
                if (len(row) > 3):
                    return TooManyColumns.error
                if (len(row) < 2):
                    return NotEnoughColumns.error
                if isValidEmail(row[1].strip())==False:
                    misformattedRow = row
                    raise SuspectedMisformatting
                else:
                    # parses the "last_name, first_name" format from csv file
                    fullname = row[0].strip("\"").split(",")
                    lms_id = None
                    if len(row) == 3:
                        if not row[2].strip().isdigit:
                            return InvalidLMSID.error
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
            for student in students:
                # In order to assign students to a course, each student must first be created.
                # After each student is created, the user_id is retrieved for each user
                #   by querying the email of the last added user. 
                created_user = get_user_by_email(student["email"])
                if created_user is None:
                    create_user(student)
                    created_user = get_user_by_email(student["email"])
                    create_user_course({
                        "user_id": created_user.user_id,
                        "course_id": course_id
                    })
                # If the student has not already been assigned to the course, assign the student!
                if get_user_course_by_user_id_and_course_id(
                    created_user.user_id,
                    course_id
                ) is None:
                    create_user_course({
                        "user_id": created_user.user_id,
                        "course_id": course_id
                    })
        return "Upload Successful!"
    except SuspectedMisformatting:
        return "The following row does not contain a valid email where email is expected:\n" + str(list(misformattedRow))
    except FileNotFoundError:
        return "File not found or does not exist!"
    finally:
        if isXlsx:
            os.remove(studentfile)
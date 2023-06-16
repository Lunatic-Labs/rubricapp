from Functions.customExceptions import *
from models.user import *
from models.user_course import *
from sqlalchemy import *
import pandas as pd
import csv
import itertools
import os
import re

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
def studentcsvToDB(studentcsvfile, owner_id, course_id):
    if not studentcsvfile.endswith('.csv'):
        return WrongExtension.error
    try:
        with open(studentcsvfile, mode='r', encoding='utf-8-sig') as studentcsv:
            reader = list(itertools.tee(csv.reader(studentcsv))[0])
            header = reader[0]
            if len(header) < 3:
                return NotEnoughColumns.error
            if len(header) > 3:
                return TooManyColumns.error
            for row in range(1, len(reader)):
                student_name = reader[row][0].strip()
                lms_id = reader[row][1].strip()
                student_email = reader[row][2].strip()
                last_name = student_name.replace(",", "").split()[0].strip()
                first_name = student_name.replace(",", "").split()[1].strip()
                if ' ' in student_email or '@' not in student_email or not lms_id.isdigit():
                    return SuspectedMisformatting.error
                user = get_user_by_email(
                    student_email
                )
                if type(user) is type(""):
                    return user
                if user is None:
                    created_user = create_user({
                        "first_name": first_name,
                        "last_name": last_name,
                        "email": student_email,
                        "password": "Skillbuilder",
                        "role_id": 5,
                        "lms_id": lms_id,
                        "consent": None,
                        "owner_id": owner_id
                    })
                    if type(created_user) is type(""):
                        return created_user
                user_id = get_user_user_id_by_email(
                    student_email
                )
                if type(user_id) is type(""):
                    return user_id
                user_course = get_user_course_by_user_id_and_course_id(
                    user_id,
                    course_id
                )
                if type(user_course) is type(""):
                    return user_course
                if user_course is None:
                    user_id = get_user_user_id_by_email(
                        student_email
                    )
                    if type(user_id) is type(""):
                        return user_id
                    user_course = create_user_course({
                        "user_id": user_id,
                        "course_id": course_id
                    })
                    if type(user_course) is type(""):
                        return user_course
        return "Upload Successful!"
    except FileNotFoundError:
        return FileNotFound.error
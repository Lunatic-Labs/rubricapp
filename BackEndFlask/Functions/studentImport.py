from .customExceptions import *
from models.user import *
from models.user_course import *
from sqlalchemy import *
import csv
import itertools

"""
studentcsvToDB() takes three parameters:
    - the file path to the csv file (studentcsvfile)
    - the TA/Instructor or Admin creating the students (owner_id)
    - the course with which the students will be enrolled in (course_id)
studentcsvToDB()
    - reads in the csv file
    - extracts the students from the csv file
    - creates the new student users as long their emails are unique
    - returns the list of students made
studentcsvToDBO() expects the format of:
    - "last_name, first_name", lms_id, email, owner_id
"""
def studentcsvToDB(studentcsvfile, owner_id, course_id):
    students = []
    # Verify appropriate extension of .csv
    if not studentcsvfile.endswith('.csv'):
        return WrongExtension.error
    # Read file
    try:
        with open(studentcsvfile) as studentcsv:
            # reader2 is only used to retrieve the number of columns in the first row.
            reader, reader2 = itertools.tee(csv.reader(studentcsv))
            columns = len(next(reader2))
            del reader2
            if (columns > 3):
                return TooManyColumns.error
            elif (columns < 3):
                return NotEnoughColumns.error
            counter = 0
            for row in reader:
                # Is the 2nd item an lms_id or a column header?
                if row[1].strip().isdigit():
                    # parses the "last_name, first_name" format from csv file
                    fullname = row[0].strip("\"").split(",")
                    # Each student's
                    #   password is set to 'skillbuilder',
                    #   role is set to 5 aka "Student",
                    #   consent to None.
                    students.append({
                        "first_name": fullname[1].strip(),
                        "last_name": fullname[0].strip(),
                        "email": row[2].strip(),
                        "password": "skillbuilder",
                        "role_id": 5,
                        "lms_id": int(row[1].strip()),   
                        "consent": None,
                        "owner_id": owner_id
                    })
                elif (counter != 0):
                    return SuspectedMisformatting.error
                counter += 1
            for student in students:
                if get_users_by_email(student["email"]).__len__() == 0:
                    create_user(student)
                created_user = get_user_by_email(student["email"])
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
    except FileNotFoundError:
        return FileNotFoundError.error
from models.user import *
from models.user_course import *
from sqlalchemy import *
from customExceptions import *
import csv
import itertools

"""
    The function studentcsvToDB() takes in three parameters:
        the path to the studentCSVFile,
        the owner_id,
        and the course_id.
    The function attempts to read the passed in csv file to insert students into the Users table.
    A valid csv file contains student information in the format of:
        "last_name, first_name", lms_id, email, owner_id
"""

def studentcsvToDB(studentcsvfile, owner_id, course_id):
    try:
        students = []
        # Verify appropriate extension of .csv
        if not studentcsvfile.endswith('.csv'):
            raise WrongExtension
        # Read file
        with open(studentcsvfile) as studentcsv:
            # reader2 is only used to retrieve the number of columns in the first row.
            reader, reader2 = itertools.tee(csv.reader(studentcsv))
            columns = len(next(reader2))
            del reader2
            if (columns > 3):
                raise TooManyColumns
            elif (columns < 3):
                raise NotEnoughColumns
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
                    raise SuspectedMisformatting
                counter+=1
            for student in students:
                if get_users_by_email(student["email"]).__len__() == 0:
                    create_user(student)
                created_user = get_user_by_email(student["email"])
                # If the student has not already been assigned to the course, assign the student!
                if get_user_course_by_user_id_and_course_id(created_user.user_id, course_id) is None:
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
        error = "File contains more than the 3 expected columns: \"last_name, first_name\", lms_id, email"
        return error
    except NotEnoughColumns:
        error = "File contains less than the 3 expected columns: \"last_name, first_name\", lms_id, email"
        return error
    except SuspectedMisformatting:
        error = "Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected."
        return error
from models.user import *
from models.user_course import *
from sqlalchemy import *
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

class WrongExtension(Exception):
    "Raised when a file that does not have a .csv extension is submitted"
    pass
    
class TooManyColumns(Exception):
    "Raised when there are more than the 3 excepted columns in the csv file submitted"
    pass

class NotEnoughColumns(Exception):
    "Raised when there are less than the 3 expected columns in the csv file submitted"
    pass

class SuspectedMisformatting(Exception):
    "Raised when a column other than the header contains an integer where a valid id is excepted"
    pass

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
                    fullname = row[0].strip("\"").split(", ")
                    # Each student's
                    #   password is set to 'skillbuilder',
                    #   role is set to 5 aka "Student",
                    #   consent to None.
                    student ={
                        "first_name": fullname[1].strip(),
                        "last_name": fullname[0].strip(),
                        "email": row[2].strip(),
                        "password": "skillbuilder",
                        "role_id": 5,
                        "lms_id": int(row[1].strip()),   
                        "consent": None,
                        "owner_id": owner_id
                    }
                    # In order to assign students to a course, each student must first be created.
                    # After each student is created, the user_id is retrieved for each user
                    #   by querying the email of the last added user. 
                    # The course_id is passed in as a parameter.
                    # Then the user_id corresponding to the newly created student is assigned to the
                    #   corresponding course_id.
                    if (user_already_exists(student) is None):
                        create_user(student)
                    created_user = Users.query.filter(Users.email==student["email"]).first()
                    create_user_course({
                        "user_id": created_user.user_id,
                        "course_id": course_id
                    })
                    students.append(student)
                elif (counter != 0):
                    raise SuspectedMisformatting
                counter+=1
        return students

    # except (WrongExtension, TooManyColumns, NotEnoughColumns, SuspectedMisformatting):
    #     raise
    
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
        error = "File has less than the 3 expected columns: \"last_name, first_name\", lms_id, email"
        return error
        
    except SuspectedMisformatting:
        error = "Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected."
        return error
from models.user import *
from models.user_course import *
from sqlalchemy import *
import csv
import itertools

"""
This file holds a function that reads in csv file containing student information: "last_name, first_name", lms_id, email, ***owner_id 
then populates the Users table with this information under the assumption that all are students

*** goal is to pull owner_id from the logged-in user doing the bulk upload. In csv for now
"""

class WrongExtension(Exception):
    "Raised when a file that does not have a .csv extension is submitted"
    pass
    
class TooManyColumns(Exception):
    "Raised when there are more than the 3 excepted columns in the csv file submitted"
    pass

class NotEnoughColumns(Exception):
    "Raised when there less than the 3 expected columns in the csv file submitted"
    pass

class SuspectedMisformatting(Exception):
    "Raised when a column other than the header does contain an integer where a valid id is excepted"
    pass

def studentcsvToDB(studentcsvfile, owner_id, course_id):
    try:
        students=[]

        if not studentcsvfile.endswith('.csv'): # Verify appropriate extension
            raise WrongExtension
        with open(studentcsvfile) as studentcsv:   # Read file
            reader, reader2 = itertools.tee(csv.reader(studentcsv)) # reader2 only used to get num of cols in first row

            columns = len(next(reader2))
            del reader2
            if (columns > 3):
                raise TooManyColumns
            elif (columns < 3):
                raise NotEnoughColumns
            counter = 0

            for row in reader:
                if row[1].strip().isdigit(): # Is the 2nd item an lms_id or a column header?
                    fullname = row[0].strip("\"").split(", ")  # parses the "last_name, first_name" format from csv file

                    student ={
                        "first_name":fullname[1],
                        "last_name" :fullname[0],
                        "email"     :row[2].strip(),
                        "password"  :"skillbuilder",        # default to 'skillbuilder'
                        "role_id"   :5,                     # default to student role
                        "lms_id"    :int(row[1].strip()),   
                        "consent"   :None,                  # default to None
                        "owner_id"  :owner_id               
                    }

                    create_user(student)
                    # Since student's user_id is needed to assign them to a course,
                    # and their id is created upon insertion to table,
                    # I query for the max(user_id), which should be the record inserted last, to get their id
                    created_user = Users.query.order_by(Users.user_id.desc()).first()
                    create_user_course({"user_id":created_user.user_id, "course_id":course_id})
                    students.append(student)
                    
                elif (counter != 0):
                    raise SuspectedMisformatting
                counter+=1
                
        return students

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
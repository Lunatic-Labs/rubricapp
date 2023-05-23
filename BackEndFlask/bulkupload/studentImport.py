import csv
import os
from models.user import *
import itertools

"""
This file holds a function that reads in csv file containing student information: "lname, fname", lms_id, email, ***owner_id 
then populates the Users table with this information under the assumption that all are students

*** goal is to pull owner_id from the logged-in user doing the bulk upload. In csv for now
"""

class WrongExtension(Exception):
    "Raised when a file that does not have a .csv extension is submitted"
    pass
    
class TooManyColumns(Exception):
    "Raised when there are more than the 4 excepted columns in the csv file submitted"
    pass

class NotEnoughColumns(Exception):
    "Raised when there less than the 4 expected columns in the csv file submitted"
    pass

class SuspectedMisformatting(Exception):
    "Raised when a column other than the header does contain an integer where a valid id is excepted"
    pass
    
from models.user import *
import itertools

"""
This file holds a function that reads in csv file containing student information: "lname, fname", lms_id, email, ***owner_id 
then populates the Users table with this information under the assumption that all are students

*** goal is to pull owner_id from the logged-in user doing the bulk upload. In csv for now
"""

class WrongExtension(Exception):
    "Raised when a file that does not have a .csv extension is submitted"
    pass
    
class TooManyColumns(Exception):
    "Raised when there are more than the 4 excepted columns in the csv file submitted"
    pass

class NotEnoughColumns(Exception):
    "Raised when there less than the 4 expected columns in the csv file submitted"
    pass

class SuspectedMisformatting(Exception):
    "Raised when a column other than the header does contain an integer where a valid id is excepted"
    pass

def studentcsvToDB(studentcsvfile):
    try:
        if not studentcsvfile.endswith('.csv'):
            raise WrongExtension("Wrong filetype submitted! Please submit a .csv file.")
        with open(studentcsvfile) as studentcsv: 
            reader, reader2 = itertools.tee(csv.reader(studentcsv))
            columns = len(next(reader2))
            del reader2
            if (columns > 4):
                raise TooManyColumns("File contains more the the 4 expected columns: \"lname, fname\", lms_id, email, owner_id")
            elif (columns < 4):
                raise NotEnoughColumns("File has less than the 4 expected columns: \"lname, fname\", lms_id, email, owner_id")
            counter = 0
            for row in reader:
                if row[1].strip().isdigit(): # Is the 2nd item an lms_id or a column header?
                    fullname = row[0].strip("\"").split(", ")  # parses the "lname, fname" format from csv file
                    student ={
                        "first_name":fullname[1],
                        "last_name" :fullname[0],
                        "email"     :row[2].strip(),
                        "password"  :"skillbuilder",        # default to 'skillbuilder'
                        "role_id"   :5,                     # default to student role
                        "lms_id"    :int(row[1].strip()),   
                        "consent"   :None,                  # default to None
                        "owner_id"  :int(row[3].strip())    # eventually be derived from currently logged in user
                    }
                    create_user(student)
                elif (counter != 0):
                    raise SuspectedMisformatting("Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected")
                counter+=1

    
    except (WrongExtension, TooManyColumns, NotEnoughColumns, SuspectedMisformatting):
        raise
    
    # except SuspectedMisformatting:
    #     print("Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected.")
    #     raise
    # except WrongExtension:
    #     print("Wrong filetype submitted! Please submit a .csv file.")
    #     raise
        
    # except FileNotFoundError:
    #     print("File does not exist!")
    #     raise
        
    # except TooManyColumns:
    #     print("File contains more the the 4 expected columns: \"lname, fname\", lms_id, email, owner_id")
    #     raise
        
    # except NotEnoughColumns:
    #     print("File has less than the 4 expected columns: \"lname, fname\", lms_id, email, owner_id")
    #     raise
    # except SuspectedMisformatting:
    #     error = "Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected."
    #     return error
    
        
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

def studentcsvToDB(studentcsvfile):
    try:
        students=[]
        if not studentcsvfile.endswith('.csv'):
            raise WrongExtension

        with open(studentcsvfile) as studentcsv: 

            reader, reader2 = itertools.tee(csv.reader(studentcsv))
            columns = len(next(reader2))
            del reader2
            if (columns > 4):
                raise TooManyColumns
            elif (columns < 4):
                raise NotEnoughColumns
             
            counter = 0
            for row in reader:
                if row[1].strip().isdigit(): # Is the 2nd item an lms_id or a column header?

                    fullname = row[0].strip("\"").split(", ")  # parses the "lname, fname" format from csv file

                    student = []
                    student.append(fullname[1])          # fname
                    student.append(fullname[0])          # lname
                    student.append(row[2].strip())       # email
                    student.append("skillbuilder")       # password        - default "skillbuilder"
                    student.append(5)                    # role            - default "student"
                    student.append(int(row[1].strip()))  # lms_id          
                    student.append(1)                 # consent         - default NULL
                    student.append(int(row[3].strip()))  # owner_id        - default CSV, but will be changed later on
                    create_user(student)
                    students.append(student)
                    
                elif (counter != 0):
                    raise SuspectedMisformatting
                counter+=1
        return students

    except WrongExtension:
        error = "Wrong filetype submitted! Please submit a .csv file."
        return error
        
    except FileNotFoundError:
        error = "File does not exist!"
        return error
        
    except TooManyColumns:
        error = "File contains more the the 4 expected columns: \"lname, fname\", lms_id, email, owner_id"
        return error
        
    except NotEnoughColumns:
        error = "File has less than the 4 expected columns: \"lname, fname\", lms_id, email, owner_id"
        return error
        
    except SuspectedMisformatting:
        error = "Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected."
        return error



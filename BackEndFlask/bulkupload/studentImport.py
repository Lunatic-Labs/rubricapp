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
                elif (counter != 0):
                    raise SuspectedMisformatting
                counter+=1

    except WrongExtension:
        print("Wrong filetype submitted! Please submit a .csv file.")
        
    except FileNotFoundError:
        print("File does not exist!")
        
    except TooManyColumns:
        print("File contains more the the 4 expected columns: \"lname, fname\", lms_id, email, owner_id")
        
    except NotEnoughColumns:
        print("File has less than the 4 expected columns: \"lname, fname\", lms_id, email, owner_id")
        
    except SuspectedMisformatting:
        print("Row other than header does not contain an integer where an lms_id is expected. Misformatting Suspected.")


<<<<<<< Updated upstream
    with open(studentcsvfile) as studentcsv: 
        reader = csv.reader(studentcsv)

        for row in reader:
            if row[3].strip().isdigit(): # Is the fourth item an owner_id or a column header?
                student = []
                student.append(row[0].strip())       # first_name
                student.append(row[1].strip())       # last_name
                student.append(row[2].strip())       # email
                student.append("skillbuilder")       # password  - default "skillbuilder"
                student.append(3)                    # role      - default "student"
                student.append(1)                 # lms_id    - default NULL
                student.append(1)                 # consent   - default TRUE
                student.append(int(row[3].strip()))  # owner_id  - default CSV but will be changed later on
                # status = create_user(student)
                # if type(status) == type(""):
                #     print(status)
                # print(student)

dir = os.getcwd() + os.path.join(os.path.sep, "bulkupload") + os.path.join(os.path.sep, "sample_csv") + os.path.join(os.path.sep, "testStudent1.csv")
print(dir)

# studentcsvToDB(dir)
# print('')
# print('')
# print('')

# type(sys.path)
# for path in sys.path:
#     print(path)
=======
>>>>>>> Stashed changes

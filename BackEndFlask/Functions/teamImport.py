from models.user import *
from models.team import *
from models.team_user import *
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
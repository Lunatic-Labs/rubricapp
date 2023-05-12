import csv
import os
from models.user import *

"""
This file holds a function that reads in csv file containing student information: "lname, fname", lms_id, email, ***owner_id 
then populates the Users table with this information under the assumption that all are students

*** goal is to pull owner_id from the logged-in user doing the bulk upload. In csv for now
"""

def studentcsvToDB(studentcsvfile):

    with open(studentcsvfile) as studentcsv: 
        reader = csv.reader(studentcsv)

        for row in reader:
            if row[3].strip().isdigit(): # Is the fourth item an owner_id or a column header?

                fullname = row[0].strip("\"").split(", ")  # parses the "lname, fname" format from csv file
                
                student = []
                student.append(fullname[1])          # fname
                student.append(fullname[0])          # lname
                student.append(row[2].strip())       # email
                student.append("skillbuilder")       # password        - default "skillbuilder"
                student.append(5)                    # role            - default "student"
                student.append(int(row[1].strip()))  # lms_id          
                student.append(1)                    # consent         - default TRUE
                student.append(0)                    # consent_is_null - default FALSE
                student.append(int(row[3].strip()))  # owner_id        - default CSV, but will be changed later on
                create_user(student)

# import sys
# sys.path.append('/Users/luisgodinez/Documents/Junior_Fall/Soft-Stud/rubricapp/BackEndFlask/models')
import csv
import os
# from models.user import *
# import models

def studentcsvToDB(studentcsvfile):

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

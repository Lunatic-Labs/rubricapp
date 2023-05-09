# import sys
# sys.path.append('/Users/luisgodinez/Documents/Junior_Fall/Soft-Stud/rubricapp/BackEndFlask/models')
import csv
# from user import *
# import models

def studentcsvToDB(studentcsvfile):

    with open(studentcsvfile) as studentcsv: 
        reader = csv.reader(studentcsv)

        for row in reader:
            if row[3].strip().isdigit(): # Is the fourth item an owner_id or a column header?
                student = []
                student.append(row[0].strip())       # fname
                student.append(row[1].strip())       # lname
                student.append(row[2].strip())       # email
                student.append("skillbuilder")       # password  - default "skillbuilder"
                student.append(3)                    # role      - default "student"
                student.append(None)                 # lms_id    - default NULL
                student.append(True)                 # consent   - default TRUE
                student.append(int(row[3].strip()))  # owner_id  - default CSV but will be changed later on
                # create_user(student)
                print(student)

studentcsvToDB("BackEndFlask/bulkupload/sample_csv/testStudent1.csv")

# print('')
# print('')
# print('')

# type(sys.path)
# for path in sys.path:
#     print(path)

from Functions.test_files.PopulationFunctions import *
from Functions.customExceptions import *
from models.user import *
from models.user_course import *
from sqlalchemy import *
import itertools
import csv

# student_csv_to_db()
#   - takes three parameters:
#       - the file path to the csv file (studentcsvfile)
#       - the TA/Instructor or Admin creating the students (owner_id)
#   - the course with which the students will be enrolled in (course_id)
#   - reads in the csv file
#   - extracts the students from the csv file
#   - creates the new student users as long their emails are unique
#   - returns an array of students made
#   - expects the format of:
#       - "last_name, first_name", lms_id, email, owner_id
def student_csv_to_db(student_file, owner_id, course_id):
    if not student_file.endswith('.csv') and not student_file.endswith('.xlsx'):
        raise WrongExtension
    
    is_xlsx = False
    if student_file.endswith('.xlsx'):
        is_xlsx = True
        student_file = xlsx_to_csv(student_file)
    try:
        with open(student_file, mode='r', encoding='utf-8-sig') as studentcsv:
            reader = list(itertools.tee(csv.reader(studentcsv))[0])
            header = reader[0]
            
            if len(header) < 3:
                raise NotEnoughColumns
            if len(header) > 3:
                delete_xlsx(student_file, is_xlsx)
                raise TooManyColumns
            
            for row in range(0, len(reader)):
                student_name = reader[row][0].strip()
                lms_id = reader[row][1].strip()
                student_email = reader[row][2].strip()
                last_name = student_name.replace(",", "").split()[0].strip()
                first_name = student_name.replace(",", "").split()[1].strip()
                
                if not lms_id.isdigit() or not is_valid_email(student_email):
                    raise SuspectedMisformatting
                
                user = get_user_by_email(
                    student_email
                )
                if user is None:
                    created_user = create_user({
                        "first_name": first_name,
                        "last_name": last_name,
                        "email": student_email,
                        "password": "Skillbuilder",
                        "lms_id": lms_id,
                        "consent": None,
                        "owner_id": owner_id
                    })
                user_id = get_user_user_id_by_email(
                    student_email
                )
                
                user_course = get_user_course_by_user_id_and_course_id(
                    user_id,
                    course_id
                )
                
                if user_course is None:
                    user_id = get_user_user_id_by_email(
                        student_email
                    )
                    
                    user_course = create_user_course({
                        "user_id": user_id,
                        "course_id": course_id,
                        # role_id of 5 is a "Student"
                        "role_id": 5
                    })
                    
        delete_xlsx(student_file, is_xlsx)
        return "Upload Successful!"
    except Exception as e:
        delete_xlsx(student_file, is_xlsx)
        raise e
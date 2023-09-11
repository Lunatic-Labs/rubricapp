from Functions.test_files.population_functions import *
from Functions.customExceptions import *
from models.user import *
from models.role import get_role
from models.user_course import *
from sqlalchemy import *
import itertools
import csv

# TODO: Refactor function to not return a string. Instead, have it return
#       some sort of exit code or boolean.
# TODO: Require password.
def genericcsvToDB(studentFile: str, owner_id: int, course_id: int) -> str | Exception:
    if not studentFile.endswith('.csv') and not studentFile.endswith('.xlsx'):
        return WrongExtension.error

    # Determine if file is .xlsx.
    isXlsx = studentFile.endswith('.xlsx')
    if isXlsx:
        studentFile = xlsx_to_csv(studentFile)

    studentcsv = None # Not sure if this is needed here.
    try:
        studentcsv = open(studentFile, mode='r', encoding='utf-8-sig')
    except FileNotFoundError:
        delete_xlsx(studentFile, isXlsx)
        return FileNotFound.error

    reader = list(itertools.tee(csv.reader(studentcsv))[0])
    header = reader[0]

    # Checking for 4 for: FN LN, email, role, (optional) LMS ID
    if len(header) < 3:
        delete_xlsx(studentFile, isXlsx)
        return NotEnoughColumns.error

    # Checking for 4 for: FN LN, email, role, (optional) LMS ID
    if len(header) > 4:
        delete_xlsx(studentFile, isXlsx)
        return TooManyColumns.error

    for row in range(0, len(reader)):
        name = reader[row][0].strip() # FN & LN
        email = reader[row][1].strip()
        role = reader[row][2].strip()
        last_name = name.replace(",", "").split()[0].strip()
        first_name = name.replace(",", "").split()[1].strip()

        # TODO: (optional) check next entry
        lms_id = reader[row][3].strip()

        # Corrosponding role ID for the string `role`.
        role_id = get_role(role)

        # TODO: `isValidEmail()` should check for `' '` and `@`.
        if ' ' in email or '@' not in email or not lms_id.isdigit() or not isValidEmail(email):
            delete_xlsx(studentFile, isXlsx)
            return SuspectedMisformatting.error

        user = get_user_by_email(email)

        if type(user) is type(""):
            delete_xlsx(studentFile, isXlsx)
            return user

        if user is None:
            created_user = create_user({
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "password": "Skillbuilder", # TODO: require password.
                "role_id": role_id,
                "lms_id": lms_id,
                "consent": None,
                "owner_id": owner_id
            })

            if type(created_user) is type(""):
                delete_xlsx(studentFile, isXlsx)
                return created_user

        user_id = get_user_user_id_by_email(student_email)

        if type(user_id) is type(""):
            delete_xlsx(studentFile, isXlsx)
            return user_id

        user_course = get_user_course_by_user_id_and_course_id(
            user_id,
            course_id
        )

        if type(user_course) is type(""):
            delete_xlsx(studentFile, isXlsx)
            return user_course

        if user_course is None:
            user_id = get_user_user_id_by_email(student_email)

            if type(user_id) is type(""):
                delete_xlsx(studentFile, isXlsx)
                return user_id

            user_course = create_user_course({
                "user_id": user_id,
                "course_id": course_id
            })

            if type(user_course) is type(""):
                delete_xlsx(studentFile, isXlsx)
                return user_course

    studentcsv.close()
    delete_xlsx(studentFile, isXlsx)
    return "Upload Successful!"

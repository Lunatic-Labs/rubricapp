from Functions.test_files.population_functions import *
from Functions.customExceptions import *
from models.user import *
from models.role import get_role # used for getting role id from string role
from models.user_course import *
from sqlalchemy import *
import itertools
import csv

def __field_exists(field, userFile, isXlsx):
    if type(field) is str: # Is of type(str) if a error is returned.
        delete_xlsx(userFile, isXlsx)
        return field
    return True

# TODO: Refactor function to not return a string. Instead, have it return
#       some sort of exit code or boolean.
# TODO: Require password.
def genericcsvToDB(userFile: str, owner_id: int, course_id: int) -> str | Exception:
    if not userFile.endswith('.csv') and not userFile.endswith('.xlsx'):
        return WrongExtension.error

    # Determine if file is .xlsx.
    isXlsx = userFile.endswith('.xlsx')
    if isXlsx:
        userFile = xlsx_to_csv(userFile)

    studentcsv = None # Not sure if this is needed here.
    try:
        studentcsv = open(userFile, mode='r', encoding='utf-8-sig')
    except FileNotFoundError:
        delete_xlsx(userFile, isXlsx)
        return FileNotFound.error

    reader = list(itertools.tee(csv.reader(studentcsv))[0])
    header = reader[0]

    # Checking for 4 for: FN LN, email, role, (optional) LMS ID
    if len(header) < 3:
        delete_xlsx(userFile, isXlsx)
        return NotEnoughColumns.error

    # Checking for 4 for: FN LN, email, role, (optional) LMS ID
    if len(header) > 4:
        delete_xlsx(userFile, isXlsx)
        return TooManyColumns.error

    for row in range(0, len(reader)):
        name       = reader[row][0].strip() # FN & LN
        email      = reader[row][1].strip()
        role       = reader[row][2].strip()
        last_name  = name.replace(",", "").split()[0].strip()
        first_name = name.replace(",", "").split()[1].strip()

        # TODO: (optional) check next entry
        lms_id = reader[row][3].strip()

        # Corrosponding role ID for the string `role`.
        role_id = get_role(role)

        # TODO: `isValidEmail()` should check for `' '` and `@`.
        if ' ' in email or '@' not in email or not lms_id.isdigit() or not isValidEmail(email):
            delete_xlsx(userFile, isXlsx)
            return SuspectedMisformatting.error

        # TODO: These functions should return `obj, error`.
        user = get_user_by_email(email)

        if not __field_exists(user, userFile, isXlsx):
            return user

        if user is None:
            created_user = create_user({
                "first_name": first_name,
                "last_name":  last_name,
                "email":      email,
                "password":   "Skillbuilder", # TODO: Require password.
                "role_id":    role_id,
                "lms_id":     lms_id,
                "consent":    None,           # NOTE: Not sure what to do with this.
                "owner_id":   owner_id        # NOTE: Not sure what to do with this.
            })
            if not __field_exists(created_user, userFile, isXlsx):
                return created_user

        user_id = get_user_user_id_by_email(email)

        if not __field_exists(user_id, userFile, isXlsx):
            return user_id

        user_course = get_user_course_by_user_id_and_course_id(
            user_id,
            course_id
        )

        if not __field_exists(user_course, userFile, isXlsx):
            return user_course

        if user_course is None:
            user_id = get_user_user_id_by_email(email)

            if not __field_exists(user_id, userFile, isXlsx):
                return user_id

            user_course = create_user_course({
                "user_id": user_id,
                "course_id": course_id
            })

            if not __field_exists(user_course, userFile, isXlsx):
                return user_course

    studentcsv.close()
    delete_xlsx(userFile, isXlsx)
    return "Upload Successful!"

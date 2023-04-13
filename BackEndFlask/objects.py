from core import *
# from BackEndFlask.migrations import *
from migrations import *

# login manager is a extension library for login system including login_required
# login_required
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# def load_course(course_id):
#     return Courses.query.filter_by(course_id=course_id)
# def load_courses():
#     return Courses.query.all()

# users = load_user()
# def returnCourses():
#     courses = load_courses()
#     coursesList = []
#     for course in courses:
#         newCourse = {
#             "courseID": course.course_id,
#             "courseName": course.course_name,
#             "courseAbbreviation": course.course_abbreviation
#         }
#         coursesList.append(newCourse)
#     response = {
#         "content": coursesList
#     }
#     return response

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[validators.InputRequired(), validators.Email(message='Invalid email'), validators.Length(max=255)])
    password = PasswordField('Password', validators=[validators.InputRequired(), validators.Length(min=8, max=80)])
    remember = BooleanField('Remember me')


class RegisterForm(FlaskForm):
    email = StringField('Email', validators=[validators.InputRequired(), validators.Email(message='Invalid email'), validators.Length(max=255)])
    password = PasswordField('Password', validators=[validators.InputRequired(), validators.Length(min=8, max=80), validators.EqualTo('checkpassword', message='Passwords must match')], description="password size between 8-80")
    checkpassword = PasswordField('Check Password', validators=[validators.InputRequired(), validators.Length(min=8, max=80)], description="write password again")

@register.filter(is_safe=True)
def js(obj):
    return mark_safe(json.dumps(obj))


#Validator is function which checks whether the information is correct before proceed;
# NameValidator is used in login
class NameValidator(object):
    @login_required
    def __call__(self, form, field):
        duplicate_project_name = Project.query.filter_by(project_name=field.data,
                                                         owner=current_user.username).first()
        # print(field.data)
        # print(current_user.username)
        # print(duplicate_project_name)
        if duplicate_project_name is not None:
            raise ValidationError("The project name has been used before")

# check whether primary keys are in the student file;
class validate_project_student_file(object):
    @login_required
    def __call__(self, form, field):
        try:
            path_to_current_user = "{}/{}".format(base_directory, current_user.username)
            path_to_student_file_stored = "{}/".format(path_to_current_user)
            student_file_filename = "student.xlsx"
            field.data.save(path_to_student_file_stored + student_file_filename)
            student_file_workbook = load_workbook(path_to_student_file_stored + student_file_filename)
            student_file_worksheet = student_file_workbook['Sheet1']
            find_Student = True if 'Student' in [x.value for x in
                                                 list(student_file_worksheet.iter_rows())[0]] else False
            find_Email = True if 'Email' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False
            find_group = True if 'group' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False
            find_meta_group = True if 'meta' in [x.value for x in list(student_file_worksheet.iter_rows())[0]] else False
            if find_group is False:
                # os.remove(path_to_student_file_stored)
                raise ValidationError("Can not find group")
            elif find_Student is False:
                raise ValidationError("Can not find Student")
            elif find_Email is False:
                raise ValidationError("Can not find Email")
            # os.remove(path_to_student_file_stored+student_file_filename)
            elif find_meta_group is False:
                raise ValidationError("Can not find meta - group")
        except Exception as e:
            raise ValidationError(e)


# check whether primary keys are in the rubric json file
class validate_project_json_file(object):
    @login_required
    def __call__(self, form, field):
        try:
            path_to_current_user = "{}/{}".format(base_directory, current_user.username)
            path_to_json_file_stored = "{}/".format(path_to_current_user)
            json_file_filename = "TW.json"
            field.data.save(path_to_json_file_stored + json_file_filename)
            myLock = FileLock((path_to_json_file_stored + json_file_filename) + '.lock', timeout=5)
            with myLock:
                with open(path_to_json_file_stored + json_file_filename, 'r')as f:
                    json_data = json.loads(f.read(), strict=False)

            if 'name' in json_data.keys() and 'category' in json_data.keys():
                for category in json_data['category']:
                    if 'name' in category.keys() and 'section' in category.keys():
                        category_name = (category['name'])
                        for section in category['section']:
                            if 'name' in section.keys() and 'type' in section.keys() and 'values' in section.keys():
                                for value in section['values']:
                                    if 'name' not in value.keys() or 'desc' not in value.keys():
                                        raise ValidationError("lack of NAME or DESC in json file")

                            else:
                                raise ValidationError("lack of NAME or TYPE or VALUES in json file")
                    else:
                        raise ValidationError("lack of NAME or SECTIONS in json file")
            else:
                raise ValidationError("lack of NAME or CATEGORY in json file")
        except Exception as e:
            raise ValidationError(e)
        # os.remove(path_to_json_file_stored+ json_file_filename)


# flaskform for wtf
class ProjectForm(FlaskForm):
    project_name = StringField('Project Name',
                               validators=[validators.InputRequired(), validators.Length(min=3, max=150), NameValidator()], description="3-150 characters")
    project_description = StringField('Description', validators=[validators.Length(min=0, max=255)], description="0-255 characters")
    student_file = FileField('Roster', validators=[validators.InputRequired(), validate_project_student_file()])
    json_file = FileField('Rubric', validators=[validators.InputRequired(), validate_project_json_file()])


# messages for the project_profile page
class ManageProjectMessage:
    def __init__(self, path, message, type):
        self.path = path
        self.message = message
        self.type = type


class ManageProjectMessages:
    UserNotFound = ManageProjectMessage("unf", "User not found", "negative")
    Created = ManageProjectMessage("create", "Permission successfully created", "positive")
    NotYourself = ManageProjectMessage("self", "You cannot give permission to yourself", "negative")
    Failed = ManageProjectMessage("fail", "Failed to create permission for unknown reason", "negative")
    NoMessage = ManageProjectMessage("success", "", "none")
    UpdatedAuthority = ManageProjectMessage("upauth", "successfully updated authority", "positive")
    DeletedPerm = ManageProjectMessage("delperm", "successfully delete permission", "positive")
    FailedUpAuth = ManageProjectMessage("failupauth", "failure to update authority", "negative")

    @classmethod
    def lookup(cls, msg):
        return {cls.UserNotFound.path: cls.UserNotFound,
                cls.Created.path: cls.Created,
                cls.NotYourself.path: cls.NotYourself,
                cls.Failed.path: cls.Failed,
                cls.NoMessage.path: cls.NoMessage,
                cls.UpdatedAuthority.path: cls.UpdatedAuthority,
                cls.DeletedPerm.path: cls.DeletedPerm,
                cls.FailedUpAuth.path: cls.FailedUpAuth}[msg]

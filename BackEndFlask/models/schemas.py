from core import db
from flask_login import UserMixin
from sqlalchemy import ForeignKey, func, DateTime

"""
Something to consider may be the due_date as the default
may be currently set to whatever the current timezone/date/time
the assessment task was created at.
"""

class AssessmentTask(UserMixin, db.Model):
    __tablename__ = "AssessmentTasks"
    __table_args__ = {'sqlite_autoincrement' : True}
    at_id = db.Column(db.Integer, primary_key=True)
    at_name = db.Column(db.String(100))
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id")) # Might have to think about
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id")) # how to handle updates and deletes
    at_role = db.Column(db.Integer, ForeignKey("Role.role_id"))
    due_date = db.Column(DateTime(timezone=True), server_default=func.now()) # may need to be updated later
    suggestions = db.Column(db.Boolean, unique=True)

class Category(UserMixin, db.Model):
    __tablename__ = "Category"
    __table_args__ = {'sqlite_autoincrement': True}
    category_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    name = db.Column(db.String(30), nullable=False)
    ratings = db.Column(db.Integer, nullable=False)

"""
oc_data is type string that can hold 16 characters.
    - These characters are all 0s and 1s with an empty rubric being set
      with all 0s.
    - If a 0 is present, this means that the observable characteristic is
      unchecked.
    - If a 1 is present, this means that the observable characteristic is
      checked.
    - An example of this would be 00011.
        - In this example, the first three 0s indicated that the first 3 observable
          characteristics are unchecked.
        - The following two 1s indicated that the last two observable characteristics
          are checked.


sfi_data works the exact same way as oc_data.   
"""

class Completed_Rubric(UserMixin, db.Model):
    __tablename__ = "Completed_Rubric"
    __table_args__ = {'sqlite_autoincrement': True}
    cr_id = db.Column(db.Integer, primary_key=True)
    at_id = db.Column(db.Integer, ForeignKey("AssessmentTasks.at_id"))
    by_role = db.Column(db.Integer, ForeignKey("Users.user_id"))
    team_or_user = db.Column(db.Boolean, nullable=False)
    team_id = db.Column(db.Integer, ForeignKey("Team.team_id"), nullable=True)
    user_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=True)
    # for_role = db.Column(db.Integer, ForeignKey("Users.user_id")) # split into team_id & user_id
    initial_time = db.Column(db.DateTime(timezone=True), server_default=func.now()) # may need to be updated
    last_update = db.Column(db.DateTime(timezone=True), onupdate=func.now()) # also may need to be updated
    rating = db.Column(db.Integer)
    oc_data = db.String((16)) # this will determine whether or not oc was filled out or not
    sfi_data = db.String((16)) # same as above ^

class Course(UserMixin, db.Model):
    __tablename__ = "Course"
    __table_args__ = {'sqlite_autoincrement': True}
    course_id = db.Column(db.Integer, primary_key=True)
    course_number = db.Column(db.String(10), nullable=False)
    course_name = db.Column(db.String(10), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    term = db.Column(db.String(50), nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey("Course.course_id"), nullable=False)
    use_tas = db.Column(db.Boolean, nullable=False)

class ObservableCharacteristics(UserMixin, db.Model):
    __tablename__ = "ObservableCharacteristics"
    __table_args__ = {'sqlite_autoincrement': True}
    oc_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    category_id = db.Column(db.Integer,ForeignKey("Category.category_id"), nullable=False)
    oc_text = db.Column(db.String(10000), nullable=False)

""" 
Roles will equal the following:
    1 = Researcher
    2 = SuperAdmin
    3 = Admin
    4 = TA/Instructor
    5 = Student
"""

class Role(UserMixin, db.Model): 
    __tablename__ = "Role"
    __table_args__ = {'sqlite_autoincrement': True}
    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(100), nullable=False) 

class Rubric(UserMixin, db.Model):
    __tablename__ = "Rubric"
    __table_args__ = {'sqlite_autoincrement': True}
    rubric_id = db.Column(db.Integer, primary_key=True)
    rubric_name = db.Column(db.String(100))
    rubric_desc = db.Column(db.String(100), nullable=True)

class SuggestionsForImprovement(UserMixin, db.Model):
    __tablename__ = "SuggestionsForImprovement"
    __table_args__ = {'sqlite_autoincrement': True}
    sfi_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    category_id = db.Column(db.Integer, ForeignKey("Category.category_id"), nullable=False)
    sfi_text = db.Column(db.JSON, nullable=False)

class TeamUser(UserMixin, db.Model):
    __tablename__ = "TeamUser"
    __table_args__ = {'sqlite_autoincrement': True}
    tu_id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, ForeignKey("Team.team_id"), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False )

class Team(UserMixin, db.Model):
    __tablename__ = "Team"
    __table_args__ = {'sqlite_autoincrement': True}
    team_id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(25), nullable=False)
    observer_id = db.Column(db.Integer,ForeignKey("Users.user_id"), nullable=False)
    date = db.Column(db.Date, nullable=False)

class UserCourse(UserMixin, db.Model):
    __tablename__ = "UserCourse"
    __table_arges__ = {'sqlite_autoincrement': True}
    uc_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id"), nullable=False )

class Users(UserMixin, db.Model):
    __tablename__ = "Users"
    __table_args__ = {'sqlite_autoincrement': True}
    user_id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(30), nullable=False)
    lname = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    role_id = db.Column(db.Integer, ForeignKey("Role.role_id"),nullable=False)   
    lms_id = db.Column(db.Integer, unique=True, nullable=True)
    # Need to change consent to a string that can be either yes, no, or nothing!
    consent = db.Column(db.Boolean, nullable=True)
    # Added new attribute for consent not yet taken!
    owner_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=True)

class InstructorTaCourse(UserMixin, db.Model):
    __tablename__ = "InstructorTaCourse"
    __table_args__ = {'sqlite_autoincrement': True}
    itc_id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)
    ta_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id"), nullable=False)
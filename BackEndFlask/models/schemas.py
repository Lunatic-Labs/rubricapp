from core import db
from flask_login import UserMixin
from sqlalchemy import ForeignKey, func, DateTime

"""
    AssessmentTask(at_id, at_name, course_id, rubric_id, at_role, due_date, suggestions)
    Category(category_id, rubric_id, name, rating_id)
    Completed_Rubric(cr_id, at_id, by_role, team_or_user, team_id, user_id, initial_time, last_update, rating, oc_data, sfi_data)
    Course(course_id, course_number, course_name, year, term, active, admin_id, use_tas, fixed_teams)
    ObservableCharacteristics(oc_id, rubric_id, category_id, oc_text)
    Role(role_id, role_name)
    Rubric(rubric_id, rubric_name, rubric_desc)
    SuggestionsForImprovement(sfi_id, rubric_id, category_id, sfi_text)
    TeamUser(tu_id, team_id, user_id)
    TeamCourse(tc_id, team_id, course_id)
    Team(team_id, team_name, observer_id, date)
    UserCourse(uc_id, user_id, course_id)
    Users(user_id, first_name, last_name, email, password, role_id, lms_id, consent, owner_id)
    InstructorTaCourse(itc_id, owner_id, ta_id, course_id)
    Rating(rating_id, rating_name, rating_description, rating_json)
"""

"""
Something to consider may be the due_date as the default
may be currently set to whatever the current timezone/date/time
the assessment task was created at.
"""

class AssessmentTask(UserMixin, db.Model):
    __tablename__ = "AssessmentTask"
    __table_args__ = {'sqlite_autoincrement' : True}
    at_id = db.Column(db.Integer, primary_key=True)
    at_name = db.Column(db.String(100))
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id")) # Might have to think about
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id")) # how to handle updates and deletes
    role_id = db.Column(db.Integer, ForeignKey("Role.role_id"))
    due_date = db.Column(DateTime(timezone=True), server_default=func.now()) # may need to be updated later
    suggestions = db.Column(db.Boolean, nullable=False)

class Category(UserMixin, db.Model):
    __tablename__ = "Category"
    __table_args__ = {'sqlite_autoincrement': True}
    category_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    name = db.Column(db.String(30), nullable=False)

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
    at_id = db.Column(db.Integer, ForeignKey("AssessmentTask.at_id"))
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
    course_name = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    term = db.Column(db.String(50), nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)
    use_tas = db.Column(db.Boolean, nullable=False)
    fixed_teams = db.Column(db.Boolean, nullable=False)

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
    user_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)

class TeamCourse(UserMixin, db.Model):
    __tablename__ = "TeamCourse"
    __table_args__ = {'sqlite_autoincrement': True}
    tc_id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, ForeignKey("Team.team_id"), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id"), nullable=False)

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
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id"), nullable=False)

class Users(UserMixin, db.Model):
    __tablename__ = "Users"
    __table_args__ = {'sqlite_autoincrement': True}
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    role_id = db.Column(db.Integer, ForeignKey("Role.role_id"),nullable=False)   
    lms_id = db.Column(db.Integer, unique=True, nullable=True)
    consent = db.Column(db.Boolean, nullable=True)
    owner_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=True)

class InstructorTaCourse(UserMixin, db.Model):
    __tablename__ = "InstructorTaCourse"
    __table_args__ = {'sqlite_autoincrement': True}
    itc_id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)
    ta_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id"), nullable=False)

    # Rating(rating_id, rating_name, rating_description, rating_json)

class Ratings(UserMixin, db.Model):
    __tablename__ = "Ratings"
    __table_args__ = {'sqlite_autoincrement': True}
    rating_id = db.Column(db.Integer, primary_key=True)
    rating_description = db.Column(db.String(255), nullable=False)
    rating_json = db.Column(db.JSON, nullable=False)
    category_id = db.Column(db.Integer, ForeignKey(Category.category_id), nullable=False)

from core import db
from flask_login import UserMixin
from sqlalchemy import ForeignKey, func, DateTime

# TODO: Determine whether rating in Completed_Assessment is a sum of all the ratings or a JSON object of all ratings.

"""
    AssessmentTask(assessment_task_id, assessment_task_name, course_id, rubric_id, role_id, due_date, show_suggestions)
    Category(category_id, rubric_id, category_name)
    Completed_Assessment(completed_assessment_id, assessment_task_id, by_role, using_teams, team_id, user_id, initial_time, last_update, rating_summation, observable_characteristics_data, suggestions_data)
    Course(course_id, course_number, course_name, year, term, active, admin_id, use_tas)
    InstructorTaCourse(instructor_ta_id, owner_id, ta_id, course_id)
    ObservableCharacteristics(observable_characteristics_id, rubric_id, category_id, observable_characteristics_text)
    Ratings(rating_id, rating_description, rating_json, category_id)
    Role(role_id, role_name)
    Rubric(rubric_id, rubric_name, rubric_desc)
    SuggestionsForImprovement(suggestion_id, rubric_id, category_id, suggestion_text)
    Team(team_id, team_name, observer_id, date)
    TeamAssessmentTask(team_assessment_task_id, team_id, assessment_task_id)
    TeamUser(team_user_id, team_id, user_id)
    UserCourse(user_course_id, user_id, course_id)
    Users(first_name, last_name, email, password, role_id, lms_id, consent, owner_id)
"""

"""
Something to consider may be the due_date as the default
may be currently set to whatever the current timezone/date/time
the assessment task was created at.
"""

class AssessmentTask(UserMixin, db.Model):
    __tablename__ = "AssessmentTask"
    __table_args__ = {'sqlite_autoincrement' : True}
    assessment_task_id = db.Column(db.Integer, primary_key=True)
    assessment_task_name = db.Column(db.String(100))
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id"))
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id")) # how to handle updates and deletes
    role_id = db.Column(db.Integer, ForeignKey("Role.role_id"))
    due_date = db.Column(DateTime(timezone=True), server_default=func.now()) # may need to be updated later
    show_suggestions = db.Column(db.Boolean, nullable=False)

class Category(UserMixin, db.Model):
    __tablename__ = "Category"
    __table_args__ = {'sqlite_autoincrement': True}
    category_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    category_name = db.Column(db.String(30), nullable=False)

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

class Completed_Assessment(UserMixin, db.Model):
    __tablename__ = "Completed_Assessment"
    __table_args__ = {'sqlite_autoincrement': True}
    completed_assessment_id = db.Column(db.Integer, primary_key=True)
    assessment_task_id = db.Column(db.Integer, ForeignKey("AssessmentTask.assessment_task_id"))
    by_role = db.Column(db.Integer, ForeignKey("Users.user_id"))
    using_teams = db.Column(db.Boolean, nullable=False)
    team_id = db.Column(db.Integer, ForeignKey("Team.team_id"), nullable=True)
    user_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=True)
    initial_time = db.Column(db.DateTime(timezone=True), server_default=func.now()) # may need to be updated
    last_update = db.Column(db.DateTime(timezone=True), onupdate=func.now()) # also may need to be updated
    rating_summation = db.Column(db.Integer) # currently implemented as a sum
    observable_characteristics_data = db.Column(db.String((16))) # this will determine whether or not oc was filled out or not
    suggestions_data = db.Column(db.String((16))) # same as above ^

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
    use_fixed_teams = db.Column(db.Boolean, nullable=False)

class InstructorTaCourse(UserMixin, db.Model):
    __tablename__ = "InstructorTaCourse"
    __table_args__ = {'sqlite_autoincrement': True}
    instructor_ta_course_id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)
    ta_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id"), nullable=False)

class ObservableCharacteristics(UserMixin, db.Model):
    __tablename__ = "ObservableCharacteristics"
    __table_args__ = {'sqlite_autoincrement': True}
    observable_characteristic_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    category_id = db.Column(db.Integer,ForeignKey("Category.category_id"), nullable=False)
    observable_characteristic_text = db.Column(db.String(10000), nullable=False)

class Ratings(UserMixin, db.Model):
    __tablename__ = "Ratings"
    __table_args__ = {'sqlite_autoincrement': True}
    rating_id = db.Column(db.Integer, primary_key=True)
    rating_description = db.Column(db.String(255), nullable=False)
    rating_json = db.Column(db.JSON, nullable=False)
    category_id = db.Column(db.Integer, ForeignKey(Category.category_id), nullable=False)

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
    rubric_description = db.Column(db.String(100), nullable=True)

class SuggestionsForImprovement(UserMixin, db.Model):
    __tablename__ = "SuggestionsForImprovement"
    __table_args__ = {'sqlite_autoincrement': True}
    suggestion_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    category_id = db.Column(db.Integer, ForeignKey("Category.category_id"), nullable=False)
    suggestion_text = db.Column(db.JSON, nullable=False)

class Team(UserMixin, db.Model):
    __tablename__ = "Team"
    __table_args__ = {'sqlite_autoincrement': True}
    team_id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(25), nullable=False)
    observer_id = db.Column(db.Integer,ForeignKey("Users.user_id"), nullable=False)
    date_created = db.Column(db.Date, nullable=False)

class TeamAssessmentTask(UserMixin, db.Model):
    __tablename__ = "TeamAssessmentTask"
    __table_args__ = {'sqlite_autoincrement': True}
    team_assessment_task_id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, ForeignKey("Team.team_id"), nullable=False)
    assessment_task_id = db.Column(db.Integer, ForeignKey("AssessmentTask.assessment_task_id"), nullable=False)
    
class TeamUser(UserMixin, db.Model):
    __tablename__ = "TeamUser"
    __table_args__ = {'sqlite_autoincrement': True}
    team_user_id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, ForeignKey("Team.team_id"), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)

class UserCourse(UserMixin, db.Model):
    __tablename__ = "UserCourse"
    __table_arges__ = {'sqlite_autoincrement': True}
    user_course_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("Users.user_id"), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey("Course.course_id"), nullable=False )

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


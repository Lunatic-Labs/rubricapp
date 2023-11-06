from core import db
from sqlalchemy import ForeignKey, func, DateTime

# TODO: Determine whether rating in Completed_Assessment is a sum of all the ratings or a JSON object of all ratings.

"""
    Rubric(rubric_id, rubric_name, rubric_description)
    Category(category_id, rubric_id, category_name)
    Ratings(rating_id, rating_description, rating_json, category_id)
    ObservableCharacteristics(observable_characteristics_id, rubric_id, category_id, observable_characteristics_text)
    SuggestionsForImprovement(suggestion_id, rubric_id, category_id, suggestion_text)
    Role(role_id, role_name)
    Users(user_id, first_name, last_name, email, password, lms_id, consent, owner_id)
    Course(course_id, course_number, course_name, year, term, active, admin_id, use_tas, use_fixed_teams)
    UserCourse(user_course_id, user_id, course_id, role_id)
    Team(team_id, team_name, course_id, observer_id, date_created, active_until)
    TeamUser(team_user_id, team_id, user_id)
    AssessmentTask(assessment_task_id, assessment_task_name, course_id, rubric_id, role_id, due_date, time_zone, show_suggestions, show_ratings, unit_of_assessment, comment)
    Completed_Assessment(completed_assessment_id, assessment_task_id, by_role, team_id, user_id, initial_time, last_update, rating_observable_characteristics_suggestions_data)
    Blacklist(id, token)
"""

class Rubric(db.Model):
    __tablename__ = "Rubric"
    __table_args__ = {'sqlite_autoincrement': True}
    rubric_id = db.Column(db.Integer, primary_key=True)
    rubric_name = db.Column(db.String(100))
    rubric_description = db.Column(db.String(100), nullable=True)

class Category(db.Model):
    __tablename__ = "Category"
    __table_args__ = {'sqlite_autoincrement': True}
    category_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey(Rubric.rubric_id), nullable=False)
    category_name = db.Column(db.String(30), nullable=False)

class Rating(db.Model):
    __tablename__ = "Rating"
    __table_args__ = {'sqlite_autoincrement': True}
    rating_id = db.Column(db.Integer, primary_key=True)
    rating_description = db.Column(db.String(255), nullable=False)
    rating_json = db.Column(db.JSON, nullable=False)
    category_id = db.Column(db.Integer, ForeignKey(Category.category_id), nullable=False)

class ObservableCharacteristic(db.Model):
    __tablename__ = "ObservableCharacteristic"
    __table_args__ = {'sqlite_autoincrement': True}
    observable_characteristics_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey(Rubric.rubric_id), nullable=False)
    category_id = db.Column(db.Integer, ForeignKey(Category.category_id), nullable=False)
    observable_characteristic_text = db.Column(db.String(10000), nullable=False)

class SuggestionsForImprovement(db.Model):
    __tablename__ = "SuggestionsForImprovement"
    __table_args__ = {'sqlite_autoincrement': True}
    suggestion_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey(Rubric.rubric_id), nullable=False)
    category_id = db.Column(db.Integer, ForeignKey(Category.category_id), nullable=False)
    suggestion_text = db.Column(db.JSON, nullable=False)

class Role(db.Model): 
    __tablename__ = "Role"
    __table_args__ = {'sqlite_autoincrement': True}
    role_id = db.Column(db.Integer, primary_key=True)
    role_name = db.Column(db.String(100), nullable=False) 

class User(db.Model):
    __tablename__ = "User"
    __table_args__ = {'sqlite_autoincrement': True}
    user_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    lms_id = db.Column(db.Integer, nullable=True)
    consent = db.Column(db.Boolean, nullable=True)
    owner_id = db.Column(db.Integer, ForeignKey(user_id), nullable=True)
    isAdmin = db.Column(db.Boolean, nullable=True)

class Course(db.Model):
    __tablename__ = "Course"
    __table_args__ = {'sqlite_autoincrement': True}
    course_id = db.Column(db.Integer, primary_key=True)
    course_number = db.Column(db.String(10), nullable=False)
    course_name = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    term = db.Column(db.String(50), nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)
    use_tas = db.Column(db.Boolean, nullable=False)
    use_fixed_teams = db.Column(db.Boolean, nullable=False)

class UserCourse(db.Model):
    __tablename__ = "UserCourse"
    __table_arges__ = {'sqlite_autoincrement': True}
    user_course_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey(Course.course_id), nullable=False)
    role_id = db.Column(db.Integer, ForeignKey(Role.role_id), nullable=False)

class Team(db.Model):
    __tablename__ = "Team"
    __table_args__ = {'sqlite_autoincrement': True}
    team_id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(25), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey(Course.course_id), nullable=False)
    observer_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey(Course.course_id), nullable=False)
    date_created = db.Column(db.Date, nullable=False)
    active_until = db.Column(db.Date, nullable=True)

class TeamUser(db.Model):
    __tablename__ = "TeamUser"
    __table_args__ = {'sqlite_autoincrement': True}
    team_user_id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, ForeignKey(Team.team_id), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)
    
class AssessmentTask(db.Model):
    __tablename__ = "AssessmentTask"
    __table_args__ = {'sqlite_autoincrement' : True}
    assessment_task_id = db.Column(db.Integer, primary_key=True)
    assessment_task_name = db.Column(db.String(100))
    course_id = db.Column(db.Integer, ForeignKey(Course.course_id))
    rubric_id = db.Column(db.Integer, ForeignKey(Rubric.rubric_id)) # how to handle updates and deletes
    role_id = db.Column(db.Integer, ForeignKey(Role.role_id))
    due_date = db.Column(db.Date, nullable=False)
    time_zone = db.Column(db.String(3), nullable=False)
    show_suggestions = db.Column(db.Boolean, nullable=False)
    show_ratings = db.Column(db.Boolean, nullable=False)
    unit_of_assessment = db.Column(db.Boolean, nullable=False) # true if team, false if individuals
    comment = db.Column(db.String(3000), nullable=True) 
    create_team_password = db.Column(db.String(25), nullable=True)

class CompletedAssessment(db.Model):
    __tablename__ = "CompletedAssessment"
    __table_args__ = {'sqlite_autoincrement': True}
    completed_assessment_id = db.Column(db.Integer, primary_key=True)
    assessment_task_id = db.Column(db.Integer, ForeignKey(AssessmentTask.assessment_task_id))
    team_id = db.Column(db.Integer, ForeignKey(Team.team_id), nullable=True)
    user_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=True)
    initial_time = db.Column(db.Date, nullable=False)
    last_update = db.Column(db.Date, nullable=True)
    rating_observable_characteristics_suggestions_data = db.Column(db.JSON, nullable=True)
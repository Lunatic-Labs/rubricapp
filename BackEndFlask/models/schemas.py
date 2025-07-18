from core import db
from sqlalchemy import ForeignKey, func, DateTime, Interval, Index
from datetime import datetime

# TODO: Determine whether rating in Completed_Assessment is a sum of all the ratings or a JSON object of all ratings.

"""
    Role(role_id, role_name)
    User(user_id, first_name, last_name, email, password, lms_id, consent, owner_id, has_set_password, reset_code, is_admin)
    Rubric(rubric_id, rubric_name, rubric_description, owner)
    Category(category_id, category_name)
    RubricCategory(rubric_category_id, rubric_id, category_id)
    ObservableCharacteristics(observable_characteristics_id, category_id, observable_characteristics_text)
    SuggestionsForImprovement(suggestion_id, category_id, suggestion_text)
    Course(course_id, course_number, course_name, year, term, active, admin_id, use_tas, use_fixed_teams)
    UserCourse(user_course_id, user_id, course_id, role_id)
    Team(team_id, team_name, course_id, observer_id, date_created, active_until)
    TeamUser(team_user_id, team_id, user_id)
    AssessmentTask(assessment_task_id, assessment_task_name, course_id, rubric_id, role_id, due_date, time_zone, show_suggestions, show_ratings, unit_of_assessment, comment, number_of_teams)
    Checkin(checkin_id, assessment_task_id, team_number, user_id, time)
    CompletedAssessment(completed_assessment_id, assessment_task_id, by_role, team_id, user_id, initial_time, last_update, rating_observable_characteristics_suggestions_data)
    Feedback(feedback_id, user_id, completed_assessment_id, feedback_time, lag_time)
    Blacklist(id, token)
"""

class Role(db.Model):
    __tablename__ = "Role"
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.Text, nullable=False)

class User(db.Model):
    __tablename__ = "User"
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(254), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    lms_id = db.Column(db.Integer, nullable=True)
    consent = db.Column(db.Boolean, nullable=True)
    owner_id = db.Column(db.Integer, ForeignKey("User.user_id"), nullable=True)
    has_set_password = db.Column(db.Boolean, nullable=False)
    reset_code = db.Column(db.Text, nullable=True)
    is_admin = db.Column(db.Boolean, nullable=False)
    last_update = db.Column(DateTime(timezone=True), nullable=True)
    team = db.relationship('TeamUser', backref='user', cascade='all, delete')

class Rubric(db.Model):
    __tablename__ = "Rubric"
    __table_args__ = {'sqlite_autoincrement': True}
    rubric_id = db.Column(db.Integer, primary_key=True)
    rubric_name = db.Column(db.String(100))
    rubric_description = db.Column(db.Text, nullable=True)
    owner = db.Column(db.Integer, ForeignKey(User.user_id), nullable=True)

class Category(db.Model):
    __tablename__ = "Category"
    __table_args__ = {'sqlite_autoincrement': True}
    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.Text, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    rating_json = db.Column(db.JSON, nullable=False)

class RubricCategory(db.Model):
    __tablename__ = "RubricCategories"
    __table_args__ = {'sqlite_autoincrement': True}
    rubric_category_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey(Rubric.rubric_id), nullable=False)
    category_id = db.Column(db.Integer, ForeignKey(Category.category_id), nullable=False)

class ObservableCharacteristic(db.Model):
    __tablename__ = "ObservableCharacteristic"
    __table_args__ = {'sqlite_autoincrement': True}
    observable_characteristics_id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, ForeignKey(Category.category_id), nullable=False)
    observable_characteristic_text = db.Column(db.String(10000), nullable=False)

class SuggestionsForImprovement(db.Model):
    __tablename__ = "SuggestionsForImprovement"
    __table_args__ = {'sqlite_autoincrement': True}
    suggestion_id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, ForeignKey(Category.category_id), nullable=False)
    suggestion_text = db.Column(db.JSON, nullable=False)

class Course(db.Model):
    __tablename__ = "Course"
    course_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_number = db.Column(db.Text, nullable=False)
    course_name = db.Column(db.Text, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    term = db.Column(db.Text, nullable=False)
    active = db.Column(db.Boolean, nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey(User.user_id, ondelete='RESTRICT'), nullable=False)
    use_tas = db.Column(db.Boolean, nullable=False)
    use_fixed_teams = db.Column(db.Boolean, nullable=False)

class UserCourse(db.Model):
    __tablename__ = "UserCourse"
    __table_args__ = {'sqlite_autoincrement': True}
    user_course_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey(User.user_id,ondelete='CASCADE'), nullable=False)
    course_id = db.Column(db.Integer, ForeignKey(Course.course_id), nullable=False)
    active = db.Column(db.Boolean)
    role_id = db.Column(db.Integer, ForeignKey(Role.role_id), nullable=False)
    #Indexes
    __table_args__ = (
        Index('idx_active', 'active'),
    )

class Team(db.Model): # keeps track of default teams for a fixed team scenario
    __tablename__ = "Team"
    team_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    team_name = db.Column(db.Text, nullable=False)
    course_id = db.Column(db.Integer, ForeignKey(Course.course_id), nullable=False)
    observer_id = db.Column(db.Integer, ForeignKey(User.user_id, ondelete='RESTRICT'), nullable=False)
    date_created = db.Column(db.Date, nullable=False)
    active_until = db.Column(db.Date, nullable=True)

class TeamUser(db.Model):
    __tablename__ = "TeamUser"
    team_user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    team_id = db.Column(db.Integer, ForeignKey(Team.team_id), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)

class AssessmentTask(db.Model):
    __tablename__ = "AssessmentTask"
    assessment_task_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    assessment_task_name = db.Column(db.Text)
    course_id = db.Column(db.Integer, ForeignKey(Course.course_id))
    rubric_id = db.Column(db.Integer, ForeignKey(Rubric.rubric_id)) # how to handle updates and deletes
    role_id = db.Column(db.Integer, ForeignKey(Role.role_id))
    due_date = db.Column(db.DateTime, nullable=False)
    time_zone = db.Column(db.Text, nullable=False)
    show_suggestions = db.Column(db.Boolean, nullable=False)
    show_ratings = db.Column(db.Boolean, nullable=False)
    unit_of_assessment = db.Column(db.Boolean, nullable=False) # true if team, false if individuals
    comment = db.Column(db.Text, nullable=True)
    create_team_password = db.Column(db.Text, nullable=True)
    number_of_teams = db.Column(db.Integer, nullable=True)
    max_team_size = db.Column(db.Integer, nullable=True)
    notification_sent = db.Column(DateTime(timezone=True), nullable=True)
    locked = db.Column(db.Boolean, nullable=False)
    published = db.Column(db.Boolean, nullable=False)
    #Indexes
    __table_args__ = (
        Index('idx_team_due_date', 'course_id', 'due_date'),
    )

class Checkin(db.Model): # keeps students checking to take a specific AT
    __tablename__ = "Checkin"
    checkin_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    assessment_task_id = db.Column(db.Integer, ForeignKey(AssessmentTask.assessment_task_id), nullable=False)
    # not a foreign key because in the scenario without fixed teams, there will not be default team entries
    # to reference. if they are default teams, team_number will equal the team_id of the corresponding team
    team_number = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)
    time = db.Column(db.DateTime)
    # Indexes
    __table_args__ = (
        Index('idx_time', 'time'),
    )

class CompletedAssessment(db.Model):
    __tablename__ = "CompletedAssessment"
    completed_assessment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    assessment_task_id = db.Column(db.Integer, ForeignKey(AssessmentTask.assessment_task_id))
    completed_by = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)
    team_id = db.Column(db.Integer, ForeignKey(Team.team_id), nullable=True)
    user_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=True)
    initial_time = db.Column(db.DateTime(timezone=True), nullable=False)
    last_update = db.Column(db.DateTime(timezone=True), nullable=True)
    rating_observable_characteristics_suggestions_data = db.Column(db.JSON, nullable=True)
    done = db.Column(db.Boolean, nullable=False)
    locked = db.Column(db.Boolean, nullable=False)

class Feedback(db.Model):
    __tablename__ = "Feedback"
    feedback_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, ForeignKey(User.user_id), nullable=False)
    team_id = db.Column(db.Integer, ForeignKey(Team.team_id), nullable=False)
    completed_assessment_id = db.Column(db.Integer, ForeignKey(CompletedAssessment.completed_assessment_id), nullable=False)
    feedback_time = db.Column(DateTime(timezone=True), nullable=True) # time the student viewed their feedback

class EmailValidation(db.Model):
    __tablename__ = "EmailValidation"

    email_validation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, ForeignKey(User.user_id, ondelete="CASCADE"), nullable=False)
    email = db.Column(db.String(254), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    validation_time = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    validation_error = db.Column(db.String(500), nullable=True)

    user = db.relationship('User', backref=db.backref('email_validations', lazy=True, passive_deletes=True))

    def __repr__(self):
        return f"<EmailValidation {self.email} - {self.status}>"

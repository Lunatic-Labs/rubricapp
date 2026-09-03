from core import db
from sqlalchemy import (
    Boolean,
    Date,
    ForeignKey,
    func,
    DateTime,
    Integer,
    Interval,
    Index,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, datetime, timezone
from typing import Any, List, Optional

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
    Team(team_id, team_name, course_id, assessment_task_id, observer_id, date_created, active_until)
    TeamUser(team_user_id, team_id, user_id)
    AssessmentTask(assessment_task_id, assessment_task_name, course_id, rubric_id, role_id, due_date, time_zone, show_suggestions, show_ratings, unit_of_assessment, comment, number_of_teams)
    Checkin(checkin_id, assessment_task_id, team_number, user_id, time)
    CompletedAssessment(completed_assessment_id, assessment_task_id, by_role, team_id, user_id, initial_time, last_update, rating_observable_characteristics_suggestions_data)
    Feedback(feedback_id, user_id, completed_assessment_id, feedback_time, lag_time)
    Blacklist(id, token)
"""

class Role(db.Model):
    __tablename__ = "Role"
    role_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    role_name: Mapped[str] = mapped_column(String(20), nullable=False)

"""
    The code for User has been changed to pair the character limit in the database with the character limit in the front-end UI's
    currently the code
"""
class User(db.Model):
    __tablename__ = "User"
    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)   # first_name has been changed from 'text to 'string', and now has a 50 character limit
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)    # last_name has been changed from 'text to 'string', and now has a 50 character limit
    email: Mapped[str] = mapped_column(String(254), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(256), nullable=False)           # password has been changed from 'text to 'string', and now has a 256 character limit.
    lms_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    consent: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    owner_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("User.user_id"), nullable=True)
    has_set_password: Mapped[bool] = mapped_column(Boolean, nullable=False)
    reset_code: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)          # reset_code has been changed from 'text to 'string', and now has a 256 character limit.
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False)
    last_update: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    user_dark_mode: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    team: Mapped[List["TeamUser"]] = relationship('TeamUser', backref='user', cascade='all, delete')

class Rubric(db.Model):
    __tablename__ = "Rubric"
    __table_args__ = {'sqlite_autoincrement': True}
    rubric_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    rubric_name: Mapped[Optional[str]] = mapped_column(String(100))
    rubric_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    owner: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(User.user_id), nullable=True)

class Category(db.Model):
    __tablename__ = "Category"
    __table_args__ = {'sqlite_autoincrement': True}
    category_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_name: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    rating_json: Mapped[Any] = mapped_column(JSON, nullable=False)

class RubricCategory(db.Model):
    __tablename__ = "RubricCategories"
    __table_args__ = {'sqlite_autoincrement': True}
    rubric_category_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    rubric_id: Mapped[int] = mapped_column(Integer, ForeignKey(Rubric.rubric_id), nullable=False)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey(Category.category_id), nullable=False)

class ObservableCharacteristic(db.Model):
    __tablename__ = "ObservableCharacteristic"
    __table_args__ = {'sqlite_autoincrement': True}
    observable_characteristics_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey(Category.category_id), nullable=False)
    observable_characteristic_text: Mapped[str] = mapped_column(String(10000), nullable=False)

class SuggestionsForImprovement(db.Model):
    __tablename__ = "SuggestionsForImprovement"
    __table_args__ = {'sqlite_autoincrement': True}
    suggestion_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey(Category.category_id), nullable=False)
    suggestion_text: Mapped[Any] = mapped_column(JSON, nullable=False)

class Course(db.Model):
    __tablename__ = "Course"
    course_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_number: Mapped[str] = mapped_column(String(20), nullable=False)
    course_name: Mapped[str] = mapped_column(String(50), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    term: Mapped[str] = mapped_column(String(20), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False)
    admin_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.user_id, ondelete='RESTRICT'), nullable=False)
    use_tas: Mapped[bool] = mapped_column(Boolean, nullable=False)
    use_fixed_teams: Mapped[bool] = mapped_column(Boolean, nullable=False)
    time_zone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

class UserCourse(db.Model):
    __tablename__ = "UserCourse"
    __table_args__ = {'sqlite_autoincrement': True}
    user_course_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.user_id,ondelete='CASCADE'), nullable=False)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey(Course.course_id), nullable=False)
    active: Mapped[Optional[bool]] = mapped_column(Boolean)
    role_id: Mapped[int] = mapped_column(Integer, ForeignKey(Role.role_id), nullable=False)
    #Indexes
    __table_args__ = (
        Index('idx_active', 'active'),
    )

class AssessmentTask(db.Model):
    __tablename__ = "AssessmentTask"
    assessment_task_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    assessment_task_name: Mapped[str] = mapped_column(String(50), nullable=False)
    course_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(Course.course_id))
    rubric_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(Rubric.rubric_id)) # how to handle updates and deletes
    role_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(Role.role_id))
    due_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    time_zone: Mapped[str] = mapped_column(String(50), nullable=False)
    show_suggestions: Mapped[bool] = mapped_column(Boolean, nullable=False)
    show_ratings: Mapped[bool] = mapped_column(Boolean, nullable=False)
    unit_of_assessment: Mapped[bool] = mapped_column(Boolean, nullable=False) # true if team, false if individuals
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    create_team_password: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    number_of_teams: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    max_team_size: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    notification_sent: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    locked: Mapped[bool] = mapped_column(Boolean, nullable=False)
    published: Mapped[bool] = mapped_column(Boolean, nullable=False)
    #Indexes
    __table_args__ = (
        Index('idx_team_due_date', 'course_id', 'due_date'),
    )

class Team(db.Model): # keeps track of default teams for a fixed team scenario
    __tablename__ = "Team"
    team_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    team_name: Mapped[str] = mapped_column(String(50), nullable=False)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey(Course.course_id), nullable=False)
    assessment_task_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(AssessmentTask.assessment_task_id), nullable=True)
    observer_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.user_id, ondelete='RESTRICT'), nullable=False)
    date_created: Mapped[date] = mapped_column(Date, nullable=False)
    active_until: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    team_users: Mapped[List["TeamUser"]] = relationship('TeamUser', back_populates='team', cascade='all, delete-orphan')

class TeamUser(db.Model):
    __tablename__ = "TeamUser"
    team_user_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    team_id: Mapped[int] = mapped_column(Integer, ForeignKey('Team.team_id', ondelete = 'CASCADE'), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.user_id), nullable=False)
    team: Mapped["Team"] = relationship('Team', back_populates='team_users')

class Checkin(db.Model): # keeps students checking to take a specific AT
    __tablename__ = "Checkin"
    checkin_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    assessment_task_id: Mapped[int] = mapped_column(Integer, ForeignKey(AssessmentTask.assessment_task_id), nullable=False)
    # not a foreign key because in the scenario without fixed teams, there will not be default team entries
    # to reference. if they are default teams, team_number will equal the team_id of the corresponding team
    team_number: Mapped[int] = mapped_column(Integer, nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.user_id), nullable=False)
    time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    # Indexes
    __table_args__ = (
        Index('idx_time', 'time'),
    )

class CompletedAssessment(db.Model):
    __tablename__ = "CompletedAssessment"
    completed_assessment_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    assessment_task_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(AssessmentTask.assessment_task_id))
    completed_by: Mapped[int] = mapped_column(Integer, ForeignKey(User.user_id), nullable=False)
    team_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(Team.team_id), nullable=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(User.user_id), nullable=True)
    initial_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    last_update: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    rating_observable_characteristics_suggestions_data: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    done: Mapped[bool] = mapped_column(Boolean, nullable=False)
    locked: Mapped[bool] = mapped_column(Boolean, nullable=False)

class Feedback(db.Model):
    __tablename__ = "Feedback"
    feedback_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(User.user_id), nullable=True)
    team_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey(Team.team_id), nullable=True)
    completed_assessment_id: Mapped[int] = mapped_column(Integer, ForeignKey(CompletedAssessment.completed_assessment_id), nullable=False)
    feedback_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True) # time the student viewed their feedback

class EmailValidation(db.Model):
    __tablename__ = "EmailValidation"

    email_validation_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.user_id, ondelete="CASCADE"), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    validation_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    validation_error: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    user: Mapped["User"] = relationship('User', backref=db.backref('email_validations', lazy=True, passive_deletes=True))

    def __repr__(self):
        return f"<EmailValidation {self.email} - {self.status}>"

class AdminNotification(db.Model):
    __tablename__ = "AdminNotification"

    admin_notification_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sender_id: Mapped[int] = mapped_column(Integer, ForeignKey(User.user_id), nullable=False)
    thread_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('AdminNotification.admin_notification_id'), nullable=True)
    subject: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<AdminNotification {self.subject} - {self.sent_at}>"

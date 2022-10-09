from core import app
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap

bootstrap = Bootstrap(app)
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# tables in database; each class match to a table in database
#   *size of username, project_id, owner, project_name should be consistent in different tables.
#   *password is encrypted


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # use username or email to login
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    #role in university; ex. instructor or ta
    role = db.Column(db.String(20), nullable=True)
    University = db.Column(db.String(255), nullable=True)
    # self introduction
    description = db.Column(db.String(255), nullable=True)


class Permission(UserMixin, db.Model):
    # project_id is made up with projectname, owner, shareto
    project_id = db.Column(db.String(255), primary_key=True)
    owner = db.Column(db.String(30), nullable=False)
    shareTo = db.Column(db.String(30), nullable=False)
    # project is project name
    project = db.Column(db.String(150), nullable=False)
    status = db.Column(db.String(50), nullable=False)


class Project(UserMixin, db.Model):
    project_name = db.Column(db.String(150), primary_key=True)
    owner = db.Column(db.String(30), primary_key=True)
    project_status = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255), nullable=True)


class Evaluation(UserMixin, db.Model):
    # sharer of project can also create evaluation (or not allowed); still undecided
    eva_name = db.Column(db.String(150), primary_key=True)
    project_name = db.Column(db.String(150), primary_key=True)
    project_owner = db.Column(db.String(30), primary_key=True)
    owner = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    last_edit = db.Column(db.String(30), nullable=True)


# not using this table right now
# designed to send messages among users
class Notification(UserMixin, db.Model):
    notification_id = db.Column(db.Integer, primary_key=True)
    from_user = db.Column(db.String(30), nullable=False)
    to_user = db.Column(db.String(50), nullable=False)
    message_type = db.Column(db.String(50), nullable=False)
    message_content = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    appendix = db.Column(db.String(255), nullable=True)


# besides uploading rubric, we also offer default rubric
class DefaultRubric(UserMixin, db.Model):
    json_name = db.Column(db.String(150), primary_key=True)
    json_description = db.Column(db.String(500), nullable=True)
    json_owner = db.Column(db.String(30), nullable=True)


# sending emails usually takes a long time; this table record information of the process of email sending
class EmailSendingRecord(UserMixin, db.Model):
    project_name = db.Column(db.String(150), primary_key=True)
    project_owner = db.Column(db.String(30), primary_key=True)
    eva_name = db.Column(db.String(150), primary_key=True)
    num_of_tasks = db.Column(db.Integer, nullable=True)
    num_of_finished_tasks = db.Column(db.Integer, nullable=True)

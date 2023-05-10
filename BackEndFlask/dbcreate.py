from core import app, db
from models.rubric import Rubric 
from models.user_course import UserCourse
from models.course import Course
from models.role import Role
from models.team import Team
from models.team_user import TeamUser
from models.category import Category
from models.suggestions import SuggestionsForImprovement
from models.completed_rubric import Completed_Rubric
from models.assessment_task import AssessmentTask
from models.oc import ObservableCharacteristics
import sqlalchemy

with app.app_context():
    #engine = sqlalchemy.create_engine('sqlite:///instance/account.db')
    #_SessionFactory = sessionmaker(bind=engine)
    #Base = declarative_base()
    #Base = declarative_base()
    #Base.metadata.create_all(bind=engine)
    db.create_all()
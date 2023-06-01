from core import app, db
from models.schemas import *
from models.user import *
from models.course import get_courses, load_SuperAdminCourse
from models.user_course import get_user_courses, load_SuperAdminUserCourseTAInstructor, load_SuperAdminUserCourseStudent
from models.rubric import get_rubrics
from models.category import get_categories
from models.ratings import get_ratings
from models.observable_characteristics import get_observable_characteristics
from models.suggestions import get_suggestions
from models.loadExistingRubrics import *
from models.role import get_roles, load_existing_roles
from models.assessment_task import get_assessment_tasks, load_SuperAdminAssessmentTask
from models.team import get_teams, load_SuperAdminTeam
from models.team_course import get_team_courses, load_SuperAdminTeamCourse
from models.team_user import get_team_users, load_SuperAdminTeamUser
from models.completed_assessment import get_completed_assessments, load_SuperAdminCompletedAssessment
import time
import os

sleepTime = 0.5

print("[dbcreate] starting...")
time.sleep(sleepTime)

with app.app_context():
    print("[dbcreate] attempting to create new db...")
    time.sleep(sleepTime)
    try:
        db.create_all()
    except Exception as e:
        print(f"[dbcreate] an error ({e}) occured with db.create_all()")
        print("[dbcreate] exiting...")
        os.abort()
    print("[dbcreate] successfully created new db")
    time.sleep(sleepTime)
    if(get_rubrics().__len__()==0):
        print("[dbcreate] attempting to load existing rubrics...")
        time.sleep(sleepTime)
        load_existing_rubrics()
        print("[dbcreate] successfully loaded existing rubrics...")
        time.sleep(sleepTime)
    if(get_categories().__len__()==0):
        print("[dbcreate] attempting to load exisiting categories...")
        time.sleep(sleepTime)
        load_existing_categories()
        print("[dbcreate] successfully loaded exisiting categories...")
        time.sleep(sleepTime)
    if(get_ratings().__len__()==0):
        print("[dbcreate] attempting to load existing ratings...")
        time.sleep(sleepTime)
        load_existing_ratings()
        print("[dbcreate] successfully loaded existing ratings")
    if(get_observable_characteristics().__len__()==0):
        print("[dbcreate] attempting to load exisiting observable characteristics...")
        time.sleep(sleepTime)
        load_existing_observable_characteristics()
        print("[dbcreate] successfully loaded existing observable characteristics")
        time.sleep(sleepTime)
    if(get_suggestions().__len__()==0):
        print("[dbcreate] attempting to load exisiting suggestions...")
        time.sleep(sleepTime)
        load_existing_suggestions()
        print("[dbcreate] successfully loaded existing suggestions")
    if(get_roles().__len__()==0):
        print("[dbcreate] attempting to load existing roles...")
        time.sleep(sleepTime)
        load_existing_roles()
        print("[dbcreate] successfully loaded existing roles")
        time.sleep(sleepTime)
    if(get_users().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminUser...")
        time.sleep(sleepTime)
        load_SuperAdminUser()
        print("[dbcreate] successfully loaded SuperAdminUser")
        time.sleep(sleepTime)
        print("[dbcreate] attempting to load SuperAdminTA/Instructor...")
        time.sleep(sleepTime)
        load_SuperAdminTAInstructor()
        print("[dbcreate] successfully loaded SuperAdminTA/Instructor")
        time.sleep(sleepTime)
        print("[dbcreate] attempting to load SuperAdminStudent...")
        time.sleep(sleepTime)
        load_SuperAdminStudent()
        print("[dbcreate] successfully loaded SuperAdminStudent")
        time.sleep(sleepTime)
    if(get_courses().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminCourse...")
        time.sleep(sleepTime)
        load_SuperAdminCourse()
        print("[dbcreate] successfully loaded SuperAdminCourse")
        time.sleep(sleepTime)
    if(get_user_courses().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminUserCourseTA/Instructor...")
        time.sleep(sleepTime)
        load_SuperAdminUserCourseTAInstructor()
        print("[dbcreate] successfully loaded SuperAdminUserCourseTA/Instructor")
        time.sleep(sleepTime)
        print("[dbcreate] attempting to load SuperAdminUserCourseStudent...")
        time.sleep(sleepTime)
        load_SuperAdminUserCourseStudent()
        print("[dbcreate] successfully loaded SuperAdminUserCourseStudent")
        time.sleep(sleepTime)
    if(get_assessment_tasks().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminAssessmentTask...")
        time.sleep(sleepTime)
        load_SuperAdminAssessmentTask()
        print("[dbcreate] successfully loaded SuperAdminAssessmentTask")
        time.sleep(sleepTime)
    if(get_teams().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminTeam...")
        time.sleep(sleepTime)
        load_SuperAdminTeam()
        print("[dbcreate] successfully loaded SuperAdminTeam")
        time.sleep(sleepTime)
    if(get_team_courses().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminTeamCourse...")
        time.sleep(sleepTime)
        load_SuperAdminTeamCourse()
        print("[dbcreate] successfully loaded SuperAdminTeamCourse")
        time.sleep(sleepTime)
    if(get_team_users().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminTeamUser...")
        time.sleep(sleepTime)
        load_SuperAdminTeamUser()
        print("[dbcreate] successfully loaded SuperAdminTeamUser")
        time.sleep(sleepTime)
    if(get_completed_assessments().__len__()==0):
        print("[dbcreate] attempting to load SuperAdminCompletedAssessment...")
        time.sleep(sleepTime)
        load_SuperAdminCompletedAssessment()
        print("[dbcreate] successfully loaded SuperAdminCompletedAssessment")
        time.sleep(sleepTime)
    print("[dbcreate] exiting...")
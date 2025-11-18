from Tests.PopulationFunctions import create_users
from models.completed_assessment import create_completed_assessment
from datetime import datetime, timezone
from models.rubric import create_rubric
from models.category import create_category
from models.suggestions import create_suggestion
from models.observable_characteristics import create_observable_characteristic
from models.team import create_team
from models.feedback import create_feedback
from models.ratings_numbers import *
from models.team_user import create_team_user


def sample_completed_assessment(
        user_id, 
        task_id, 
        team_id=None, 
        rating=None, 
        c_by=None
    ):
    if rating is None:
        rating = completely["5"]
    if c_by is None:
        c_by = user_id
    data = {
        "assessment_task_id": task_id,
        "completed_by": c_by,
        "team_id": team_id,
        "user_id": user_id,
        "initial_time": None,
        "last_update": None,
        "rating_observable_characteristics_suggestions_data": rating,
        "done": True
    }
    return data

def build_sample_task_payload(course_id, rubric_id, role_id=5, task_name=None):
    if task_name is None:
        task_name = "Integration Test Assessment"
    payload = {
        "assessment_task_name": task_name,
        "course_id": course_id,
        "rubric_id": rubric_id,
        "role_id": role_id,
        "due_date": "2026-01-01T12:00:00", 
        "time_zone": "EST",
        "show_suggestions": True,
        "show_ratings": True,
        "unit_of_assessment": False,
        "create_team_password": "pw123",
        "comment": "Test comment",
        "number_of_teams": 3,
        "max_team_size": 4,
        "locked": False,
        "published": False,
    }
    return payload

def sample_rubric(owner_id, rbric_name="Integration Test Rubric"):
    rubric_payload = {
        "rubric_name": rbric_name,
        "rubric_description": "A rubric for integration testing.",
        "owner": owner_id,  # owner_id is user_id
    }
    return create_rubric(rubric_payload)

def sample_category(cat_name="Critical Thinking", desc=None, rating=completely):
    if desc is None:
        desc = "Evaluate analytical skills"
    category_data = {
        "name": cat_name,
        "description": desc,
        "rating_json": rating
    }
    category = create_category(category_data)
    return category

def sample_suggestion(category_id, suggestion_text):
    """Helper to create a sample suggestion payload."""
    suggestion_data = (category_id, suggestion_text)
    suggestion = create_suggestion(suggestion_data)
    return suggestion

def sample_observable_characteristic(category_id):
    """Helper to create a sample observable characteristic."""
    data = (category_id, "Demonstrates clear reasoning and evidence")
    obs = create_observable_characteristic(data)
    return obs

def sample_team(team_name, observer_id, course_id, assessment_task_id=None):
    """Helper to create a sample team."""
    team_data = {
        "team_name": team_name,
        "observer_id": observer_id,
        "date_created": datetime.now().strftime('%m/%d/%Y'),
        "course_id": course_id,
        "assessment_task_id": assessment_task_id
    }
    team = create_team(team_data)
    return team

def sample_checkin(assessment_task_id, user_id, team_number=1):
    return {
        "assessment_task_id": assessment_task_id,
        "team_number": team_number,
        "user_id": user_id
    }

def sample_user(email="john.doe@example.com",role_id=5, owner_id=1):
    return {
        "first_name": "John",
        "last_name": "Doe",
        "email": email,
        "password": "password123",    
        "lms_id": None,
        "consent": True,
        "owner_id": owner_id,
        "role_id": role_id,           
    }

def sample_user_course(user_id, course_id, role_id=5):
    return {"user_id": user_id, "course_id": course_id, "role_id": role_id}

def sample_course(teacher_user_id, course_number="CRS001", use_tas=False):
    return ({
        "course_number": course_number,
        "course_name": "Summer Internship",
        "year": 2023,
        "term": "Summer",
        "active": True,
        "admin_id": teacher_user_id,
        "use_tas": use_tas,
        "use_fixed_teams": False
    })

def sample_feedback(completed_assessment_id, user_id, team_id=None):
    feedback_data = {
            "completed_assessment_id": completed_assessment_id,
            "user_id": user_id,
            "team_id": team_id,
            "feedback_time": datetime.now(timezone.utc),
        }
    new_feedback = create_feedback(feedback_data)
    return new_feedback

def sample_team_user(team_id, user_id):
    return create_team_user({"team_id": team_id, "user_id": user_id})

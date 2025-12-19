from core import db
from models.schemas import Checkin
from datetime import datetime, timedelta
from models.utility import error_log

@error_log
def create_checkin(checkin): 
    assessment_task_id = checkin["assessment_task_id"]
    team_number = checkin["team_number"]
    user_id = checkin["user_id"]
    new_checkin = Checkin(assessment_task_id=assessment_task_id, team_number=team_number, user_id=user_id, time=datetime.now())

    db.session.add(new_checkin)
    db.session.commit()

    return new_checkin

@error_log
def already_checked_in(user_id, assessment_task_id):
    checkin = Checkin.query.filter_by(user_id=user_id, assessment_task_id=assessment_task_id).first()

    return checkin is not None

@error_log
def update_checkin(new_checkin):
    checkin = Checkin.query.filter_by(user_id=new_checkin["user_id"], assessment_task_id=new_checkin["assessment_task_id"]).first()

    setattr(checkin, "team_number", new_checkin["team_number"])

    db.session.commit()
    
@error_log
def get_checkins_by_assessment(assessment_task_id):
    checkins = Checkin.query.filter_by(assessment_task_id=assessment_task_id).all()
    
    return checkins

# Generated with ChatGPT
@error_log
def delete_checkins_over_team_count(assessment_task_id, number_of_teams):
    Checkin.query.filter(
        Checkin.assessment_task_id == assessment_task_id,
        Checkin.team_number > number_of_teams
    ).delete()
    
    db.session.commit()

# Generated with ChatGPT
@error_log
def delete_latest_checkins_over_team_size(assessment_task_id, max_team_size):
    # Get all checkins for the assessment task
    checkins = Checkin.query.filter_by(assessment_task_id=assessment_task_id).all()
    
    # Create a dictionary  to count checkins per team member
    team_checkin_count = {}
    
    # Count the number of checkins for each team
    for checkin in checkins:
        if checkin.team_number in team_checkin_count:
            team_checkin_count[checkin.team_number] += 1
        else:
            team_checkin_count[checkin.team_number] = 1
            
    # Loop through each team and remove checkins if they exceed max_team_size
    for team_number, count in team_checkin_count.items():
        while count > max_team_size:
            # Find the latest checkin for this team
            latest_checkin = Checkin.query.filter_by(assessment_task_id=assessment_task_id, team_number=team_number).order_by(Checkin.time.desc()).first()
            
            if latest_checkin:
                db.session.delete(latest_checkin)
                count -= 1
            else:
                break
            
    db.session.commit()

@error_log
def find_latest_team_user_checkin(assessment_task_id:int, team_or_user_id:int, is_team:bool) -> object|None:
    """
    Returns the latest corresponding checkin record if it exists.

    Args:
        assessment_task_id (int): Assessment task id associated to specific checkin(s).
        team_or_user_id (int): Number litteral representing either a team number or user id.
        is_team (bool): True indicates that *team_or_user_id* is a team number and a false flags it as a user id. 

    Returns:
        Returns the full database record or None if it is not found.

    """
    filters = {
        'assessment_task_id':assessment_task_id
    }
    if is_team:
        filters['team_number'] = team_or_user_id
    else:
        filters['user_id'] = team_or_user_id

    return (
        Checkin.query.
        filter_by(**filters).
        order_by(Checkin.time.desc()).
        first()
    )
    
@error_log
def update_checkin_to_server_time(checkin_record:object) -> None:
    """
    Updates the time for a given checkin record.

    Args:
        checkin_record (object): Checkin sqlalchemy record.
    """
    checkin_record.time = datetime.now()
    db.session.commit()

@error_log
def find_checkin_team_number(assessment_task_id:int, user_id:int) -> int:
    """
    Returns an int of the users team_number.

    Args:
        assessment_task_id (int): Specific team_number for a assessment_task.
        user_id (int): Whos team_number we are looking for.
    
    Returns:
        int: Will return a team_number or 0 if nothing.
    """
    result = (Checkin.query.
        with_entities(Checkin.team_number).
        filter(Checkin.assessment_task_id == assessment_task_id, Checkin.user_id == user_id).
        first())
    return result.team_number if result else 0 
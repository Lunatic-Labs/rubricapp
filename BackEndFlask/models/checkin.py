from core import db
from models.schemas import Checkin
from datetime import datetime
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
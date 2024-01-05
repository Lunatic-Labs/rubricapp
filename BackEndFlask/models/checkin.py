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
    return Checkin.query.filter(assessment_task_id==assessment_task_id).all()
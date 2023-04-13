from core import db, UserMixin
from sqlalchemy import ForeignKey, DateTime, func

class Completed_Rubric(UserMixin, db.Model):
    cr_id = db.Column(db.Integer, primary_key=True)
    at_id = db.Column(db.Integer, ForeignKey("at.at_id"))
    by_role = db.Column(db.Integer, ForeignKey("user.user_id"))
    for_role = db.Column(db.Integer, ForeignKey("user.user_id"))
    initial_time = db.Column(db.DateTime(timezone=True), server_default=func.now()) # may need to be updated
    last_update = db.Column(db.DateTime(timezone=True), onupdate=func.now()) # also may need to be updated
    rating = db.Column(db.Integer)
    oc_data = db.String((16)) # this will determine whether or not oc was filled out or not
    sfi_data = db.String((16)) # same as above ^

def get_completed_rubrics():
    try:
        all_completed_rubrics = Completed_Rubric.query.all()
        return all_completed_rubrics
    except:
        return False

def get_completed_rubric(cr_id):
    try:
        one_completed_rubric = Completed_Rubric.query.filter_by(cr_id=cr_id)
        return one_completed_rubric
    except:
        return False
    
# still need to work on id situation
def create_completed_rubric(at_id, by_role, for_role, intial_time, last_update, rating, oc_data, sfi_data):
    try:
        one_completed_rubric = Completed_Rubric(at_id=at_id, by_role=by_role, for_role=for_role, intial_time=intial_time, last_update=last_update, rating=rating, oc_data=oc_data, sfi_data=sfi_data)
        db.session.add(one_completed_rubric)
        db.session.commit()
        return True
    except:
        return False

                                                                    # should initial time be able to be replaced?
def replace_completed_rubric(cr_id, new_at_id, new_by_role, new_for_role, new_initial_time, new_last_update, new_rating, new_oc_data, new_sfi_data):
    try:
        one_completed_rubric = Completed_Rubric.query.filter_by(cr_id=cr_id)
        one_completed_rubric.at_id = new_at_id
        one_completed_rubric.by_role = new_by_role
        one_completed_rubric.for_role = new_for_role
        one_completed_rubric.initial_time = new_initial_time
        one_completed_rubric.last_update = new_last_update
        one_completed_rubric.rating = new_rating
        one_completed_rubric.oc_data = new_oc_data
        one_completed_rubric.sfi_data = new_sfi_data
        db.session.add(one_completed_rubric)
        db.session.commit()
        all_completed_rubrics = Completed_Rubric.query.all()
        return all_completed_rubrics
    except:
        return False

def update_completed_rubric_rating(cr_id, new_rating):
    try:
        one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
        one_completed_rubric.rating = new_rating
        db.session.add(one_completed_rubric)
        db.session.commit()
        all_completed_rubrics = Completed_Rubric.query.all()
        return all_completed_rubrics
    except:
        return False

def update_completed_rubric_oc_data(cr_id, new_oc_data):
    try:
        one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
        one_completed_rubric.oc_data = new_oc_data
        db.session.add(one_completed_rubric)
        db.session.commit()
        all_completed_rubrics = Completed_Rubric.query.all()
        return all_completed_rubrics
    except:
        return False
    
def update_completed_rubric_sfi_data(cr_id, new_sfi_data):
    try:
        one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
        one_completed_rubric.sfi_data = new_sfi_data
        db.session.add(one_completed_rubric)
        db.session.commit()
        all_completed_rubrics = Completed_Rubric.query.all()
        return all_completed_rubrics
    except:
        return False
    
def delete_completed_rubric(cr_id):
    try:
        Completed_Rubric.query.filtery_by(cr_id=cr_id).delete()
        db.session.commit()
        all_completed_rubrics = Completed_Rubric.query.all()
        return all_completed_rubrics
    except:
        return False
    
def detele_all_completed_rubrics():
    try:
        all_completed_rubrics = Completed_Rubric.query.all()
        db.session.delete(all_completed_rubrics)
        db.session.commit()
        all_completed_rubrics = Completed_Rubric.query.all()
        return all_completed_rubrics
    except:
        return False
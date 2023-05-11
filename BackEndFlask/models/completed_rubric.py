from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Completed_Rubric

class InvalidCRID(Exception):
    "Raised when cr_id does not exist!!!"
    pass

def get_completed_rubrics():
    try:
        return Completed_Rubric.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_completed_rubric(cr_id):
    try:
        one_completed_rubric = Completed_Rubric.query.filter_by(cr_id=cr_id)
        if(type(one_completed_rubric) == type(None)):
            raise InvalidCRID
        return one_completed_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCRID:
        error = "Invalid cr_id, cr_id does not exist"
        return error
    

def create_completed_rubric(completed_rubric):
    try:
        new_at_id       = completed_rubric[0]
        new_by_role     = completed_rubric[1]
        new_for_role    = completed_rubric[2]
        new_intial_time = completed_rubric[3]
        new_last_update = completed_rubric[4]
        new_rating      = completed_rubric[5]
        new_oc_data     = completed_rubric[6]
        new_sfi_data    = completed_rubric[7]
        new_completed_rubric = Completed_Rubric(at_id=new_at_id, by_role=new_by_role, for_role=new_for_role, intial_time=new_intial_time, last_update=new_last_update, rating=new_rating, oc_data=new_oc_data, sfi_data=new_sfi_data)
        db.session.add(new_completed_rubric)
        db.session.commit()
        return new_completed_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

                                                                    # should initial time be able to be replaced?
def replace_completed_rubric(completed_rubric, cr_id):
    try:
        one_completed_rubric = Completed_Rubric.query.filter_by(cr_id=cr_id).first()
        if(type(one_completed_rubric) == type(None)):
            raise InvalidCRID
        one_completed_rubric.at_id        = completed_rubric[0]
        one_completed_rubric.by_role      = completed_rubric[1]
        one_completed_rubric.for_role     = completed_rubric[2]
        one_completed_rubric.initial_time = completed_rubric[3]
        one_completed_rubric.last_update  = completed_rubric[4]
        one_completed_rubric.rating       = completed_rubric[5]
        one_completed_rubric.oc_data      = completed_rubric[6]
        one_completed_rubric.sfi_data     = completed_rubric[7]
        db.session.commit()
        return one_completed_rubric
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCRID:
        error = "Invalid cr_id, cr_id does not exist!"
        return error
    
"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_completed_rubric_at_id(cr_id, new_at_id):
#     try:
#         one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
#         one_completed_rubric.at_id = new_at_id
#         db.session.add(one_completed_rubric)
#         db.session.commit()
#         all_completed_rubrics = Completed_Rubric.query.all()
#         return all_completed_rubrics
#     except:
#         return False

# def update_completed_rubric_by_role(cr_id, new_by_role):
#     try:
#         one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
#         one_completed_rubric.by_role = new_by_role
#         db.session.add(one_completed_rubric)
#         db.session.commit()
#         all_completed_rubrics = Completed_Rubric.query.all()
#         return all_completed_rubrics
#     except:
#         return False

# def update_completed_rubric_for_role(cr_id, new_for_role):
#     try:
#         one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
#         one_completed_rubric.for_role = new_for_role
#         db.session.add(one_completed_rubric)
#         db.session.commit()
#         all_completed_rubrics = Completed_Rubric.query.all()
#         return all_completed_rubrics
#     except:
#         return False

# def update_completed_rubric_initial_time(cr_id, new_initial_time):
#     try:
#         one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
#         one_completed_rubric.initial_time = new_initial_time
#         db.session.add(one_completed_rubric)
#         db.session.commit()
#         all_completed_rubrics = Completed_Rubric.query.all()
#         return all_completed_rubrics
#     except:
#         return False

# def update_completed_rubric_last_update(cr_id, new_last_update):
#     try:
#         one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
#         one_completed_rubric.last_update = new_last_update
#         db.session.add(one_completed_rubric)
#         db.session.commit()
#         all_completed_rubrics = Completed_Rubric.query.all()
#         return all_completed_rubrics
#     except:
#         return False

# def update_completed_rubric_rating(cr_id, new_rating):
#     try:
#         one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
#         one_completed_rubric.rating = new_rating
#         db.session.add(one_completed_rubric)
#         db.session.commit()
#         all_completed_rubrics = Completed_Rubric.query.all()
#         return all_completed_rubrics
#     except:
#         return False

# def update_completed_rubric_oc_data(cr_id, new_oc_data):
#     try:
#         one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
#         one_completed_rubric.oc_data = new_oc_data
#         db.session.add(one_completed_rubric)
#         db.session.commit()
#         all_completed_rubrics = Completed_Rubric.query.all()
#         return all_completed_rubrics
#     except:
#         return False
    
# def update_completed_rubric_sfi_data(cr_id, new_sfi_data):
#     try:
#         one_completed_rubric = Completed_Rubric.query.filtery_by(cr_id=cr_id)
#         one_completed_rubric.sfi_data = new_sfi_data
#         db.session.add(one_completed_rubric)
#         db.session.commit()
#         all_completed_rubrics = Completed_Rubric.query.all()
#         return all_completed_rubrics
#     except:
#         return False

"""
Delete is meant for the summer semester!!!
"""
    
# # def delete_completed_rubric(cr_id):
# #     try:
# #         Completed_Rubric.query.filtery_by(cr_id=cr_id).delete()
# #         db.session.commit()
# #         all_completed_rubrics = Completed_Rubric.query.all()
# #         return all_completed_rubrics
# #     except:
# #         return False
    
# # def detele_all_completed_rubrics():
# #     try:
# #         all_completed_rubrics = Completed_Rubric.query.all()
# #         db.session.delete(all_completed_rubrics)
# #         db.session.commit()
# #         all_completed_rubrics = Completed_Rubric.query.all()
# #         return all_completed_rubrics
# #     except:
# #         return False
from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import Completed_Assessment

class InvalidCRID(Exception):
    "Raised when ca_id does not exist!!!"
    pass

def get_completed_assessments():
    try:
        return Completed_Assessment.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_completed_assessment(completed_assessment_id):
    try:
        one_completed_assessment = Completed_Assessment.query.filter_by(completed_assessment_id=completed_assessment_id).first()
        if one_completed_assessment is None:
            raise InvalidCRID
        return one_completed_assessment
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCRID:
        error = "Invalid completed_assessment_id, completed_assessment_id does not exist"
        return error
    

def create_completed_assessment(completed_assessment):
    try:
        new_assessment_task_id              = completed_assessment[0]
        new_by_role                         = completed_assessment[1]
        new_team_or_user                    = completed_assessment[2]
        new_team_id                         = completed_assessment[3]
        new_user_id                         = completed_assessment[4]
        new_initial_time                    = completed_assessment[5]
        new_last_update                     = completed_assessment[6]
        new_rating                          = completed_assessment[7]
        new_observable_characteristics_data = completed_assessment[8]
        new_suggestions_data                = completed_assessment[9]
        new_completed_assessment = Completed_Assessment(
            assessment_task_id=new_assessment_task_id,
            by_role=new_by_role,
            team_or_user=new_team_or_user,
            team_id=new_team_id,
            user_id=new_user_id,
            intial_time=new_initial_time,
            last_update=new_last_update,
            rating=new_rating,
            observable_characteristics_data=new_observable_characteristics_data,
            suggestions_data=new_suggestions_data
        )
        db.session.add(new_completed_assessment)
        db.session.commit()
        return new_completed_assessment
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

# should initial time be able to be replaced?
def replace_completed_assessment(completed_assessment, completed_assessment_id):
    try:
        one_completed_assessment = Completed_Assessment.query.filter_by(completed_assessment_id=completed_assessment_id).first()
        if one_completed_assessment is None:
            raise InvalidCRID
        one_completed_assessment.assessment_task_id                 = completed_assessment[0]
        one_completed_assessment.by_role                            = completed_assessment[1]
        one_completed_assessment.team_or_user                       = completed_assessment[2]
        one_completed_assessment.team_id                            = completed_assessment[3]
        one_completed_assessment.user_id                            = completed_assessment[4]
        one_completed_assessment.initial_time                       = completed_assessment[5]
        one_completed_assessment.last_update                        = completed_assessment[6]
        one_completed_assessment.rating                             = completed_assessment[7]
        one_completed_assessment.observable_characteristics_data    = completed_assessment[8]
        one_completed_assessment.suggestions_data                   = completed_assessment[9]
        db.session.commit()
        return one_completed_assessment
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidCRID:
        error = "Invalid completed_assessment_id, completed_assessment_id does not exist!"
        return error
    
"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_completed_assessment_at_id(cr_id, new_at_id):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.at_id = new_at_id
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_by_role(cr_id, new_by_role):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.by_role = new_by_role
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_for_role(cr_id, new_for_role):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.for_role = new_for_role
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_initial_time(cr_id, new_initial_time):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.initial_time = new_initial_time
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_last_update(cr_id, new_last_update):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.last_update = new_last_update
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_rating(cr_id, new_rating):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.rating = new_rating
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

# def update_completed_assessment_oc_data(cr_id, new_oc_data):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.oc_data = new_oc_data
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False
    
# def update_completed_assessment_sfi_data(cr_id, new_sfi_data):
#     try:
#         one_completed_assessment = Completed_Assessment.query.filtery_by(cr_id=cr_id)
#         one_completed_assessment.sfi_data = new_sfi_data
#         db.session.add(one_completed_assessment)
#         db.session.commit()
#         all_completed_assessments = Completed_Assessment.query.all()
#         return all_completed_assessments
#     except:
#         return False

"""
Delete is meant for the summer semester!!!
"""
    
# # def delete_completed_assessment(cr_id):
# #     try:
# #         Completed_Assessment.query.filtery_by(cr_id=cr_id).delete()
# #         db.session.commit()
# #         all_completed_assessments = Completed_Assessment.query.all()
# #         return all_completed_assessments
# #     except:
# #         return False
    
# # def detele_all_completed_assessments():
# #     try:
# #         all_completed_assessments = Completed_Assessment.query.all()
# #         db.session.delete(all_completed_assessments)
# #         db.session.commit()
# #         all_completed_assessments = Completed_Assessment.query.all()
# #         return all_completed_assessments
# #     except:
# #         return False
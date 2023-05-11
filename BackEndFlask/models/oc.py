from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import ObservableCharacteristics

class InvalidOCID(Exception):
    "Raised when oc_id does not exist!!!"
    pass

def get_OCs():
    try:
        return ObservableCharacteristics.query.all()       
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_OC(oc_id):
    try:
        one_oc = ObservableCharacteristics.query.filter_by(oc_id=oc_id)
        if(type(one_oc) == type(None)):
            raise InvalidOCID
        return one_oc
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidOCID:
        error = "Invalid oc_id, oc_id does not exist!"
        return error
    
def create_OC(observable_characteristic):
    try:
        new_rubric_id   = observable_characteristic[0]
        new_category_id = observable_characteristic[1] 
        new_oc_text     = observable_characteristic[2]
        one_oc = ObservableCharacteristics(rubric_id=new_rubric_id, category_id=new_category_id, oc_text=new_oc_text)
        db.session.add(one_oc)
        db.session.commit()
        return one_oc
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def replace_OC(observable_characteristic, oc_id):
    try:
        one_oc = ObservableCharacteristics.query.filter_by(oc_id=oc_id).first()
        if(type(one_oc) == type(None)):
            raise InvalidOCID
        one_oc.rubric_id   = observable_characteristic[0]
        one_oc.category_id = observable_characteristic[1]
        one_oc.oc_text     = observable_characteristic[2]
        db.session.commit()
        return one_oc
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidOCID:
        error = "Invalid oc_id, oc_id does not exist!"
        return error
    
"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_OC_rubric_id(oc_id, new_rubric_id):
#     try:
#         one_oc = ObservableCharacteristics.query.filter_by(oc_id).first()
#         one_oc.rubric_id = new_rubric_id
#         db.session.add(one_oc)
#         db.session.commit()
#         all_OCs = ObservableCharacteristics.query.all()
#         return all_OCs
#     except:
#         return False
    
# def update_OC_category_id(oc_id, new_category_id):
#     try:
#         one_oc = ObservableCharacteristics.query.filter_by(oc_id).first()
#         one_oc.category_id = new_category_id
#         db.session.add(one_oc)
#         db.session.commit()
#         all_OCs = ObservableCharacteristics.query.all()
#         return all_OCs
#     except:
#         return False
    
# def update_OC_text(oc_id, new_text):
#     try:
#         one_oc = ObservableCharacteristics.query.filter_by(oc_id).first()
#         one_oc.text = new_text
#         db.session.add(one_oc)
#         db.session.commit()
#         all_OCs = ObservableCharacteristics.query.all()
#         return all_OCs
#     except:
#         return False

"""
Delete is meant for the summer semester!!!
"""    

# def delete_OC(oc_id):
#     try:
#         ObservableCharacteristics.query.filtery_by(oc_id).delete()
#         db.session.commit()
#         all_OCs = ObservableCharacteristics.query.all()
#         return all_OCs
#     except:
#         return False
    
# def delete_all_OCs():
#     try:
#         all_OCs = ObservableCharacteristics.query.all()
#         db.session.delete(all_OCs)
#         db.session.commit()
#         all_OCs = ObservableCharacteristics.query.all()
#         return all_OCs
#     except: 
#         return False

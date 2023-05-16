from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import SuggestionsForImprovement

class Invalid_SFI_ID(Exception):
    "Raised when sfi_id does not exist!!!"
    pass

def get_sfis():
    try:
        return SuggestionsForImprovement.query.all()
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_sfi(sfi_id):
    try:
        one_sfi = SuggestionsForImprovement.query.filter_by(sfi_id=sfi_id)
        if(type(one_sfi) == type(None)):
            raise Invalid_SFI_ID
        return one_sfi
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except Invalid_SFI_ID:
        error = "Invalid sfi_id, sfi_id does not exist!"
        return error
    
def get_sfi_per_rubric(rubric_id):
    sfi_per_rubric = SuggestionsForImprovement.query.filter_by(rubric_id=rubric_id)
    return sfi_per_rubric

def create_sfi(sfi):
    try:
        new_rubric_id = sfi[0]
        new_category_id = sfi[1]
        new_sfi_text = sfi[2]
        new_sfi = SuggestionsForImprovement(rubric_id=new_rubric_id, category_id=new_category_id, sfi_text=new_sfi_text)
        db.session.add(new_sfi)
        db.session.commit()
        return new_sfi
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def replace_sfi(sfi, id):
    try:
        one_sfi = SuggestionsForImprovement.query.filter_by(sfi_id=id).first()
        if(type(one_sfi) == type(None)):
            raise Invalid_SFI_ID
        one_sfi.rubric_id = sfi[0]
        one_sfi.category_id = sfi[1]
        one_sfi.text = sfi[2]
        db.session.commit()
        return one_sfi
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except Invalid_SFI_ID:
        error = "Invalid sfi_id, sfi_id does not exist!"
        return error
    
"""
Delete is meant for the summer semester!!!
"""
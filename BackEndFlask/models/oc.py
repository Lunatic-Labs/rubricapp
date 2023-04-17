from core import db, UserMixin
from sqlalchemy import ForeignKey

class ObservableCharacteristics(UserMixin, db.Model):
    __tablename__ = "ObservableCharacteristics"
    oc_id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, ForeignKey("Rubric.rubric_id"), nullable=False)
    category_id = db.Column(db.Integer,ForeignKey("Category.category_id"), nullable=False)
    oc_text = db.Column(db.String(10000), nullable=False)

def get_OCs():
    try:
        all_OCs = ObservableCharacteristics.query.all()
        return all_OCs
    except:
        return False

def get_OC(oc_id):
    try:
        one_oc = ObservableCharacteristics.query.filter_by(oc_id=oc_id)
        return one_oc
    except:
        return False
    
# id thing
def create_OC(rubric_id, category_id, oc_text):
    try:
        one_oc = ObservableCharacteristics(rubric_id=rubric_id, category_id=category_id, oc_text=oc_text)
        db.session.add(one_oc)
        db.session.commit()
        return True
    except:
        return False
    
def replace_OC(oc_id, new_rubric_id, new_category_id, new_oc_text):
    try:
        one_oc = ObservableCharacteristics.query.filter_by(oc_id=oc_id)
        one_oc.rubric_id = new_rubric_id
        one_oc.category_id = new_category_id
        one_oc.oc_text = new_oc_text
        db.session.add(one_oc)
        db.session.commit()
        all_OCs = ObservableCharacteristics.query.all()
        return all_OCs
    except:
        return False
    
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

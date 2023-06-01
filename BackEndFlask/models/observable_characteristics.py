from core import db
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import ObservableCharacteristics

class InvalidObservableCharacteristicID(Exception):
    "Raised when observable_characteristic_id does not exist!!!"
    pass

def get_observable_characteristics():
    try:
        return ObservableCharacteristics.query.all()       
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error

def get_observable_characteristic(observable_characteristic_id):
    try:
        one_observable_characteristic = ObservableCharacteristics.query.filter_by(observable_characteristic_id=observable_characteristic_id).first()
        if one_observable_characteristic is None:
            raise InvalidObservableCharacteristicID
        return one_observable_characteristic
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidObservableCharacteristicID:
        error = "Invalid observable_characteristic_id, observable_characteristic_id does not exist!"
        return error
    
def get_observable_characteristic_per_category(category_id):
    try:
        observable_characteristic_per_category = ObservableCharacteristics.query.filter_by(category_id=category_id)
        return observable_characteristic_per_category
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error 
    
def create_observable_characteristic(observable_characteristic):
    try:
        one_observable_characteristic = ObservableCharacteristics(
            rubric_id=observable_characteristic[0],
            category_id=observable_characteristic[1] ,
            observable_characteristic_text=observable_characteristic[2]
        )
        db.session.add(one_observable_characteristic)
        db.session.commit()
        return one_observable_characteristic
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    
def replace_observable_characteristic(observable_characteristic, observable_characteristic_id):
    try:
        one_observable_characteristic = ObservableCharacteristics.query.filter_by(observable_characteristic_id=observable_characteristic_id).first()
        if one_observable_characteristic is None:
            raise InvalidObservableCharacteristicID
        one_observable_characteristic.rubric_id = observable_characteristic[0]
        one_observable_characteristic.category_id = observable_characteristic[1]
        one_observable_characteristic.observable_characteristic_text = observable_characteristic[2]
        db.session.commit()
        return one_observable_characteristic
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        return error
    except InvalidObservableCharacteristicID:
        error = "Invalid observable_characteristic_id, observable_characteristics_id does not exist!"
        return error
    
"""
All code below has not been updated since user.py was modified on 4/15/2023
"""

# def update_observable_characteristic_rubric_id(observable_characteristics_id, new_rubric_id):
#     try:
#         one_observable_characteristic = ObservableCharacteristics.query.filter_by(observable_characteristics_id).first()
#         one_observable_characteristic.rubric_id = new_rubric_id
#         db.session.add(one_observable_characteristic)
#         db.session.commit()
#         all_observable_characteristics = ObservableCharacteristics.query.all()
#         return all_observable_characteristics
#     except:
#         return False
    
# def update_observable_characteristic_category_id(observable_characteristics_id, new_category_id):
#     try:
#         one_observable_characteristic = ObservableCharacteristics.query.filter_by(observable_characteristics_id).first()
#         one_observable_characteristic.category_id = new_category_id
#         db.session.add(one_observable_characteristic)
#         db.session.commit()
#         all_observable_characteristics = ObservableCharacteristics.query.all()
#         return all_observable_characteristics
#     except:
#         return False
    
# def update_observable_characteristic_text(observable_characteristics_id, new_text):
#     try:
#         one_observable_characteristic = ObservableCharacteristics.query.filter_by(observable_characteristics_id).first()
#         one_observable_characteristic.text = new_text
#         db.session.add(one_observable_characteristic)
#         db.session.commit()
#         all_observable_characteristics = ObservableCharacteristics.query.all()
#         return all_observable_characteristics
#     except:
#         return False

"""
Delete is meant for the summer semester!!!
"""    

# def delete_observable_characteristic(observable_characteristics_id):
#     try:
#         ObservableCharacteristics.query.filtery_by(observable_characteristics_id).delete()
#         db.session.commit()
#         all_observable_characteristics = ObservableCharacteristics.query.all()
#         return all_observable_characteristics
#     except:
#         return False
    
# def delete_all_observable_characteristics():
#     try:
#         all_observable_characteristics = ObservableCharacteristics.query.all()
#         db.session.delete(all_observable_characteristics)
#         db.session.commit()
#         all_observable_characteristics = ObservableCharacteristics.query.all()
#         return all_observable_characteristics
#     except: 
#         return False

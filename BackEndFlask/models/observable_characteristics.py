from core import db
from sqlalchemy import select
from models.schemas import ObservableCharacteristic
from models.utility import error_log

class InvalidObservableCharacteristicID(Exception):
    def __init__(self, id):
        self.message = f"Invalid observable_characteristic_id {id}."

    def __str__(self):
        return self.message


@error_log
def get_observable_characteristics():
    return db.session.scalars(select(ObservableCharacteristic)).all()


@error_log
def get_observable_characteristic(observable_characteristic_id):
    one_observable_characteristic = db.session.scalars(
        select(ObservableCharacteristic).filter_by(observable_characteristics_id=observable_characteristic_id).limit(1)
    ).first()

    if one_observable_characteristic is None:
        raise InvalidObservableCharacteristicID(observable_characteristic_id)

    return one_observable_characteristic


@error_log
def get_observable_characteristic_per_category(category_id):
    observable_characteristic_per_category = db.session.scalars(
        select(ObservableCharacteristic).filter_by(category_id=category_id)
    ).all()

    return observable_characteristic_per_category


@error_log
def create_observable_characteristic(observable_characteristic):
    one_observable_characteristic = ObservableCharacteristic(
        category_id=observable_characteristic[0],
        observable_characteristic_text=observable_characteristic[1]
    )

    db.session.add(one_observable_characteristic)
    db.session.commit()

    return one_observable_characteristic


@error_log
def replace_observable_characteristic(observable_characteristic, observable_characteristic_id):
    one_observable_characteristic = db.session.scalars(
        select(ObservableCharacteristic).filter_by(observable_characteristics_id=observable_characteristic_id).limit(1)
    ).first()

    if one_observable_characteristic is None:
        raise InvalidObservableCharacteristicID(observable_characteristic_id)
    
    one_observable_characteristic.category_id = observable_characteristic[0]
    one_observable_characteristic.observable_characteristic_text = observable_characteristic[1]

    db.session.commit()

    return one_observable_characteristic
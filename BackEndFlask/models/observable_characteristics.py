from core import db
from models.schemas import ObservableCharacteristic
from models.utility import error_log

class InvalidObservableCharacteristicID(Exception):
    def __init__(self, id):
        self.message = f"Invalid observable_characteristic_id {id}."

    def __str__(self):
        return self.message


@error_log
def get_observable_characteristics():
    return ObservableCharacteristic.query.all()


@error_log
def get_observable_characteristic(observable_characteristic_id):
    one_observable_characteristic = ObservableCharacteristic.query.filter_by(observable_characteristic_id=observable_characteristic_id).first()

    if one_observable_characteristic is None:
        raise InvalidObservableCharacteristicID(observable_characteristic_id)
    
    return one_observable_characteristic


@error_log
def get_observable_characteristic_per_category(category_id):
    observable_characteristic_per_category = ObservableCharacteristic.query.filter_by(category_id=category_id)

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
    one_observable_characteristic = ObservableCharacteristic.query.filter_by(observable_characteristic_id=observable_characteristic_id).first()

    if one_observable_characteristic is None:
        raise InvalidObservableCharacteristicID(observable_characteristic_id)
    
    one_observable_characteristic.rubric_id = observable_characteristic[0]
    one_observable_characteristic.category_id = observable_characteristic[1]
    one_observable_characteristic.observable_characteristic_text = observable_characteristic[2]

    db.session.commit()

    return one_observable_characteristic
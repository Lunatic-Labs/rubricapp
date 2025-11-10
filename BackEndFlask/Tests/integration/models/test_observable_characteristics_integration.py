import pytest
from core import db
from models.observable_characteristics import (
    create_observable_characteristic,
    get_observable_characteristics,
    get_observable_characteristic,
    get_observable_characteristic_per_category,
    replace_observable_characteristic,
    InvalidObservableCharacteristicID,
)
from Tests.PopulationFunctions import cleanup_test_users
from models.schemas import ObservableCharacteristic
from models.category import create_category
from models.loadExistingRubrics import load_existing_observable_characteristics
from integration.integration_helpers import sample_category, sample_observable_characteristic


def test_create_and_get_observable_characteristic(flask_app_mock):
    """Verify an observable characteristic can be created and retrieved."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            car = sample_category()
            oc = sample_observable_characteristic(car.category_id)

            fetched = get_observable_characteristic(oc.observable_characteristics_id)
            assert fetched.observable_characteristic_text == "Demonstrates clear reasoning and evidence"
            assert fetched.category_id == 1

        finally:
            db.session.delete(oc)
            db.session.commit()


def test_get_observable_characteristics_returns_all(flask_app_mock):
    """Ensure all observable characteristics are returned."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            load_existing_observable_characteristics()

            all_oc = get_observable_characteristics()
            assert any(o.observable_characteristic_text == "Vocal tone and pacing helped maintain audience interest" for o in all_oc)
            assert any(o.observable_characteristic_text == "Each figure conveyed a clear message" for o in all_oc)
        
        except Exception as e:
            pytest.fail(f"Unexpected exception during test: {e}")


def test_get_observable_characteristic_per_category(flask_app_mock):
    """Ensure observable characteristics are correctly linked to a category."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            car = sample_category()
            oc = sample_observable_characteristic(car.category_id)
            result = get_observable_characteristic_per_category(car.category_id).all()
            assert len(result) == 1
            assert any(o.observable_characteristic_text == "Demonstrates clear reasoning and evidence" for o in result)

        finally:
            db.session.delete(oc)
            db.session.commit()
            db.session.delete(car)
            db.session.commit()


def test_replace_observable_characteristic(flask_app_mock):
    """Verify observable characteristic fields can be updated."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            car = sample_category()
            oc = sample_observable_characteristic(car.category_id)

            updated_data = (
                car.category_id, 
                "Demonstrates advanced analytical reasoning"
            )
            replaced = replace_observable_characteristic(updated_data, oc.observable_characteristics_id)

            assert replaced.category_id == car.category_id
            assert replaced.observable_characteristic_text == "Demonstrates advanced analytical reasoning"

        finally:
            db.session.delete(oc)
            db.session.commit()
            db.session.delete(car)
            db.session.commit()


def test_get_observable_characteristic_invalid_id(flask_app_mock):
    """Ensure get_observable_characteristic raises for invalid ID."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidObservableCharacteristicID):
            get_observable_characteristic(9999)


def test_replace_observable_characteristic_invalid_id(flask_app_mock):
    """Ensure replace_observable_characteristic raises for invalid ID."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        updated_data = (1, 2, "Updated text that should not be saved")
        with pytest.raises(InvalidObservableCharacteristicID):
            replace_observable_characteristic(updated_data, 9999)

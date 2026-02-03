import pytest
from core import db
from models.schemas import Role
from models.role import (
    InvalidRoleID, 
    create_role,
    get_roles,
    get_role,
    replace_role,
    load_existing_roles
)
from Tests.PopulationFunctions import (
    cleanup_test_users,
)

def test_get_roles_returns_all_roles(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        # Clean roles table 
        # load_existing_roles is beibg loaded in conftest.py
        Role.query.delete()
        db.session.commit()

        try:
            # Create sample roles
            r1 = create_role("Admin")
            r2 = create_role("Student")

            roles = get_roles()
            assert len(roles) == 2
            assert {r.role_name for r in roles} == {"Admin", "Student"}
        
        finally:
            try:
                db.session.delete(r1)
                db.session.delete(r2)
                db.session.commit()
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_create_role_persists_to_db(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        # Clean roles table 
        Role.query.delete()
        db.session.commit()

        try:
            new_role = create_role("TA")

            # Check created
            assert new_role.role_id is not None
            assert new_role.role_name == "TA"

            # Verify DB state
            db_role = db.session.get(Role, new_role.role_id)
            assert db_role is not None
            assert db_role.role_name == "TA"
        
        finally:
            # clean up
            try:
                db.session.delete(new_role)
                db.session.commit()
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_role_valid_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        # Clean roles table 
        Role.query.delete()
        db.session.commit()

        try:
            role = create_role("Student")

            fetched = get_role(role.role_id)
            assert fetched.role_id == role.role_id
            assert fetched.role_name == "Student"
        
        finally:
            # Clean up
            try:
                db.session.delete(role)
                db.session.commit()
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_role_invalid_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidRoleID):
            get_role(999)  # nonexistent


def test_replace_role_updates_role_name(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        # Clean roles table 
        Role.query.delete()
        db.session.commit()
        
        try:
            role = create_role("OldName")

            updated = replace_role("NewName", role.role_id)
            assert updated.role_name == "NewName"

            # Validate in DB
            db_role = db.session.get(Role, role.role_id)
            assert db_role.role_name == "NewName"
        
        finally:
            # Clean up
            try:
                db.session.delete(role)
                db.session.commit()
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_replace_role_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidRoleID):
            replace_role("Something", 12345)


def test_load_existing_roles_inserts_all_defaults(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        # Clean roles table 
        Role.query.delete()
        db.session.commit()

        try:
            load_existing_roles()

            roles = get_roles()
            assert len(roles) == 5
            assert [r.role_name for r in roles] == [
                "Researcher",
                "SuperAdmin",
                "Admin",
                "TA/Instructor",
                "Student"
            ]
        finally:
            try:
                Role.query.delete()
                db.session.commit()
            except Exception as e:
                print(f"Cleanup skipped: {e}")

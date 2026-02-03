import pytest
from core import db
from models.schemas import User, UserCourse, CompletedAssessment
from models.user import *
from integration.integration_helpers import *
from Tests.PopulationFunctions import (
    cleanup_test_users,
    create_one_admin_course,
    delete_one_admin_course,
    create_users,
)
from models.user_course import (
    create_user_course,
    delete_user_course,
)
from models.course import create_course, delete_course
from models.assessment_task import (
    create_assessment_task,
    delete_assessment_task,
)
from models.completed_assessment import (
    create_completed_assessment,
    delete_completed_assessment_tasks,
)
from models.rubric import delete_rubric_by_id
from models.queries import is_admin_by_user_id


def test_create_user(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            assert user.user_id is not None
            assert user.email == "john.doe@example.com"
            assert user.first_name == "John"
            assert user.last_name == "Doe"
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_create_user_lowercases_email(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user(email="TEST@TEST.COM"))
            assert user.email == "test@test.com"

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_user_success(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            fetched = get_user(user.user_id)

            assert fetched.user_id == user.user_id
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_user_invalid_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidUserID):
            get_user(999999)


def test_get_user_by_email(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            fetched = get_user_by_email("john.doe@example.com")

            assert fetched.user_id == user.user_id
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_user_already_exists_returns_user(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            data = sample_user()
            user = create_user(data)

            result = user_already_exists(data)
            assert result.user_id == user.user_id
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_user_already_exists_wrong_password_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            data = sample_user()
            user = create_user(data)

            with pytest.raises(EmailAlreadyExists):
                bad_data = sample_user()
                bad_data["password"] = "WRONG"
                user_already_exists(bad_data)

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_password_updates_hash(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            old_hash = user.password
            new_hash = update_password(user.user_id, "newpass123")

            assert new_hash != old_hash

            updated_user = get_user_password(user.user_id)
            assert updated_user == new_hash

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")



def test_make_admin(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            assert user.is_admin is False

            make_admin(user.user_id)

            refreshed = get_user(user.user_id)
            assert refreshed.is_admin is True

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_unmake_admin_success(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            user.is_admin = True
            db.session.commit()
           
            unmake_admin(user.user_id)

            updated = get_user(user.user_id)
            assert updated.is_admin is False

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_unmake_admin_kept_if_in_usercourse_as_admin(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user(role_id=3))
            course = create_course(sample_course(user.user_id))
            uc = create_user_course(sample_user_course(user.user_id, course.course_id, role_id=3))

            unmake_admin(user.user_id)
            still_admin = get_user(user.user_id)

            assert still_admin.is_admin is True  # cannot unmake admin if role_id=3 exists

        finally:
            # Clean up
            try:
                delete_user_course(uc.user_course_id)
                delete_course(course.course_id)
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")



def test_replace_user_updates_all_fields(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            new_data = {
                "first_name": "New",
                "last_name": "Name",
                "email": "new.email@test.edu",
                "password": "newpass",
                "lms_id": 999,
                "consent": False,
                "owner_id": 1,
            }

            updated = replace_user(new_data, user.user_id)

            assert updated.first_name == "New"
            assert updated.last_name == "Name"
            assert updated.email == "new.email@test.edu"
            assert updated.lms_id == 999
            assert updated.consent is False
        
        finally:
            # Clean up
            try:
                delete_user(updated.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_replace_user_invalid_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidUserID):
            replace_user(sample_user(), 99999)


def test_delete_user_success(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            assert delete_user(user.user_id) is True

            assert get_user_by_email("john.doe@test.edu") is None

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_delete_user_with_completed_assessment_fails(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            data = sample_completed_assessment(result["user_id"], task.assessment_task_id, c_by=user[0].user_id)
            comp = create_completed_assessment(data)

            with pytest.raises(ValueError, match="associated tasks"):
                delete_user(user[0].user_id)

        finally:
            # Clean up
            try:
                delete_completed_assessment_tasks(comp.completed_assessment_id)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_user(user[0].user_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_users_by_owner_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            load_demo_admin()
            load_demo_ta_instructor()
            load_demo_student()

            students = get_users_by_owner_id(2)
            assert len(students) == 11
            assert any(s.first_name == "Deborah" for s in students)
            assert any(s.last_name == "Allen" for s in students)

        finally:
            # Clean up
            try:
                User.query.delete()
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_user_consent(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            result = user = get_user_consent(user.user_id)
            assert result is True
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_user_password_raises_invalid_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidUserID):
            get_user_password(888)


def test_get_user_admins(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            load_demo_admin()
            
            result = get_user_admins()
            assert len(result) == 2
            assert any(a.email == "demoadmin02@skillbuilder.edu" for a in result)
            assert any(a.email == "superadminuser01@skillbuilder.edu" for a in result)

        finally:
            # Clean up
            try:
                User.query.delete()
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_get_user_first_name(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            result = get_user_first_name(user.user_id)
            assert result == user.first_name
        
        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_get_user_id_by_first_name(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())

            result = get_user_user_id_by_first_name(user.first_name)
            assert result == user.user_id

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
        
def test_has_changed_password(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            data = sample_user()
            del data["password"]
            user = create_user(data)
            assert user.has_set_password is False

            update_password(user.user_id, "newpass123")
            assert user.has_set_password is False

            has_changed_password(user.user_id, True)
            assert user.has_set_password is True

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_set_reset_code(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            user = create_user(sample_user())
            assert user.reset_code is None

            fake_hash = "abc123hashed"

            set_reset_code(user.user_id, fake_hash)

            updated_user = User.query.filter_by(user_id=user.user_id).first()
            assert updated_user.reset_code == fake_hash

        finally:
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_is_admin_by_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            student = create_user(sample_user())
            assert is_admin_by_user_id(student.user_id) is False

            admin = create_user(sample_user(email="testadmin@example.com", role_id=3))
            assert is_admin_by_user_id(admin.user_id) is True

        finally:
            # Clean up
            try:
                delete_user(admin.user_id)
                delete_user(student.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

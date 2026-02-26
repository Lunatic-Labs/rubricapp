import pytest
from core import db
from models.schemas import Course
from models.course import (
    get_courses,
    get_course,
    get_course_use_tas,
    get_courses_by_admin_id,
    create_course,
    replace_course,
    delete_course,
    InvalidCourseID,
)
from integration.integration_helpers import (
    sample_course,
    sample_user,
)
from Tests.PopulationFunctions import (
    cleanup_test_users,
    create_users,
    delete_users,
)
from models.user import create_user, delete_user
from models.queries import (
    get_role_in_course,
    get_users_by_course_id,
)


def test_create_course(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="testteacher@example.com", role_id=3)
            teacher = create_user(teacher_data)
            payload = sample_course(teacher.user_id)
            
            created = create_course(payload)
            assert created.course_id is not None
            assert created.course_number == payload["course_number"]
            assert created.admin_id == teacher.user_id

            # check persistence
            stored = db.session.get(Course, created.course_id)
            assert stored is not None
            assert stored.course_id == created.course_id
        
        finally:
            # cleanup
            try:
                delete_course(created.course_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_courses_returns_all(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="testteacher@example.com", role_id=3)
            teacher = create_user(teacher_data)
            payload1 = sample_course(teacher.user_id)
            payload2 = sample_course(teacher.user_id, course_number="CRS002")

            # create 2 courses
            created1 = create_course(payload1)
            created2 = create_course(payload2)

            courses = get_courses()

            assert len(courses) == 2
            assert any(c.course_number == "CRS002" for c in courses)
            assert any(c.course_number == created1.course_number for c in courses)
            assert all(c.admin_id == created2.admin_id for c in courses)

        finally:
            # cleanup
            try:
                delete_course(created1.course_id)
                delete_course(created2.course_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_course_returns_single_course(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="testteacher@example.com", role_id=3)
            teacher = create_user(teacher_data)
            payload = sample_course(teacher.user_id)

            created = create_course(payload)

            fetched = get_course(created.course_id)
            assert fetched is not None
            assert fetched.course_id == created.course_id
        
        finally:
            # cleanup
            try:
                delete_course(created.course_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_course_returns_none_if_missing(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(ValueError):
            get_course(99999) 


def test_get_course_use_tas(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="testteacher@example.com", role_id=3)
            teacher = create_user(teacher_data)
            payload = sample_course(teacher.user_id, use_tas=True)

            created = create_course(payload)

            assert get_course_use_tas(created.course_id) is True
            assert get_course_use_tas(99999) is None

        finally:
            # cleanup
            try:
                delete_course(created.course_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")



def test_get_courses_by_admin_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data1 = sample_user(email="testteacher1@example.com", role_id=3)
            teacher1 = create_user(teacher_data1)
            teacher_data2 = sample_user(email="testteacher2@example.com", role_id=3)
            teacher2 = create_user(teacher_data2)
            payload1 = sample_course(teacher1.user_id)
            payload2 = sample_course(teacher1.user_id, course_number="CRS002")
            payload3 = sample_course(teacher2.user_id, course_number="CRS003")

            # create 3 courses
            created1 = create_course(payload1)
            created2 = create_course(payload2)
            created3 = create_course(payload3)

            courses = get_courses_by_admin_id(teacher1.user_id)

            assert len(courses) == 2
            assert {c.course_number for c in courses} == {"CRS001", "CRS002"}

        finally:
            # cleanup
            try:
                delete_course(created1.course_id)
                delete_course(created2.course_id)
                delete_course(created3.course_id)
                delete_user(teacher1.user_id)
                delete_user(teacher2.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_replace_course_updates_values(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data1 = sample_user(email="testteacher1@example.com", role_id=3)
            teacher1 = create_user(teacher_data1)
            payload = sample_course(teacher1.user_id)

            created = create_course(payload)

            teacher_data2 = sample_user(email="testteacher2@example.com", role_id=3)
            teacher2 = create_user(teacher_data2)
            updated_payload = {
                "course_number": "UPDATED101",
                "course_name": "Updated Name",
                "year": 2030,
                "term": "Spring",
                "active": False,
                "admin_id": teacher2.user_id,
                "use_tas": False,
                "use_fixed_teams": True,
            }

            updated = replace_course(updated_payload, created.course_id)

            assert updated.course_number == "UPDATED101"
            assert updated.course_name == "Updated Name"
            assert updated.year == 2030
            assert updated.active is False
            assert updated.admin_id == teacher2.user_id
            assert updated.use_tas is False
            assert updated.use_fixed_teams is True
        
        finally:
            # cleanup
            try:
                delete_course(created.course_id)
                delete_course(updated.course_id)
                delete_user(teacher1.user_id)
                delete_user(teacher2.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_replace_course_raises_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidCourseID):
            replace_course(sample_course(333), 99999)


def test_delete_course_removes_course(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="testteacher@example.com", role_id=3)
            teacher = create_user(teacher_data)
            payload = sample_course(teacher.user_id, use_tas=True)

            created = create_course(payload)

            delete_course(created.course_id)
            assert db.session.get(Course, created.course_id) is None
        
        finally:
            # cleanup
            try:
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_delete_course_raises_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidCourseID):
            delete_course(99999)


def test_get_role_in_course(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="testteacher@example.com", role_id=3)
            teacher = create_user(teacher_data)
            payload = sample_course(teacher.user_id, use_tas=True)

            created = create_course(payload)
            students = create_users(created.course_id, teacher.user_id, number_of_users=3)
            ta = create_users(created.course_id, teacher.user_id, number_of_users=2, role_id=4)

            result1 = get_role_in_course(students[0].user_id, created.course_id)
            assert result1.role_id == 5

            result2 = get_role_in_course(ta[0].user_id, created.course_id)
            assert result2.role_id == 4

        finally:
            # cleanup
            try:
                delete_users(students)
                delete_users(ta)
                delete_course(created.course_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_users_by_course_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="testteacher@example.com", role_id=3)
            teacher = create_user(teacher_data)
            payload = sample_course(teacher.user_id, use_tas=True)

            created = create_course(payload)
            students = create_users(created.course_id, teacher.user_id, number_of_users=3)
            ta = create_users(created.course_id, teacher.user_id, number_of_users=2, role_id=4)

            results = get_users_by_course_id(created.course_id)
            assert all(r.owner_id == teacher.user_id for r in results)
            assert any(r.role_id == 5 for r in results)
            assert any(r.role_id == 4 for r in results)
            assert any(r.user_id == students[1].user_id for r in results)
            assert any(r.user_id == ta[0].user_id for r in results)

        finally:
            # cleanup
            try:
                delete_users(students)
                delete_users(ta)
                delete_course(created.course_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

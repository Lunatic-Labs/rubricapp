import pytest
from core import db
from models.schemas import UserCourse
from models.user_course import *
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
    create_users,
    delete_users,
)
from integration.integration_helpers import (
    sample_user_course, 
    sample_user,
    sample_course
)
from models.user import (
    create_user, 
    delete_user, 
    load_demo_admin, 
    load_demo_ta_instructor,
    load_demo_student
)
from models.course import create_course, delete_course, load_demo_course
from models.queries import (
    get_courses_by_user_courses_by_user_id,
    get_users_by_role_id,
)

def test_create_user_course_creates_record(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data = sample_user()
            user = create_user(user_data)
            data = sample_user_course(user.user_id, result["course_id"])
            uc = create_user_course(data)

            assert uc.user_course_id is not None
            assert uc.user_id == user.user_id
            assert uc.course_id == result["course_id"]
            assert uc.role_id == 5
            assert uc.active is True

        finally:
            # Clean up
            if result:
                try:
                    delete_user_course(uc.user_course_id)
                    delete_user(user.user_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")



def test_get_user_courses_returns_list(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="teacher.1@example.com", role_id=3)
            teacher = create_user(teacher_data)
            course_data1 = sample_course(teacher.user_id)
            course1 = create_course(course_data1)
            course_data2 = sample_course(teacher.user_id, course_number="CRS002")
            course2 = create_course(course_data2)

            student_data = sample_user(owner_id=teacher.user_id)
            student = create_user(student_data)

            data1 = sample_user_course(student.user_id, course1.course_id)
            result1 = create_user_course(data1)
            data2 = sample_user_course(student.user_id, course2.course_id)
            result2 = create_user_course(data2)

            courses = get_courses_by_user_courses_by_user_id(student.user_id)
            assert isinstance(courses, list)
            assert any(c.course_id == result1.course_id for c in courses)
            assert any(c.course_id == result2.course_id for c in courses)
        
        finally:
            # Clean up
            try:
                delete_user_course(result1.user_course_id)
                delete_user_course(result2.user_course_id)
                delete_course(course1.course_id)
                delete_course(course2.course_id)
                delete_user(teacher.user_id)
                delete_user(student.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")



def test_get_user_course_by_valid_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data = sample_user()
            user = create_user(user_data)
            data = sample_user_course(user.user_id, result["course_id"])

            uc = create_user_course(data)
            results = get_user_course(uc.course_id)
            assert results.course_id == uc.course_id
        
        finally:
            # Clean up
            if result:
                try:
                    delete_user_course(uc.user_course_id)
                    delete_user(user.user_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_get_user_course_invalid_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidUserCourseID):
            get_user_course(999999)

def test_get_user_course_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data = sample_user()
            user = create_user(user_data)
            data = sample_user_course(user.user_id, result["course_id"])

            uc = create_user_course(data)
            query = get_user_course_user_id(uc.user_course_id)
            assert query == user.user_id
        
        finally:
            # Clean up
            if result:
                try:
                    delete_user_course(result["course_id"])
                    delete_user(user.user_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_load_demo_user_course_admin(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        load_demo_admin()
        load_demo_course()
        load_demo_user_course_admin()

        courses = get_user_courses()
        assert all(c.user_id == 2 for c in courses)

def test_load_demo_user_course_ta_instructor(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        load_demo_admin()
        load_demo_ta_instructor()
        load_demo_course()
        load_demo_user_course_ta_instructor()

        courses = get_user_courses()
        assert any(c.user_id == 3 for c in courses)
        assert any(c.role_id == 4 for c in courses)

def test_load_demo_user_course_student(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        load_demo_admin()
        load_demo_student()
        load_demo_course()
        load_demo_user_course_student()

        courses = get_user_courses()
        assert all(c.role_id == 5 for c in courses)
        assert any(c.user_id == 7 for c in courses)


def test_get_user_courses_by_user_id_and_course_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data = sample_user()
            user = create_user(user_data)
            data = sample_user_course(user.user_id, result["course_id"])

            uc = create_user_course(data)
            query = get_user_courses_by_user_id_and_course_id(user.user_id, result["course_id"])
            assert len(query) == 1
            assert query[0].course_id == uc.course_id
        
        finally:
            # Clean up
            if result:
                try:
                    delete_user_course(result["course_id"])
                    delete_user(user.user_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_replace_user_course_updates_record(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="teacher.1@example.com", role_id=3)
            teacher = create_user(teacher_data)
            course_data1 = sample_course(teacher.user_id)
            course1 = create_course(course_data1)
            course_data2 = sample_course(teacher.user_id, course_number="CRS002")
            course2 = create_course(course_data2)
            
            user_data = sample_user()
            user = create_user(user_data)
            data = sample_user_course(user.user_id, course1.course_id)

            uc = create_user_course(data)
            updated_data = sample_user_course(user.user_id, course2.course_id, role_id=4)
            updated_data["active"] = False
            updated = replace_user_course(updated_data, uc.user_course_id)

            assert updated.user_id == user.user_id
            assert updated.course_id == uc.course_id
            assert updated.role_id == 4
            assert updated.active is False

        finally:
            # Clean up
            try:
                delete_user_course(uc.user_course_id)
                delete_user_course(updated.user_course_id)
                delete_course(course1.course_id)
                delete_course(course2.course_id)
                delete_user(teacher.user_id)
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_replace_user_course_raises_invalid_course_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidUserCourseID):
            replace_user_course({"data":3}, 99999)


def test_replace_role_id_given_user_id_and_course_id_updates_role(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data = sample_user()
            user = create_user(user_data)
            data = sample_user_course(user.user_id, result["course_id"])

            uc = create_user_course(data)
            updated = replace_role_id_given_user_id_and_course_id(user.user_id, uc.course_id, role_id=4)

            assert updated.role_id == 4

        finally:
            # Clean up
            if result:
                try:
                    delete_user_course(uc.user_course_id)
                    delete_user(user.user_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_replace_role_id_given_user_id_and_course_id_raises_exception(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(Exception):
            replace_role_id_given_user_id_and_course_id(222, 333, 5)


def test_set_active_and_inactive_status(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data = sample_user()
            user = create_user(user_data)
            data = sample_user_course(user.user_id, result["course_id"])

            uc = create_user_course(data)

            # Set inactive
            set_active_status_of_user_to_inactive(user.user_id, uc.course_id)
            uc_db = get_user_course_by_user_id_and_course_id(user.user_id, uc.course_id)
            assert uc_db.active is False

            # Set active
            set_inactive_status_of_user_to_active(uc.user_course_id)
            uc_db = get_user_course_by_user_id_and_course_id(user.user_id, uc.course_id)
            assert uc_db.active is True

        finally:
            # Clean up
            if result:
                try:
                    delete_user_course(uc.user_course_id)
                    delete_user(user.user_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_delete_user_course_by_user_id_course_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data = sample_user()
            user = create_user(user_data)
            data = sample_user_course(user.user_id, result["course_id"])

            uc = create_user_course(data)
            delete_user_course_by_user_id_course_id(user.user_id, uc.course_id)
            result = get_user_courses_by_user_id_and_course_id(user.user_id, uc.course_id)
            assert len(result) == 0

        finally:
            # Clean up
            if result:
                try:
                    delete_user(user.user_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_delete_user_course_by_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data = sample_user()
            user = create_user(user_data)
            data = sample_user_course(user.user_id, result["course_id"])

            uc = create_user_course(data)
            delete_user_course(uc.course_id)
            with pytest.raises(InvalidUserCourseID):
                get_user_course(uc.course_id)

        finally:
            # Clean up
            if result:
                try:
                    delete_user(user.user_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")


def test_get_user_course_student_count(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            student1_data = sample_user(owner_id=result["user_id"])
            student1 = create_user(student1_data)
            student2_data = sample_user(email="student2@example.com", owner_id=result["user_id"])
            student2 = create_user(student2_data)
            ta_data = sample_user(email="ta1@example.com", role_id=4)
            ta = create_user(ta_data)

            data1 = sample_user_course(student1.user_id, result["course_id"])
            data2 = sample_user_course(student2.user_id, result["course_id"])
            data3 = sample_user_course(ta.user_id, result["course_id"], role_id=4)

            # Add students and others
            uc1 = create_user_course(data1)
            uc2 = create_user_course(data2)
            uc3 = create_user_course(data3) # TA role

            count = get_user_course_student_count_by_course_id(result["course_id"])
            assert count == 2

        finally:
            # Clean up
            if result:
                try:
                    delete_user_course(uc1)
                    delete_user_course(uc2)
                    delete_user_course(uc3)
                    delete_user(student1.user_id)
                    delete_user(student2.user_id)
                    delete_user(ta.user_id)
                    delete_one_admin_course(result)
                except Exception as e:
                    print(f"Cleanup skipped: {e}")

def test_get_users_by_role_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=5)

            results = get_users_by_role_id(5)
            assert len(results) == 4
            assert all(r.owner_id == result["user_id"] for r in results)

        finally:
            # Clean up
            try:
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


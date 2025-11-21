import pytest
from core import db
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
    create_users,
    delete_users,
)
from integration.integration_helpers import *
from models.assessment_task import (
    create_assessment_task,
    delete_assessment_task,
    get_assessment_task,
    get_assessment_tasks_by_course_id,
)
from models.rubric import delete_rubric_by_id
import jwt
from models.user import create_user, delete_user, get_user
from models.course import create_course, delete_course
from models.user_course import create_user_course, delete_user_course
from models.team import delete_team
from models.completed_assessment import (
    create_completed_assessment,
    delete_completed_assessment_tasks,
)
from models.team_user import delete_team_user



def test_get_one_assessment_task_by_assessment_task_id(
        flask_app_mock, 
        client, 
        sample_token, 
        auth_header
    ):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/assessment_task?assessment_task_id={task.assessment_task_id}&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200
        
            rslt = data['content']['assessment_tasks'] # First unwrap
            assert len(rslt) == 1
            assert rslt[0]['assessment_task_name'] == task.assessment_task_name
            assert rslt[0]['course_id'] == result['course_id']
            assert rslt[0]["rubric_id"] == rubric.rubric_id
            
        finally:
            # Clean up 
            try:
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_assessment_tasks_by_course_and_role_ids(
        flask_app_mock,
        client,
        sample_token,
        auth_header
    ):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")

            payload1 = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task1 = create_assessment_task(payload1)
            payload2 = build_sample_task_payload(result["course_id"], rubric.rubric_id, task_name="Integration Test 2")
            task2 = create_assessment_task(payload2)

            
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/assessment_task?course_id={result["course_id"]}&role_id=5&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200
            
            tasks = data['content']['assessment_tasks'][0] 
            assert len(tasks) == 2
            assert tasks[0]['assessment_task_name'] == task1.assessment_task_name
            assert tasks[1]['assessment_task_name'] == task2.assessment_task_name
            assert all(tasks[i]['course_id'] == result['course_id'] for i in range(2))
            assert all(tasks[i]['rubric_id'] == rubric.rubric_id for i in range(2))
        
        finally:
            # Clean up 
            try:
                delete_assessment_task(task1.assessment_task_id)
                delete_assessment_task(task2.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
    


def test_get_assessment_tasks_by_course(flask_app_mock, client, sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")

            payload1 = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task1 = create_assessment_task(payload1)
            payload2 = build_sample_task_payload(result["course_id"], rubric.rubric_id, task_name="Integration Test 2")
            task2 = create_assessment_task(payload2)
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/assessment_task?course_id={result['course_id']}&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            
            assert response.status_code == 200
            
            tasks = data['content']['assessment_tasks'][0] 
            
            assert len(tasks) == 2
            assert tasks[0]['assessment_task_name'] == task1.assessment_task_name
            assert tasks[1]['assessment_task_name'] == task2.assessment_task_name
            assert all(tasks[i]['course_id'] == result['course_id'] for i in range(2))
            assert all(tasks[i]['rubric_id'] == rubric.rubric_id for i in range(2))
            
        finally:
            # Clean up 
            try:
                delete_assessment_task(task1.assessment_task_id)
                delete_assessment_task(task2.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_assessment_tasks_by_user_id(
        flask_app_mock,
        client,
        sample_token,
        auth_header
    ):  
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(email="testteacher@example.com", role_id=3))
            course1 = create_course(sample_course(teacher.user_id))
            course2 = create_course(sample_course(teacher.user_id, course_number="CRS002"))

            student = create_user(sample_user())
            uc1 = create_user_course(sample_user_course(student.user_id, course1.course_id))
            uc2 = create_user_course(sample_user_course(student.user_id, course2.course_id))

            rubric = sample_rubric(teacher.user_id, "Critical Thinking")
            payload1 = build_sample_task_payload(course1.course_id, rubric.rubric_id)
            task1 = create_assessment_task(payload1)
            payload2 = build_sample_task_payload(course2.course_id, rubric.rubric_id, task_name="Integration Test 2")
            task2 = create_assessment_task(payload2)
            
            token = sample_token(user_id=student.user_id)

            response = client.get(
                f"/api/assessment_task?user_id={student.user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print(data)
            assert response.status_code == 200
            
            tasks = data['content']['assessment_tasks'][0] 
            
            assert len(tasks) == 2
            assert tasks[0]['assessment_task_name'] == task1.assessment_task_name
            assert tasks[1]['assessment_task_name'] == task2.assessment_task_name
            assert any(tasks[i]['course_id'] == course1.course_id for i in range(2))
            assert any(tasks[i]['course_id'] == course2.course_id for i in range(2))
            assert all(tasks[i]['rubric_id'] == rubric.rubric_id for i in range(2))
            
        finally:
            # Clean up 
            try:
                delete_assessment_task(task1.assessment_task_id)
                delete_assessment_task(task2.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_user_course(uc1.user_course_id)
                delete_user_course(uc2.user_course_id)
                delete_user(student.user_id)
                delete_course(course1.course_id)
                delete_course(course2.course_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_assessment_tasks_by_role_id(
        flask_app_mock,
        client,
        sample_token,
        auth_header
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"], "Critical Thinking")

            task1 = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id))
            task2 = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id, task_name="Integration Test 2"))
            task3 = create_assessment_task(build_sample_task_payload(result["course_id"], rubric.rubric_id, role_id=4, task_name="Integration Test 3"))
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/assessment_task?role_id=5&user_id={result["user_id"]}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            assert response.status_code == 200
            
            tasks = data['content']['assessment_tasks'][0] 
            
            assert len(tasks) == 2
            assert tasks[0]['assessment_task_name'] == task1.assessment_task_name
            assert tasks[1]['assessment_task_name'] == task2.assessment_task_name
            assert all(tasks[i]['course_id'] == result['course_id'] for i in range(2))
            assert all(tasks[i]['rubric_id'] == rubric.rubric_id for i in range(2))
            
        finally:
            # Clean up 
            try:
                delete_assessment_task(task1.assessment_task_id)
                delete_assessment_task(task2.assessment_task_id)
                delete_assessment_task(task3.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_assessment_tasks_by_team_id(
        flask_app_mock,
        client,
        sample_token,
        auth_header
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])

            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            payload["due_date"] = "2024-01-01T12:00:00"
            task1 = create_assessment_task(payload)
            task2 = create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id, 
                task_name="Integration Test 2"
            ))
            team = sample_team(
                "Alpha", 
                result["user_id"], 
                result["course_id"], 
                assessment_task_id=task2.assessment_task_id
            )
            task3 = create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id, 
                role_id=4, 
                task_name="Integration Test 3"
            ))

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/assessment_task?team_id={team.team_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200
            
            tasks = data['content']['assessment_tasks'][0] 
            
            assert len(tasks) == 2
            assert tasks[0]['assessment_task_name'] == task2.assessment_task_name
            assert tasks[1]['assessment_task_name'] == task3.assessment_task_name
            assert all(tasks[i]['course_id'] == result['course_id'] for i in range(2))
            assert all(tasks[i]['rubric_id'] == rubric.rubric_id for i in range(2))
            
        finally:
            # Clean up 
            try:
                delete_assessment_task(task3.assessment_task_id)
                delete_assessment_task(task2.assessment_task_id)
                delete_team(team.team_id)
                delete_assessment_task(task1.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_assessment_tasks_raises_exception(
        flask_app_mock,
        client,
        sample_token,
        auth_header
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        try:
            result = create_one_admin_course(False)
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/assessment_task?course_id=999&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            # Assert that the response indicates an error
            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
            
        finally:
            # Clean up
            try:
                delete_rubric_by_id(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_add_assessment_task(flask_app_mock, client, sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)

            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/assessment_task?user_id={result['user_id']}",
                headers=auth_header(token),
                json=payload
            )

            data = response.get_json()
            assert response.status_code == 201
            
            task = data['content']['assessment_task'][0] 
            assert task['assessment_task_name'] == payload["assessment_task_name"]
            assert task['course_id'] == result['course_id']
            assert task["rubric_id"] == rubric.rubric_id
            assert task["course_id"] == result["course_id"]
            
        finally:
            # Clean up
            try:
                delete_assessment_task(task[0]["assessment_task_id"])
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_add_assessment_raises_exception(
        flask_app_mock,
        client,
        sample_token,
        auth_header
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/assessment_task?user_id={result['user_id']}",
                headers=auth_header(token),
                json=999
            )
            
            # Assert that the response indicates an error
            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
            
        finally:
            # Clean up
            try:
                delete_rubric_by_id(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_assessment_task(flask_app_mock, client,sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            replaced = build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assessment 2"
            )

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/assessment_task?assessment_task_id={task.assessment_task_id}&user_id={result['user_id']}",
                headers=auth_header(token),
                json=replaced
            )

            data = response.get_json()
            assert response.status_code == 201
            
            rslt = data['content']['assessment_tasks'][0] 
            assert rslt['assessment_task_name'] == replaced["assessment_task_name"]

        finally:
            # Clean up
            try:
                delete_assessment_task(replaced["assessment_task_id"])
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_assessment_task_with_notification(flask_app_mock, client, sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            
            students = create_users(result["course_id"], result["user_id"], number_of_users=3)
         
            team = sample_team(
                "Test Team",
                result["user_id"],
                result["course_id"],
                assessment_task_id=task.assessment_task_id
            )
            print(f"team id: {team.team_id}")
            tu1 = sample_team_user(team.team_id, students[0].user_id)
            tu2 = sample_team_user(team.team_id, students[1].user_id)
            
            comp1 = create_completed_assessment(sample_completed_assessment(
                students[0].user_id,
                task.assessment_task_id,
                team_id=team.team_id,
                rating=completely["3"],
                c_by=result["user_id"]
            ))
            comp2 = create_completed_assessment(sample_completed_assessment(
                students[1].user_id,
                task.assessment_task_id,
                team_id=team.team_id,
                rating=completely["5"],
                c_by=result["user_id"]
            ))
            
            notification_data = {
                "notification_date": "2026-03-01T08:00:00.000Z",
                "notification_message": "Your feedback is ready to view!"
            }
            
            token = sample_token(user_id=result["user_id"])
            
            response = client.put(
                f"/api/assessment_task?assessment_task_id={task.assessment_task_id}&user_id={result['user_id']}&notification=true",
                headers=auth_header(token),
                json=notification_data
            )
            
            data = response.get_json()
            print(data)
            
            assert response.status_code == 201
            assert data['success'] == True
            
            updated_task = get_assessment_task(task.assessment_task_id)
            assert updated_task.notification_sent is not None
            
        finally:
            # Clean up
            try:
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                delete_team_user(tu1.team_user_id)
                delete_team_user(tu2.team_user_id)
                delete_team(team.team_id)
                delete_user(students)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_update_assessment_raises_exception(
        flask_app_mock,
        client,
        sample_token,
        auth_header
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            token = sample_token(user_id=result["user_id"])

            notification_data = {
                "notification_date": "2026-03-01T08:00:00.000Z",
                "notification_message": "Your feedback is ready to view!"
            }
            
            response = client.put(
                f"/api/assessment_task?assessment_task_id=99&user_id={result['user_id']}&notification=true",
                headers=auth_header(token),
                json=notification_data
            )
            
            # Assert that the response indicates an error
            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)
            
        finally:
            # Clean up
            try:
                delete_rubric_by_id(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_toggle_lock_status_route(flask_app_mock, client, sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/assessment_task_toggle_lock?assessmentTaskId={task.assessment_task_id}&user_id={result['user_id']}",
                headers=auth_header(token),
            )

            data = response.get_json()
            print(data)
            
            assert response.status_code == 201
            assert data['success'] == True

            rslt = data['content']['assessment_tasks'][0]
            assert rslt["assessment_task_id"] == task.assessment_task_id
            assert rslt["locked"] is True

        finally:
            # Clean up
            try:
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_toggle_lock_status_route_raises_exception(
        flask_app_mock, 
        client, 
        sample_token, 
        auth_header
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/assessment_task_toggle_lock?assessmentTaskId=999&user_id={result['user_id']}",
                headers=auth_header(token),
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_toggle_published_status_route(
        flask_app_mock,
        client,
        sample_token,
        auth_header
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/assessment_task_toggle_published?assessmentTaskId={task.assessment_task_id}&user_id={result['user_id']}",
                headers=auth_header(token),
            )

            data = response.get_json()
            print(data)
            
            assert response.status_code == 201
            assert data['success'] == True
           
            rslt = data['content']['assessment_tasks'][0]
            assert rslt["assessment_task_id"] == task.assessment_task_id
            assert rslt["published"] is True

        finally:
            # Clean up
            try:
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_toggle_published_status_route_raises_exception(
        flask_app_mock,
        client,
        sample_token,
        auth_header
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/assessment_task_toggle_published?assessmentTaskId=999&user_id={result['user_id']}",
                headers=auth_header(token),
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_copy_course_assessments(flask_app_mock, client, sample_token, auth_header):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])

            task1 = create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id
            ))
            task2 = create_assessment_task(build_sample_task_payload(
                result["course_id"], 
                rubric.rubric_id,
                task_name="Integration Test Assesment 2"
            ))

            new_course = create_course(sample_course(result["user_id"]))

            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/assessment_task_copy?source_course_id={result["course_id"]}&destination_course_id={new_course.course_id}&user_id={result['user_id']}",
                headers=auth_header(token),
            )

            data = response.get_json()
            print(data)
            
            assert response.status_code == 201
            assert data['success'] == True

            results = get_assessment_tasks_by_course_id(new_course.course_id)
            assert any(r.assessment_task_name == task1.assessment_task_name for r in results)
            assert any(r.assessment_task_name == task2.assessment_task_name for r in results)


        finally:
            # Clean up
            try:
                delete_assessment_task(task1.assessment_task_id)
                delete_assessment_task(task2.assessment_task_id)
                delete_assessment_task(results[0].assessment_task_id)
                delete_assessment_task(results[1].assessment_task_id)
                delete_course(new_course.course_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_copy_course_assessments_raises_exception(
        flask_app_mock, 
        client, 
        sample_token, 
        auth_header
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)

            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/assessment_task_copy?source_course_id=999&destination_course_id=888&user_id={result['user_id']}",
                headers=auth_header(token),
            )

            assert response.status_code == 400
            data = response.get_json()
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
import pytest
from core import db
from models.schemas import *
from models.team_user import *
from integration.integration_helpers import (
    sample_team_user,
    sample_team,
    build_sample_task_payload,
    sample_checkin,
    sample_rubric,
    sample_user
)
from Tests.PopulationFunctions import (
    cleanup_test_users,
    create_one_admin_course,
    delete_one_admin_course,
    create_users,
    delete_users,
)
from models.team import delete_team
from models.user import (
    load_demo_admin,
    load_demo_student
)
from models.queries import (
    get_team_users,
    get_students_by_team_id,
    get_active_students_not_in_a_team,
    get_team_members_in_course,
    get_team_members,
    remove_user_from_team,
    get_adhoc_team_users,
)
from models.assessment_task import (
    create_assessment_task,
    delete_assessment_task
)
from models.user import create_user
from models.checkin import create_checkin


def test_get_team_users_returns_all(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            u1 = sample_team_user(team.team_id, users[0].user_id)
            u2 = sample_team_user(team.team_id, users[1].user_id)

            users = get_all_team_users()
            assert len(users) == 2
            assert {u.user_id for u in users} == {u1.user_id, u2.user_id}
            assert {u.team_id for u in users} == {u1.team_id, u2.team_id}

        finally:
            # Clean up
            try:
                delete_team_user(u1.user_id)
                delete_team_user(u2.user_id)
                delete_users(users)
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_get_team_user_returns_correct_user(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)

            u = sample_team_user(team.team_id, user[0].user_id)

            rslt = get_team_user(u.team_user_id)
            assert rslt.team_user_id == u.team_user_id
            assert rslt.user_id == u.user_id
        
        finally:
           # Clean up
            try:
               delete_team_user(u.team_user_id)
               delete_users(user)
               delete_team(team.team_id)
               delete_one_admin_course(result)
            except Exception as e:
               print(f"Cleanup skipped: {e}") 


def test_get_team_user_raises_for_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidTeamUserID):
            get_team_user(99999)


def test_get_team_user_by_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
    
            u = sample_team_user(team.team_id, user[0].user_id)

            rslt = get_team_user_by_user_id(user[0].user_id)
            assert rslt.user_id == u.user_id
            assert rslt.team_id == u.team_id
        
        finally:
           # Clean up
            try:
               delete_team_user(u.team_user_id)
               delete_users(user)
               delete_team(team.team_id)
               delete_one_admin_course(result)
            except Exception as e:
               print(f"Cleanup skipped: {e}") 


def test_get_team_user_by_user_id_raises(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidTeamUserID):
            get_team_user_by_user_id(55555)


def test_get_team_user_recently_added(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            u1 = sample_team_user(team.team_id, users[0].user_id)
            u2 = sample_team_user(team.team_id, users[1].user_id)

            rslt = get_team_user_recently_added()
            assert rslt.user_id == u2.user_id
        
        finally:
            # Clean up
            try:
                delete_team_user(u1.team_user_id)
                delete_team_user(u2.team_user_id)
                delete_users(users)
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_get_team_users_by_team_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team1 = sample_team("Ataboy", result["user_id"], result["course_id"])
            team2 = sample_team("Bison", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)

            u1 = sample_team_user(team1.team_id, users[0].user_id)
            u2 = sample_team_user(team1.team_id, users[1].user_id)
            u3 = sample_team_user(team2.team_id, users[2].user_id)

            team1_users = get_team_users_by_team_id(team1.team_id)
            assert len(team1_users) == 2
            assert {u.user_id for u in team1_users} == {u1.user_id, u2.user_id}

        finally:
            # Clean up
            try:
                delete_team_user(u1.team_user_id)
                delete_team_user(u2.team_user_id)
                delete_team_user(u3.team_user_id)
                delete_users(users)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_get_team_members(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team1 = sample_team("Ataboy", result["user_id"], result["course_id"])
            team2 = sample_team("Bison", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)
            u1 = sample_team_user(team1.team_id, users[0].user_id)
            u2 = sample_team_user(team1.team_id, users[1].user_id)
            u3 = sample_team_user(team2.team_id, users[2].user_id)

            members = get_all_team_members(u1.team_user_id)
            assert len(members) == 2
            assert {u.user_id for u in members} == {u1.user_id, u2.user_id}
        
        finally:
            # Clean up
            try:
                delete_team_user(u1.team_user_id)
                delete_team_user(u2.team_user_id)
                delete_team_user(u3.team_user_id)
                delete_users(users)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 


def test_get_team_members_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidTeamUserID):
            get_all_team_members(99999)


def test_create_team_user(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)

            u = sample_team_user(team.team_id, user[0].user_id)
            assert u.team_id == team.team_id
            assert u.user_id == user[0].user_id

            # Ensure exists in DB
            db_user = TeamUser.query.filter_by(user_id=user[0].user_id).first()
            assert db_user is not None

        finally:
            # Clean up
            try:
                delete_team_user(u.team_user_id)
                delete_users(user)
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_replace_team_user(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team1 = sample_team("Ataboy", result["user_id"], result["course_id"])
            team2 = sample_team("Bison", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=3)

            original = sample_team_user(team1.team_id, users[0].user_id)

            updated = replace_team_user({"team_id": team2.team_id, "user_id": users[1].user_id}, original.team_user_id)

            assert updated.team_id == team2.team_id
            assert updated.user_id == users[1].user_id
        
        finally:
            # Clean up
            try:
                delete_team_user(updated.team_user_id)
                delete_users(users)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_replace_team_user_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidTeamUserID):
            replace_team_user({"team_id": 3, "user_id": 300}, 99999)


def test_delete_team_user(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)

            u = sample_team_user(team.team_id, user[0].user_id)

            delete_team_user(u.team_user_id)

            assert TeamUser.query.filter_by(team_user_id=u.team_user_id).first() is None
        
        finally:
            # Clean up
            try:
                delete_users(user)
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_delete_team_user_by_user_id_and_team_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)

            u = sample_team_user(team.team_id, user[0].user_id)

            delete_team_user_by_user_id_and_team_id(u.user_id, u.team_id)

            assert TeamUser.query.filter_by(user_id=user[0].user_id, team_id=team.team_id).first() is None

        finally:
            # Clean up
            try:
                delete_users(user)
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_load_demo_team_user(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            load_demo_admin()
            load_demo_student()

            load_demo_team_user()

            results = get_team_users(result["course_id"], team.team_id)
            assert len(results) == 3
            assert {u.user_id for u in results} == {4, 5, 6}

        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_students_by_team_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)
           
            for i in range(3):
                sample_team_user(team.team_id, users[i].user_id)

            results = get_students_by_team_id(result["course_id"], team.team_id)
            assert len(results) == 3
            assert {u.user_id for u in results} == {users[0].user_id, users[1].user_id, users[2].user_id}

        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_active_students_not_in_a_team(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=6)

            for i in range(3):
                sample_team_user(team.team_id, users[i].user_id)
            
            results = get_active_students_not_in_a_team(result["course_id"], team.team_id)
            assert len(results) == 2
            assert {u.user_id for u in results} == {users[3].user_id, users[4].user_id}

        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_team_members(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)
           
            for i in range(3):
                sample_team_user(team.team_id, users[i].user_id)

            team_members, team_id = get_team_members(users[0].user_id, result["course_id"])
            assert len(team_members) == 3
            assert team_id == team.team_id
            assert any(u.user_id == users[1].user_id for u in team_members)
        
        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_team_members_in_course(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team1 = sample_team("Ataboy", result["user_id"], result["course_id"])
            team2 = sample_team("Bison", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)
            sample_team_user(team1.team_id, users[0].user_id)
            sample_team_user(team1.team_id, users[1].user_id)
            sample_team_user(team2.team_id, users[2].user_id)

            results = get_team_members_in_course(result["course_id"])
            assert len(results) == 2
            names, team_id = results[0]
            assert team_id == team1.team_id
            assert set(names) == {users[0].last_name, users[1].last_name}


        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_users(users)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}") 
            

def test_remove_user_from_team(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("Ataboy", result["user_id"], result["course_id"])
            users = create_users(result["course_id"], result["user_id"], number_of_users=4)
           
            for i in range(3):
                sample_team_user(team.team_id, users[i].user_id)

            results = get_all_team_users()
            assert len(results) == 3

            remove_user_from_team(users[1].user_id, team.team_id)

            results = get_all_team_users()
            assert len(results) == 2
            assert {r.user_id for r in results} == {users[0].user_id, users[2].user_id}
        
        finally:
            # Clean up
            try:
                TeamUser.query.delete()
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_adhoc_team_users(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team = sample_team("Alpha", result["user_id"], result["course_id"], task.assessment_task_id)
            users = []
            for i in range(1, 3):
                users.append(create_user(sample_user(email=f"user{i}@example.com")))

            create_checkin(sample_checkin(task.assessment_task_id, users[0].user_id, team_number=team.team_id))
            create_checkin(sample_checkin(task.assessment_task_id, users[1].user_id, team_number=team.team_id))

            results = get_adhoc_team_users(team.team_id)
            assert len(results) == 2


        finally:
            # Clean up
            try:
                Checkin.query.delete()
                User.query.delete()
                delete_team(team.team_id)
                delete_assessment_task(task.assessment_task_id)
                Rubric.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")        
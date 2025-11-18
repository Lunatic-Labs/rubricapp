import pytest
from datetime import datetime, date
from core import db
from models.team import *
from models.schemas import TeamUser, User
from integration.integration_helpers import *
from Tests.PopulationFunctions import (
    cleanup_test_users,
    create_one_admin_course,
    delete_one_admin_course,
    create_users,
    delete_users,
)
from models.user import (
    create_user,
    delete_user,
    load_demo_admin,
    load_demo_ta_instructor,
)
from models.course import create_course, delete_course
from models.schemas import Team
from models.course import load_demo_course
from models.queries import (
    get_team_by_course_id_and_user_id,
    add_user_to_team,
    get_adHoc_team_by_course_id_and_user_id,
    get_all_adhoc_teams_from_AT,
    get_team_by_course_id_and_observer_id,
    get_all_nonfull_adhoc_teams,
    get_num_of_adhocs,
    get_team_ratings,
)
from models.assessment_task import (
    create_assessment_task,
    delete_assessment_task
)
from models.checkin import (
    create_checkin,
    delete_checkins_over_team_count
)
from models.completed_assessment import (
    delete_completed_assessment_tasks,
    create_completed_assessment,
)
from models.rubric import delete_rubric_by_id
from models.feedback import delete_feedback_by_user_id_completed_assessment_id


def test_create_team(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            team = sample_team("TeamX", result["user_id"], result["course_id"])
            
            assert team.team_name == "TeamX"
            assert team.observer_id == result["user_id"]
            assert team.course_id == result["course_id"]
            assert team.active_until is None
            assert isinstance(team.date_created, date)

        finally:
            # Clean up
            try:
                delete_team(team.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")



def test_get_team(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            created = sample_team("Alpha", result["user_id"], result["course_id"])
    
            fetched = get_team(created.team_id)
            assert fetched.team_name == "Alpha"
            assert fetched.team_id == created.team_id
        
        finally:
            # Clean up
            try:
                delete_team(created.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_team_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidTeamID):
            get_team(99999)


def test_get_team_name_by_name(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            created = sample_team("SearchableTeam", result["user_id"], result["course_id"])
        
            found = get_team_name_by_name("SearchableTeam")
            assert found is not None
            assert found.team_name == "SearchableTeam"

        finally:
            # Clean up
            try:
                delete_team(created.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_teams_only_active(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            t1 = sample_team("Active1", result["user_id"], result["course_id"])
            t2 = sample_team("Active2", result["user_id"], result["course_id"])
    
            deactivate_team(t1.team_id)

            teams = get_teams()  # returns only active_until=None
            names = [t.team_name for t in teams]
            assert "Active1" not in names
            assert "Active2" in names

        finally:
            # Clean up
            try:
                delete_team(t1.team_id)
                delete_team(t2.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
        


def test_get_team_by_course_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="teacher1@example.com", role_id=3)
            teacher = create_user(teacher_data)
            course_data1 = sample_course(teacher.user_id)
            course1 = create_course(course_data1)
            course_data2 = sample_course(teacher.user_id, course_number="MATH1020")
            course2 = create_course(course_data2)

            teamA = sample_team("A", teacher.user_id, course1.course_id)
            teamB = sample_team("B", teacher.user_id, course1.course_id)
            teamC = sample_team("C", teacher.user_id, course2.course_id)

            teams = get_team_by_course_id(course1.course_id)
            assert len(teams) == 2
            assert {t.team_name for t in teams} == {"A", "B"}

        finally:
            # Clean up
            try:
                delete_team(teamA.team_id)
                delete_team(teamB.team_id)
                delete_team(teamC.team_id)
                delete_course(course1.course_id)
                delete_course(course2.course_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_team_count_by_course_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            t1 = sample_team("T1", result["user_id"], result["course_id"])
            t2 = sample_team("T2", result["user_id"], result["course_id"])

            assert get_team_count_by_course_id(result["course_id"]) == 2

        finally:
            # Clean up
            try:
                delete_team(t1.team_id)
                delete_team(t2.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_team_by_team_name_and_course_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            tA = sample_team("GroupA", result["user_id"], result["course_id"])
            
            rslt = get_team_by_team_name_and_course_id("GroupA", result["course_id"])
            assert rslt is not None
            assert rslt.team_name == "GroupA"
            assert rslt.course_id == result["course_id"]
        
        finally:
            # Clean up
            try:
                delete_team(tA.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_teams_by_observer_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher_data = sample_user(email="teacher1@example.com", role_id=3)
            teacher = create_user(teacher_data)
            course_data1 = sample_course(teacher.user_id)
            course1 = create_course(course_data1)
            course_data2 = sample_course(teacher.user_id, course_number="MATH1020")
            course2 = create_course(course_data2)

            t1 = sample_team("ObsTeam1", teacher.user_id, course1.course_id)
            t2 = sample_team("ObsTeam2", teacher.user_id, course1.course_id)
            t3 = sample_team("WrongCourse", teacher.user_id, course2.course_id)

            teams = get_teams_by_observer_id(teacher.user_id, course1.course_id)
            assert len(teams) == 2
            assert {t.team_name for t in teams} == {"ObsTeam1", "ObsTeam2"}

        finally:
            # Clean up
            try:
                delete_team(t1.team_id)
                delete_team(t2.team_id)
                delete_team(t3.team_id)
                delete_course(course1.course_id)
                delete_course(course2.course_id)
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_last_created_team_team_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            t1 = sample_team("X1", result["user_id"], result["course_id"])
            t2 = sample_team("X2", result["user_id"], result["course_id"])
            t3 = sample_team("X3", result["user_id"], result["course_id"])

            assert get_last_created_team_team_id() == t3.team_id
        
        finally:
            # Clean up
            try:
                delete_team(t1.team_id)
                delete_team(t2.team_id)
                delete_team(t3.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_team_is_active(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            t = sample_team("ActiveTeam", result["user_id"], result["course_id"])
            assert team_is_active(t.team_id) is True

            deactivate_team(t.team_id)
            assert team_is_active(t.team_id) is False
        
        finally:
            # Clean up
            try:
                delete_team(t.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_team_is_active_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidTeamID):
            team_is_active(999999)


def test_deactivate_team(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            t = sample_team("ToDeactivate", result["user_id"], result["course_id"])
            assert t.active_until is None

            updated = deactivate_team(t.team_id)
            assert updated.active_until is not None
            assert isinstance(updated.active_until, date)

        finally:
            # Clean up
            try:
                delete_team(t.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_replace_team(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            t = sample_team("OldName", result["user_id"], result["course_id"])

            new_data = {
                "team_name": "NewName",
                "observer_id": result["user_id"],
                "date_created": "12/31/2024"
            }

            updated = replace_team(new_data, t.team_id)
            assert updated.team_name == "NewName"
            assert updated.observer_id == result["user_id"]
            assert updated.date_created == datetime(2024, 12, 31).date()

        finally:
            # Clean up
            try:
                delete_team(updated.team_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_replace_team_invalid_id(flask_app_mock):
    with flask_app_mock.app_context():
        with pytest.raises(InvalidTeamID):
            replace_team({"team_name": "X", "observer_id": 1, "date_created": "01/01/2024"}, 999999)


def test_delete_team(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            t = sample_team("WillDelete", result["user_id"], result["course_id"])

            delete_team(t.team_id)

            # verify not found
            with pytest.raises(InvalidTeamID):
                get_team(t.team_id)
        
        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_load_demo_team(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            load_demo_admin()
            load_demo_ta_instructor()
            load_demo_course()

            load_demo_team()

            assert len(get_teams()) == 3

        finally:
            # Clean up
            try:
                Team.query.delete()
                db.session.commit()
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_get_team_by_course_id_and_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user = create_users(result["course_id"], result["user_id"], number_of_users=2)
            created = sample_team("Alpha", result["user_id"], result["course_id"])

            add_user_to_team(result["course_id"], user[0].user_id, created.team_id)
            rslt = get_team_by_course_id_and_user_id(result["course_id"], user[0].user_id)
            assert rslt[0].team_name == "Alpha"
            assert rslt[0].team_id == created.team_id
            assert rslt[0].observer_id == result["user_id"]

        finally:
            # Clean up
            try:
                delete_team(created.team_id)
                delete_users(user)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
                
def test_get_adHoc_team_by_course_id_and_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data = sample_user()
            user = create_user(user_data)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team1 = sample_team("Alpha", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)
            team2 = sample_team("Omega", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)

            checkin_data = sample_checkin(task.assessment_task_id, user.user_id, team_number=team1.team_id)
            create_checkin(checkin_data)

            rslt = get_adHoc_team_by_course_id_and_user_id(result["course_id"], user.user_id)
            assert len(rslt) == 1
            assert rslt[0].team_id == team1.team_id

        finally:
            # Clean up
            try:
                delete_checkins_over_team_count(task.assessment_task_id, 0)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_assessment_task(task.assessment_task_id)
                delete_user(user.user_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_get_all_adhoc_teams_from_AT(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user_data1 = sample_user()
            user1 = create_user(user_data1)
            user_data2 = sample_user(email="testuser2@example.com")
            user2 = create_user(user_data2)

            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            team1 = sample_team("Team 1", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)
            team2 = sample_team("Team 2", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)
            team3 = sample_team("Team 3", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)

            checkin_data1 = sample_checkin(task.assessment_task_id, user1.user_id, team_number=team1.team_id)
            create_checkin(checkin_data1)
            checkin_data2 = sample_checkin(task.assessment_task_id, user2.user_id, team_number=team2.team_id)
            create_checkin(checkin_data2)

            results = get_all_adhoc_teams_from_AT(task.assessment_task_id)
            print([t.team_name for t in results])
            assert len(results) == 2
            assert any(t.team_name == "Team 1" for t in results)
            assert any(t.team_name == "Team 2" for t in results)

        finally:
            # Clean up
            try:
                delete_checkins_over_team_count(task.assessment_task_id, 0)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_team(team3.team_id)
                delete_assessment_task(task.assessment_task_id)
                delete_user(user1.user_id)
                delete_user(user2.user_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_get_team_by_course_id_and_observer_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            ta = create_users(result["course_id"], result["user_id"], number_of_users=2, role_id=4)
            team1 = sample_team("Team 1", ta[0].user_id, result["course_id"])
            team2 = sample_team("Team 2", ta[0].user_id, result["course_id"])
            team3 = sample_team("Team 3", result["user_id"], result["course_id"])

            results = get_team_by_course_id_and_observer_id(result["course_id"], ta[0].user_id)
            assert len(results) == 2
            assert any(t.team_name == "Team 1" for t in results)
            assert any(t.team_name == "Team 2" for t in results)

        finally:
            # Clean up
            try:
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_team(team3.team_id)
                delete_users(ta)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

        
def test_get_all_nonfull_adhoc_teams(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user = []
            for i in range(1, 12):
                user.append(create_user(sample_user(email=f"user{i}@example.com")))

            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            team1 = sample_team("Team 1", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)
            team2 = sample_team("Team 2", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)
            team3 = sample_team("Team 3", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)
            
            for i in range(1, 6):
                create_checkin(sample_checkin(task.assessment_task_id, user[i].user_id, team_number=team1.team_id))
            for i in range(6, 9):
                create_checkin(sample_checkin(task.assessment_task_id, user[i].user_id, team_number=team2.team_id))
            for i in range(9, 11):
                create_checkin(sample_checkin(task.assessment_task_id, user[i].user_id, team_number=team3.team_id))
            
            results = get_all_nonfull_adhoc_teams(task.assessment_task_id)
            assert len(results) == 2
            assert any(t.team_name == "Team 2" for t in results)
            assert any(t.team_name == "Team 3" for t in results)
            assert any(t.team_name != "Team 1" for t in results)
        
        finally:
            # Clean up
            try:
                delete_checkins_over_team_count(task.assessment_task_id, 0)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_team(team3.team_id)
                delete_assessment_task(task.assessment_task_id)
                for i in range(1, 12):
                    delete_user(user[i].user_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_num_of_adhocs(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            user = []
            for i in range(1, 7):
                user.append(create_user(sample_user(email=f"user{i}@example.com")))

            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)

            team1 = sample_team("Team 1", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)
            team2 = sample_team("Team 2", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)
            team3 = sample_team("Team 3", result["user_id"], result["course_id"], assessment_task_id=task.assessment_task_id)
            
            for i in range(1, 3):
                create_checkin(sample_checkin(task.assessment_task_id, user[i].user_id, team_number=team1.team_id))
            for i in range(3, 5):
                create_checkin(sample_checkin(task.assessment_task_id, user[i].user_id, team_number=team2.team_id))
            
            assert get_num_of_adhocs(task.assessment_task_id) == 2
        
        finally:
            # Clean up
            try:
                delete_checkins_over_team_count(task.assessment_task_id, 0)
                delete_team(team1.team_id)
                delete_team(team2.team_id)
                delete_team(team3.team_id)
                delete_assessment_task(task.assessment_task_id)
                for i in range(1, 6):
                    delete_user(user[i].user_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_team_ratings(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            users = create_users(result["course_id"], result["user_id"], number_of_users=3)
            rubric = sample_rubric(result["user_id"])
            payload = build_sample_task_payload(result["course_id"], rubric.rubric_id)
            task = create_assessment_task(payload)
            team = sample_team("Alpha", result["user_id"], result["course_id"], task.assessment_task_id)

            for i in range(2):
                sample_team_user(team.team_id, users[i].user_id)
            
            data1 = sample_completed_assessment(users[0].user_id, task.assessment_task_id, team_id=team.team_id, rating=accurately["3"], c_by=result["user_id"])
            comp1 = create_completed_assessment(data1)
            data2 = sample_completed_assessment(users[1].user_id, task.assessment_task_id, team_id=team.team_id, rating=accurately["1"], c_by=result["user_id"])
            comp2 = create_completed_assessment(data2)
            fb1 = sample_feedback(comp1.completed_assessment_id, users[0].user_id)
            fb2 = sample_feedback(comp2.completed_assessment_id, users[1].user_id)

            results = get_team_ratings(task.assessment_task_id)
            assert len(results) == 2
            assert all(r.team_id == team.team_id for r in results)
            assert any(r.rating_observable_characteristics_suggestions_data == "With some errors" for r in results)
            assert any(r.feedback_id == fb1.feedback_id for r in results)
        
        finally:
            # Clean up
            try:
                delete_feedback_by_user_id_completed_assessment_id(users[0].user_id, comp1.completed_assessment_id)
                delete_feedback_by_user_id_completed_assessment_id(users[1].user_id, comp2.completed_assessment_id)
                delete_completed_assessment_tasks(comp1.completed_assessment_id)
                delete_completed_assessment_tasks(comp2.completed_assessment_id)
                TeamUser.query.delete()
                delete_team(team.team_id)
                delete_assessment_task(task.assessment_task_id)
                delete_rubric_by_id(rubric.rubric_id)
                delete_users(users)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
                
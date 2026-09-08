import pytest
from core import db
from models.rubric_categories import (
    create_rubric_category,
    delete_rubric_categories_by_rubric_id,
)
from models.schemas import (
    Category, 
    ObservableCharacteristic,
    SuggestionsForImprovement,
    Rubric,
    RubricCategory,
)
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
    create_users,
    delete_users,
)
from integration.integration_helpers import *
from models.rubric import delete_rubric_by_id
import jwt
from models.user import create_user, delete_user, get_user
from models.loadExistingRubrics import (
    load_existing_rubrics,
    load_existing_categories,
)


def test_get_all_rubrics_with_rubric_id(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            cat1 = sample_category()
            cat2 = sample_category(cat_name="Analytical Thinking", rating=accurately)
            oc1 = sample_observable_characteristic(cat1.category_id)
            oc2 = sample_observable_characteristic(
                cat2.category_id,
                observable="Each figure conveyed a clear message"
            )
            sug1 = sample_suggestion(cat1.category_id, "Be more concise")
            sug2 = sample_suggestion(cat2.category_id, "Reflect on the investigation's purpose.")
            rubric = sample_rubric(result["user_id"])

            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat1.category_id,
            })
            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat2.category_id,
            })
            
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/rubric?rubric_id={rubric.rubric_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["rubrics"][0]["categories"]
            obs1 = results[0]["observable_characteristics"]
            obs2 = results[1]["observable_characteristics"]
            suggest1 = results[0]["suggestions"]
            suggest2 = results[1]["suggestions"]
            print("suggestion: ", suggest1[0]["suggestion_text"])
            assert len(results) == 2
            assert any(r["category_id"] == cat1.category_id for r in results)
            assert any(r["category_id"] == cat2.category_id for r in results)
            assert any(r["category_name"] == cat1.category_name for r in results)
            assert obs1[0]["observable_characteristic_text"] == oc1.observable_characteristic_text
            assert obs2[0]["observable_characteristic_text"] == oc2.observable_characteristic_text
            assert suggest1[0]["suggestion_text"] == sug1.suggestion_text
            assert suggest2[0]["suggestion_text"] == sug2.suggestion_text
            assert any(r["category_name"] == cat2.category_name for r in results)

        finally:
        # Cleanup
            try:
                delete_rubric_categories_by_rubric_id(rubric.rubric_id)
                delete_rubric_by_id(rubric.rubric_id)
                ObservableCharacteristic.query.delete()
                SuggestionsForImprovement.query.delete()
                Category.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_default_rubrics(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            teacher = create_user(sample_user(
                email="testteacher@example.com",
                role_id=3
            ))

            load_existing_rubrics()
            load_existing_categories()
            
            token = sample_token(user_id=teacher.user_id)

            response = client.get(
                f"/api/rubric?user_id={teacher.user_id}",
                headers=auth_header(token)
            )

            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["rubrics"][0]
            print("results: ", results)
            assert len(results) == 16
            assert any(r["rubric_id"] == 16 for r in results)
            assert any(r["rubric_name"] == "Experimenting" for r in results)
            assert any(r["rubric_name"] == "Modeling" for r in results)
            assert any(r["rubric_description"] == "Explaining a phenomenon of interest with multiple lines of empirical evidence" for r in results)
            assert any(r["category_total"] == 5 for r in results)

        finally:
        # Cleanup
            try:
                RubricCategory.query.delete()
                Category.query.delete()
                Rubric.query.delete()
                delete_user(teacher.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_custom_rubrics_with_user_id(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            cat1 = sample_category()
            cat2 = sample_category(cat_name="Analytical Thinking", rating=accurately)
            rubric1 = sample_rubric(result["user_id"])
            rubric2 = sample_rubric(
                result["user_id"],
                rbric_name="Integration Test Rubric 2"
            )

            create_rubric_category({
                "rubric_id": rubric1.rubric_id,
                "category_id": cat1.category_id,
            })
            create_rubric_category({
                "rubric_id": rubric2.rubric_id,
                "category_id": cat2.category_id,
            })
            create_rubric_category({
                "rubric_id": rubric2.rubric_id,
                "category_id": cat2.category_id,
            })
            
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/rubric?custom=true&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["rubrics"][0]
            print("results: ", results)
            assert len(results) == 2
            assert any(r["rubric_id"] == rubric2.rubric_id for r in results)
            assert any(r["rubric_name"] == "Integration Test Rubric 2" for r in results)
            assert any(r["rubric_name"] == "Integration Test Rubric" for r in results)
            assert any(r["rubric_description"] == rubric1.rubric_description for r in results)
            assert any(r["category_total"] == 2 for r in results)

        finally:
        # Cleanup
            try:
                RubricCategory.query.delete()
                Category.query.delete()
                Rubric.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_all_custom_and_default_rubrics_with_user_id(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:

            load_existing_rubrics()
            load_existing_categories()

            result = create_one_admin_course(True)
            cat1 = sample_category()
            cat2 = sample_category(cat_name="Analytical Thinking", rating=accurately)
            rubric1 = sample_rubric(result["user_id"])
            rubric2 = sample_rubric(
                result["user_id"],
                rbric_name="Integration Test Rubric 2"
            )

            create_rubric_category({
                "rubric_id": rubric1.rubric_id,
                "category_id": cat1.category_id,
            })
            create_rubric_category({
                "rubric_id": rubric2.rubric_id,
                "category_id": cat2.category_id,
            })
            create_rubric_category({
                "rubric_id": rubric2.rubric_id,
                "category_id": cat2.category_id,
            })
            
            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/rubric?all=true&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["rubrics"][0]
            print("results: ", results)
            assert len(results) == 18
            assert any(r["rubric_id"] == rubric2.rubric_id for r in results)
            assert any(r["rubric_name"] == "Integration Test Rubric 2" for r in results)
            assert any(r["rubric_name"] == "Integration Test Rubric" for r in results)
            assert any(r["rubric_description"] == rubric1.rubric_description for r in results)
            assert any(r["category_total"] == 2 for r in results)

            assert any(r["rubric_id"] == 16 for r in results)
            assert any(r["rubric_name"] == "Experimenting" for r in results)
            assert any(r["rubric_name"] == "Modeling" for r in results)
            assert any(r["rubric_description"] == "Explaining a phenomenon of interest with multiple lines of empirical evidence" for r in results)
            assert any(r["category_total"] == 5 for r in results)

        finally:
        # Cleanup
            try:
                RubricCategory.query.delete()
                Category.query.delete()
                Rubric.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")   

def test_get_all_rubrics_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
    
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/rubric?rubric_id=999&user_id={result['user_id']}",
                headers=auth_header(token)
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


def test_add_rubric(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session) 

        try:
            result = create_one_admin_course(False)
            rubric_payload = {
                "rubric_name": "Integration Test Rubric",
                "rubric_description": "A rubric for integration testing.",
                "owner": result["user_id"],
                "course_id": result["course_id"],
            }
            cat = sample_category()
        
            token = sample_token(user_id=result["user_id"])

            response = client.post(
                f"/api/rubric?user_id={result["user_id"]}",
                headers=auth_header(token),
                json={
                    "rubric": rubric_payload,
                    "categories": [cat.category_id],
                }
            )
            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            rslt = data["content"]["rubrics"]
            print("results: ", rslt)
            assert len(rslt) == 1
            assert rslt[0]["rubric_id"] is not None
            assert rslt[0]["rubric_name"] == "Integration Test Rubric"
            assert rslt[0]["rubric_description"] == rubric_payload["rubric_description"]
            assert rslt[0]["course_id"] == result["course_id"]

        finally:
            # Clean up
            try:
                delete_rubric_by_id(rslt[0]["rubric_id"])
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_add_rubric_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
    
            token = sample_token(user_id=result["user_id"])
            
            response = client.post(
                f"/api/rubric?user_id={result['user_id']}",
                headers=auth_header(token)
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


def test_get_all_categories_with_rubric_id(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            cat1 = sample_category()
            cat2 = sample_category(cat_name="Analytical Thinking", rating=accurately)
            rubric = sample_rubric(result["user_id"])

            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat1.category_id,
            })
            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat2.category_id,
            })

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/category?rubric_id={rubric.rubric_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["categories"][0]
            assert len(results) == 2
            assert any(r["category_id"] == cat1.category_id for r in results)
            assert any(r["category_name"] == cat2.category_name for r in results)
            assert any(r["description"] == cat1.description for r in results)

        finally:
        # Cleanup
            try:
                RubricCategory.query.delete()
                Category.query.delete()
                Rubric.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")   


def test_get_all_categories_by_default(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            load_existing_rubrics()
            load_existing_categories()

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/category?user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["categories"][0]
            assert len(results) == 74
            assert any(r["category_name"] == "Evaluating" for r in results)
            assert any(r["description"] == "Laid out the course of action required to accomplish a goal" for r in results)
            assert any(r["rubric_id"] == 8 for r in results)
            assert any(r["rubric_name"] == "Explaining phenomena" for r in results)
            

        finally:
        # Cleanup
            try:
                RubricCategory.query.delete()
                Category.query.delete()
                Rubric.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  


def test_get_all_custom_categories(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            cat1 = sample_category()
            cat2 = sample_category(cat_name="Analytical Thinking", rating=accurately)
            rubric = sample_rubric(result["user_id"])

            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat1.category_id,
            })
            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat2.category_id,
            })

            token = sample_token(user_id=result["user_id"])

            response = client.get(
                f"/api/category?custom=true&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["categories"][0]
            assert len(results) == 2
            assert any(r["category_id"] == cat1.category_id for r in results)
            assert any(r["category_name"] == cat2.category_name for r in results)
            assert any(r["description"] == cat1.description for r in results)

        finally:
        # Cleanup
            try:
                RubricCategory.query.delete()
                Category.query.delete()
                Rubric.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  

def test_get_all_categories_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
    
            token = sample_token(user_id=result["user_id"])
            
            response = client.get(
                f"/api/category?rubric_id=99&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 400
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  

def test_edit_rubric_with_not_categories_in_data(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])

            rubric_payload = {
                "rubric_name": "Integration Test Rubric 2",
                "rubric_description": "A rubric for integration testing 2.",
                "owner": result["user_id"], 
            }

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/rubric?rubric_id={rubric.rubric_id}&user_id={result["user_id"]}",
                headers=auth_header(token),
                json={
                    "rubric": rubric_payload
                }
            )

            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            rslt = data["content"]["rubrics"]
            assert len(rslt) == 1
            assert rslt[0]["rubric_id"] == rubric.rubric_id
            assert rslt[0]["rubric_name"] == rubric_payload["rubric_name"]
            assert rslt[0]["rubric_description"] == rubric_payload["rubric_description"]

        finally:
        # Cleanup
            try:
                Rubric.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  


def test_edit_rubric_with_not_categories_in_data(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])

            cat = sample_category()
            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat.category_id,
            })

            rubric_payload = {
                "rubric_name": "Integration Test Rubric 2",
                "rubric_description": "A rubric for integration testing 2.",
                "owner": result["user_id"], 
            }

            token = sample_token(user_id=result["user_id"])

            response = client.put(
                f"/api/rubric?rubric_id={rubric.rubric_id}&user_id={result["user_id"]}",
                headers=auth_header(token),
                json={
                    "rubric": rubric_payload,
                    "categories": [cat.category_id]
                }
            )

            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            rslt = data["content"]["rubrics"]
            assert len(rslt) == 1
            assert rslt[0]["rubric_id"] == rubric.rubric_id
            assert rslt[0]["rubric_name"] == rubric_payload["rubric_name"]
            assert rslt[0]["rubric_description"] == rubric_payload["rubric_description"]

        finally:
        # Cleanup
            try:
                Rubric.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  

def test_edit_rubric_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
    
            token = sample_token(user_id=result["user_id"])
            
            response = client.put(
                f"/api/rubric?rubric_id=99&user_id={result['user_id']}",
                headers=auth_header(token)
            )
            
            data = response.get_json()
            #print("data: ", data)
            assert response.status_code == 400
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  


def test_delete_rubric(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])

            token = sample_token(user_id=result["user_id"])

            response = client.delete(
                f"/api/rubric?rubric_id={rubric.rubric_id}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 200
            assert data["success"] is True

            assert "rubric deleted successfully" in data["content"]

        
        finally:
        # Cleanup
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")  


def test_delete_rubric_raises_exception(flask_app_mock, sample_token, auth_header, client):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(False)
            rubric = sample_rubric(result["user_id"])

            token = sample_token(user_id=result["user_id"])

            response = client.delete(
                f"/api/rubric?rubric_id=999&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            print("data: ", data)
            assert response.status_code == 400
            assert data['success'] == False
            assert "error" in data or "An error occurred" in str(data)

            r = db.session.get(Rubric, rubric.rubric_id)
            assert r is not None
            assert r.rubric_id == rubric.rubric_id

        finally:
            # Clean up
            try:
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_custom_rubrics_not_visible_to_other_admins(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    """Normal admins can only see the custom rubrics they created themselves."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            other_admin = create_user(sample_user(
                email="rubricotheradmin@example.com",
                role_id=3
            ))
            cat = sample_category()
            rubric = sample_rubric(result["user_id"])

            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat.category_id,
            })

            # The creator sees their own rubric.
            token = sample_token(user_id=result["user_id"])
            response = client.get(
                f"/api/rubric?custom=true&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["rubrics"][0]
            assert any(r["rubric_id"] == rubric.rubric_id for r in results)

            # Another admin does not see it.
            other_token = sample_token(user_id=other_admin.user_id)
            response = client.get(
                f"/api/rubric?custom=true&user_id={other_admin.user_id}",
                headers=auth_header(other_token)
            )

            data = response.get_json()
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["rubrics"][0]
            assert not any(r["rubric_id"] == rubric.rubric_id for r in results)

        finally:
            # Cleanup
            try:
                RubricCategory.query.delete()
                Category.query.delete()
                Rubric.query.delete()
                delete_user(other_admin.user_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_super_admin_sees_all_custom_rubrics(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    """The super admin (user_id 1) sees the custom rubrics of all users under them."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            result = create_one_admin_course(True)
            cat = sample_category()
            rubric = sample_rubric(result["user_id"])

            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat.category_id,
            })

            token = sample_token(user_id=1)
            response = client.get(
                f"/api/rubric?custom=true&user_id=1",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["rubrics"][0]
            assert any(r["rubric_id"] == rubric.rubric_id for r in results)

        finally:
            # Cleanup
            try:
                RubricCategory.query.delete()
                Category.query.delete()
                Rubric.query.delete()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_course_rubrics_owned_by_super_admin_and_course_admin(
        flask_app_mock,
        sample_token,
        auth_header,
        client
):
    """
    Rubrics for a course are those owned by user_id 1 (defaults) and by the
    admin of the course. A normal admin who is not the course admin does not
    see the course admin's rubrics.
    """
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            load_existing_rubrics()
            load_existing_categories()

            result = create_one_admin_course(True)
            other_admin = create_user(sample_user(
                email="rubricotheradmin@example.com",
                role_id=3
            ))
            cat = sample_category()
            course_admin_rubric = sample_rubric(result["user_id"])
            other_rubric = sample_rubric(
                other_admin.user_id,
                rbric_name="Other Admin Rubric"
            )

            create_rubric_category({
                "rubric_id": course_admin_rubric.rubric_id,
                "category_id": cat.category_id,
            })
            create_rubric_category({
                "rubric_id": other_rubric.rubric_id,
                "category_id": cat.category_id,
            })

            # The course admin sees the defaults and their own rubric, but
            # not the other admin's rubric.
            token = sample_token(user_id=result["user_id"])
            response = client.get(
                f"/api/rubric?all=true&course_id={result["course_id"]}&user_id={result["user_id"]}",
                headers=auth_header(token)
            )

            data = response.get_json()
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["rubrics"][0]
            assert any(r["rubric_id"] == course_admin_rubric.rubric_id for r in results)
            assert any(r["rubric_name"] == "Experimenting" for r in results)  # default rubric
            assert not any(r["rubric_id"] == other_rubric.rubric_id for r in results)

            # The super admin scoped to the course sees the defaults and the
            # course admin's rubrics, but not the other admin's rubric.
            super_token = sample_token(user_id=1)
            response = client.get(
                f"/api/rubric?all=true&course_id={result["course_id"]}&user_id=1",
                headers=auth_header(super_token)
            )

            data = response.get_json()
            assert response.status_code == 200
            assert data["success"] is True

            results = data["content"]["rubrics"][0]
            assert any(r["rubric_id"] == course_admin_rubric.rubric_id for r in results)
            assert any(r["rubric_name"] == "Experimenting" for r in results)  # default rubric
            assert not any(r["rubric_id"] == other_rubric.rubric_id for r in results)

        finally:
            # Cleanup
            try:
                RubricCategory.query.delete()
                Category.query.delete()
                Rubric.query.delete()
                delete_user(other_admin.user_id)
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
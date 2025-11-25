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
)
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


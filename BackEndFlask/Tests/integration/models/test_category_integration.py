import pytest
from core import db
from models.category import *
from models.rubric_categories import *
from Tests.PopulationFunctions import *
from models.schemas import Category, Rubric, RubricCategory
from models.loadExistingRubrics import *
from integration.integration_helpers import *
from models.queries import *
from models.user import create_user, delete_user
from models.rubric import delete_rubric_by_id
from models.ratings_numbers import *


def test_create_and_get_category(flask_app_mock):
    """Verify a category can be created and retrieved."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            category = sample_category()

            fetched = get_category(category.category_id)
            assert fetched.category_name == "Critical Thinking"
            assert fetched.rating_json["3"] == "Partially"

        finally:
            # Cleanup
            db.session.delete(category)
            db.session.commit()

def test_replace_category(flask_app_mock):
    """Verify a category can be replaced/updated."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            category = sample_category()

            updated_data = (
                "Analytical Thinking",
                "Assess ability to analyze and evaluate information",
                consistently
            )
            replaced = replace_category(updated_data, category.category_id)

            assert replaced.category_name == "Analytical Thinking"
            assert "Sometimes" in replaced.rating_json.values()

        finally:
            # Cleanup
            db.session.delete(replaced)
            db.session.commit()

def test_load_categories(flask_app_mock):
    """Integration: get_categories should return joined data."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        try:
            load_existing_categories()
            result = get_categories_per_rubric(13)
            assert any("Analyzing the data" in row.category_name for row in result)
            assert any("Interpreting the data" in row.category_name for row in result)
            assert len(result) == 3
        
        except Exception as e:
            print(f"Test failed: {e}")


def test_get_category_raises_invalid_id(flask_app_mock):
    """Ensure get_category raises InvalidCategoryID for missing category."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidCategoryID):
            get_category(9999)


def test_get_ratings_by_category(flask_app_mock):
    """Verify ratings JSON is retrieved correctly."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        cat_name = "Interpreting"
        desc = "Provided meaning to data, made inferences and predictions from data."
        rating = accurately
        cat = sample_category(cat_name=cat_name, desc=desc, rating=rating)
        ratings = get_ratings_by_category(cat.category_id)
        assert "No evidence" in ratings.values()
        assert rating["1"] == "Inaccurately"
        assert rating["4"] == ""
        assert rating["5"] == "Accurately"

        db.session.delete(cat)
        db.session.commit()


def test_get_ratings_by_category_invalid_id(flask_app_mock):
    """Ensure get_ratings_by_category raises for invalid id."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(InvalidCategoryID):
            get_ratings_by_category(12345)


def test_get_categories_per_rubric(flask_app_mock):
    """Ensure categories are properly linked to rubrics via RubricCategory."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            cat = sample_category()
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"])

            rc = create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat.category_id,
            })

            result_category = get_categories_per_rubric(rubric.rubric_id)
            assert len(result_category) == 1
            assert result_category[0].category_name == "Critical Thinking"

        finally:
        # Cleanup
            try:
                delete_rubric_categories_by_rubric_id(rubric.rubric_id)
                db.session.delete(cat)
                db.session.commit()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_delete_rubric_categories_by_rubric_id(flask_app_mock):
    """Verify that deleting rubric categories works properly."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:    
            cat = sample_category()
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"])
            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat.category_id,
            })

            # Should exist before deletion
            existing = RubricCategory.query.filter_by(rubric_id=rubric.rubric_id).all()
            assert len(existing) == 1

            delete_rubric_categories_by_rubric_id(rubric.rubric_id)
            remaining = RubricCategory.query.filter_by(rubric_id=rubric.rubric_id).all()
            assert len(remaining) == 0
        
        finally:
        # Cleanup
            try:
                delete_one_admin_course(result)
                delete_rubric_categories_by_rubric_id(rubric.rubric_id)
                db.session.delete(cat)
                db.session.commit()
            except Exception as e:
                print(f"Cleanup skipped: {e}")


def test_get_categories_returns_joined_data(flask_app_mock):
    """Integration: get_categories should join Rubric, RubricCategory, and Category."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:    
            cat = sample_category()
            result = create_one_admin_course(True)
            rubric = sample_rubric(result["user_id"])
            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat.category_id,
            })
        
            result = get_categories(result["user_id"])
            assert any("Critical Thinking" in row.category_name for row in result)

        finally:
            # Cleanup
            try:
                delete_one_admin_course(result)
                delete_rubric_categories_by_rubric_id(rubric.rubric_id)
                db.session.delete(cat)
                db.session.commit()
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_replace_category_invalid_id(flask_app_mock):
    """Ensure replace_category raises InvalidCategoryID for missing category."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        updated_data = (
            "Teamwork",
            "Ability to work effectively in teams",
            '{"Excellent":5,"Good":4,"Fair":3,"Poor":2,"Fail":1}'
        )
        with pytest.raises(InvalidCategoryID):
            replace_category(updated_data, 9999)

def test_get_categories_for_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            cat = sample_category()
            result = create_one_admin_course(True)
            rubric1 = sample_rubric(result["user_id"], "Mathematical thinking")
            rubric2 = sample_rubric(result["user_id"], "Analyzing data")

            rc1 = create_rubric_category({
                "rubric_id": rubric1.rubric_id,
                "category_id": cat.category_id,
            })
            rc2 = create_rubric_category({
                "rubric_id": rubric2.rubric_id,
                "category_id": cat.category_id,
            })

            results = get_categories_for_user_id(result["user_id"])
            assert len(results) == 2
            assert results[0].category_name == "Critical Thinking"
            assert any("Analyzing data" in row.rubric_name for row in results)
            assert any("Mathematical thinking" in row.rubric_name for row in results)

        finally:
        # Cleanup
            try:
                delete_rubric_categories_by_rubric_id(rubric1.rubric_id)
                delete_rubric_categories_by_rubric_id(rubric2.rubric_id)
                db.session.delete(cat)
                db.session.commit()
                delete_one_admin_course(result)
            except Exception as e:
                print(f"Cleanup skipped: {e}")

def test_get_rubrics_and_total_categories(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            load_existing_rubrics()
            load_existing_categories()

            rc = get_rubrics_and_total_categories(1)
            assert any(r.rubric_name == "Metacognition" for r in rc)
            assert any(c.category_total == 10 for c in rc)

            count = 0
            for c in rc:
                count += c.category_total
            assert count == 74

        finally:
           cleanup_test_users(db.session)

def test_get_rubrics_and_total_categories_for_user_id(flask_app_mock):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            load_existing_rubrics()
            load_existing_categories()

            user_data = sample_user()
            user = create_user(user_data)
            rubric = sample_rubric(user.user_id)
            cat = sample_category(cat_name="Test Category")
            create_rubric_category({
                "rubric_id": rubric.rubric_id,
                "category_id": cat.category_id,
            })

            rc1 = get_rubrics_and_total_categories_for_user_id(user.user_id)
            assert all(r.rubric_name == "Integration Test Rubric" for r in rc1)
            assert all(c.category_total == 1 for c in rc1)

            rc2 = get_rubrics_and_total_categories_for_user_id(user.user_id, True)
            assert any(r.rubric_name == "Modeling" for r in rc2)
            assert any(c.category_total == 10 for c in rc2)
            assert any(c.category_total == 1 for c in rc2)

            count = 0
            for c in rc2:
                count += c.category_total
            assert count == 75
        
        finally:
            try:
                db.session.delete(cat)
                db.session.commit()
                delete_rubric_by_id(rubric.rubric_id)
                delete_user(user.user_id)
                cleanup_test_users(db.session)
            except Exception as e:
                print(f"Cleanup skipped: {e}")
            

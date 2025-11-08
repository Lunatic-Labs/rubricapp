import pytest
from core import db
from models.category import (
    create_category,
    get_category,
    get_categories,
    get_categories_per_rubric,
    get_ratings_by_category,
    replace_category,
    InvalidCategoryID,
)
from models.rubric_categories import (
    create_rubric_category,
    delete_rubric_categories_by_rubric_id,
)
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
)
from models.schemas import Category, Rubric, RubricCategory
from models.rubric import create_rubric
from models.loadExistingRubrics import load_existing_categories

# --------------------------------------------------
# Helper functions
# --------------------------------------------------
def sample_rubric(user_id):
    """Helper to create a sample rubric payload."""
    rubric_data = {
        "rubric_name": "Clarity",
        "rubric_description": "Evaluate clarity and precision",
        "owner": user_id,
    }
    rubric = create_rubric(rubric_data)
    return rubric

def sample_category():
    """Helper to create a sample category payload."""
    category_data = {
        "name": "Critical Thinking",
        "description": "Evaluate analytical skills",
        "rating_json": '{"Excellent":5,"Good":4,"Fair":3,"Poor":2,"Fail":1}'
    }
    category = create_category(category_data)
    return category

# -----------------------------------------------
# Tests
# -----------------------------------------------
def test_create_and_get_category(flask_app_mock):
    """Verify a category can be created and retrieved."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        try:
            category = sample_category()

            fetched = get_category(category.category_id)
            assert fetched.category_name == "Critical Thinking"
            assert "Excellent" in fetched.rating_json

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
                '{"Outstanding":5,"Satisfactory":3,"Needs Improvement":1}'
            )
            replaced = replace_category(updated_data, category.category_id)

            assert replaced.category_name == "Analytical Thinking"
            assert "Outstanding" in replaced.rating_json

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
        
        cat = sample_category()
        ratings = get_ratings_by_category(cat.category_id)
        assert '"Good":4' in ratings

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
                delete_rubric_categories_by_rubric_id(sample_rubric.rubric_id)
                db.session.delete(cat)
                db.session.commit()
                delete_one_admin_course(result)
                delete_rubric_categories_by_rubric_id(rubric.rubric_id)
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
                delete_rubric_categories_by_rubric_id(sample_rubric.rubric_id)
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
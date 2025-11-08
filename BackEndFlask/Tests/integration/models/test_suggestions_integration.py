import pytest
from core import db
from models.suggestions import (
    get_suggestions,
    get_suggestion,
    get_suggestions_per_category,
    create_suggestion,
    replace_suggestion,
    Invalid_Suggestion_ID
)
from models.schemas import SuggestionsForImprovement, Category
from models.category import create_category
from Tests.PopulationFunctions import cleanup_test_users
from models.loadExistingRubrics import load_existing_suggestions

# ------------------------------------------------------------
# Helper Functions
# ------------------------------------------------------------
def sample_category():
    """Helper to create a sample category payload."""
    category_data = {
        "name": "Critical Thinking",
        "description": "Evaluate analytical skills",
        "rating_json": '{"Excellent":5,"Good":4,"Fair":3,"Poor":2,"Fail":1}'
    }
    category = create_category(category_data)
    return category


def sample_suggestion(category_id, suggestion_text):
    """Helper to create a sample suggestion payload."""
    suggestion_data = (category_id, suggestion_text)
    suggestion = create_suggestion(suggestion_data)
    return suggestion

# -------------------------------------------------------------------------
# Tests
# -------------------------------------------------------------------------
def test_create_suggestion(flask_app_mock):
    """Verify a suggestion can be created and stored."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        car = sample_category()
        new_suggestion = sample_suggestion(car.category_id, "Be more concise")

        assert new_suggestion.suggestion_id is not None
        assert new_suggestion.category_id == car.category_id
        assert new_suggestion.suggestion_text == "Be more concise"

        db.session.delete(new_suggestion)
        db.session.commit()
        db.session.delete(car)
        db.session.commit()


def test_get_suggestions(flask_app_mock):
    """Ensure all suggestions can be retrieved."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        load_existing_suggestions()
        all_suggestions = get_suggestions()
        assert any(s.suggestion_text == "Nothing specific at this time" for s in all_suggestions)
        assert any(s.suggestion_text == "Verify that items in lists are parallel." for s in all_suggestions)
        assert isinstance(all_suggestions, list)


def test_get_suggestion_valid(flask_app_mock):
    """Ensure fetching a valid suggestion by ID returns the right record."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        car = sample_category()
        setup_suggestion = sample_suggestion(car.category_id, "Use more visuals")
        result = get_suggestion(setup_suggestion.suggestion_id)
        assert result.suggestion_text == setup_suggestion.suggestion_text


def test_get_suggestion_invalid(flask_app_mock):
    """Ensure invalid suggestion_id raises an exception."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(Invalid_Suggestion_ID):
            get_suggestion(9999)


def test_get_suggestions_per_category(flask_app_mock):
    """Ensure suggestions are filtered correctly by category."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        setup_category = sample_category()
        setup_suggestion = sample_suggestion(setup_category.category_id, "Improve transitions between sections")
        results = get_suggestions_per_category(setup_category.category_id)
        assert all(s.category_id == setup_category.category_id for s in results)

        db.session.delete(setup_suggestion)
        db.session.commit()
        db.session.delete(setup_category)
        db.session.commit()


def test_replace_suggestion(flask_app_mock):
    """Ensure an existing suggestion can be replaced."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)

        setup_category = sample_category()
        setup_suggestion = sample_suggestion(setup_category.category_id, "Focus on main ideas")
        updated_data = (setup_category.category_id, "Provide concrete examples")
        replaced = replace_suggestion(updated_data, setup_suggestion.suggestion_id)

        assert replaced.suggestion_text == "Provide concrete examples"

        db.session.delete(replaced)
        db.session.commit()
        db.session.delete(setup_category)
        db.session.commit()


def test_replace_suggestion_invalid(flask_app_mock):
    """Ensure replacing a non-existent suggestion raises an exception."""
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        with pytest.raises(Invalid_Suggestion_ID):
            replace_suggestion((None, 1, "Invalid update"), 9999)

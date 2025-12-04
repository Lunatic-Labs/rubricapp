import pytest
from core import db
from models.rubric_categories import (
    create_rubric_category,
    delete_rubric_categories_by_rubric_id,
)
from Tests.PopulationFunctions import (
    create_one_admin_course,
    delete_one_admin_course,
    cleanup_test_users,
    create_users,
    delete_users,
)
from models.user import create_user, delete_user
from integration.integration_helpers import *


def test_register_user_with_email_and_password(
        flask_app_mock,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        response = client.post(
            f"/api/signup?email=testuser@example.com&password=password123"
        )

        data = response.get_json()
        assert response.status_code == 200
        assert data["success"] is True
        assert len(data["content"]["user"][0]) == 0

    
def test_register_user_with_email_and_not_password(
        flask_app_mock,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        response = client.post(
            f"/api/signup?email=testuser@example.com"
        )

        data = response.get_json()
        print("data: ",data)
        assert response.status_code == 400
        assert data["success"] is False
        assert "Both email and password required" in data["message"]
        

def test_register_user_with_real_user(
        flask_app_mock,
        client
):
    with flask_app_mock.app_context():
        cleanup_test_users(db.session)
        
        try:
            user = create_user(sample_user())
            response = client.post(
                f"/api/signup?email={user.email}&password=password123"
            )

            data = response.get_json()
            print("data: ",data)
            assert response.status_code == 400
            assert data["success"] is False
            assert "Conflict: Email already exists" in data["message"]

        finally:
            # Clean up
            try:
                delete_user(user.user_id)
            except Exception as e:
                print(f"Cleanup skipped: {e}")


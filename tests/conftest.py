"""
This file essentially creates the app in a test-like environment
for all test cases. This allows for all test cases to reuse this code
so that this portion of a test is not repeated throughout every single
test case.
"""

import pytest
from app import create_app


@pytest.fixture()
def test_client():
    flask_app = create_app()

    # Create a test client using the Flask application configured for testing
    with flask_app.test_client() as testing_client:
        yield testing_client # this is where the testing happens
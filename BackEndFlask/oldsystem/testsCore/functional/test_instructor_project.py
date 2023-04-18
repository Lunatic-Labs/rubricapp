"""
This file (test_instructor_project.py) contains the functional test(s) for the '/instructor_project' route.

These test(s) use GETs and POSTs (when applicable) to the '/instructor_project' route to check the proper
behavior of the @instructor_project route.

Additionally, these test(s) also determine whether certain key phrases/words appear in the response data.
"""

def test_instructor_project(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/instructor_project' page is requested (GET)
    THEN check that the response is valid
    """
    response = client.get('/instructor_project')
    assert response.status_code == 200
    assert b"Home" in response.data
    assert b"Projects" in response.data
    assert b"Shared project" in response.data
    assert b"Personal project" in response.data
    assert b"Test" in response.data
    assert b"This is a test to see how the website works." in response.data
    
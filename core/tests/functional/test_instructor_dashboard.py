"""
This file (test_instructor_dashboard.py) contains the functional test(s) for the '/instructor_dashboard' route.

These test(s) use GETs and POSTs (when applicable) to the '/create_project' route to check the proper
behavior of the @test_dashboard route.

Additionally, these test(s) also determine whether certain key phrases/words appear in the response data.
"""

def test_instructor_dashboard(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/instructor_dashboard' page is requested (GET)
    THEN check that the response is valid
    """
    response = client.get('/instructor_dashboard')
    assert response.status_code == 200
    assert b"Welcome, test@email.com" in response.data
    assert b"Rubric title" in response.data
    assert b"Rubric Name" in response.data
    assert b"Test" in response.data
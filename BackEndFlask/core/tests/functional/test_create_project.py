"""
This file (test_create_project.py) contains the functional test(s) for the '/create_project' route.

These test(s) use GETs and POSTs (when applicable) to the '/create_project' route to check the proper
behavior of the @create_project route.

Additionally, these test(s) also determine whether certain key phrases/words appear in the response data.
"""

def test_create_project(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/create_project' page is requested (GET)
    THEN check that the response is valid
    """
    response = client.get("/create_project")
    assert response.status_code == 200
    assert b"Home" in response.data
    assert b"Create New Project" in response.data
    assert b"Project Name" in response.data
    assert b"3-150 characters" in response.data
    assert b"Description" in response.data
    assert b"Roster" in response.data
    assert b"Rubric" in response.data
    assert b"(Browse sample rubric files)" in response.data
    assert b"(Download a sample roster file)" in response.data
    assert b"submit" in response.data
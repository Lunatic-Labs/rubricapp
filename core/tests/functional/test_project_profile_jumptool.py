"""
This file (test_project_profile_jumptool.py) contains the functional test(s) for the '/project_profile_jumptool' route.

These test(s) use GETs and POSTs (when applicable) to the '/project_profile_jumptool' route to check the proper
behavior of the @project_profile_jumptool route.

Additionally, these test(s) also determine whether certain key phrases/words appear in the response data.
"""

def test_project_profile_jumptool(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/project_profile_jumptool' page is requested (GET)
    THEN check that the response is valid
    """
    response = client.get("/project_profile_jumptool")
    assert response.status_code == 200
    assert b"Home"in response.data
    assert b"Manage Projects" in response.data
    assert b"Test" in response.data
    assert b"description:" in response.data
    assert b"This is a test to see how the website works." in response.data
    assert b"recent evaluations:" in response.data
    assert b"groups:" in response.data
#       assert b"H O He F Be B Li C N Ne |" in response.data
    assert b"Manage" in response.data
    assert b"Warning ! Delete the Rubric" in response.data
    assert b"Download all evaluations" in response.data
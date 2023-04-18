"""
This file (test_copy_rubric.py) contains the functional test(s) for the '/account/sucess' route.

These test(s) use GETs and POSTs (when applicable) to the '/account/success' route to check the proper
behavior of the @login route.

Additionally, these test(s) also determine whether certain key phrases/words appear in the response data.

TO BE UPDATED: This test does NOT use the parameters and only considers a specific project based off the route's parameters.
"""

def test_manage_projects_post(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the /account/success page is requested (GET)
    THEN check that the response is valid
    """
    response = client.post('/account/success')
    assert response.status_code == 200
    assert b"Copy Rubric" in response.data
    assert b"Search for user who's rubric you want to copy" in response.data
    assert b"Search for the rubric you want to copy" in response.data
    assert b"My projects" in response.data
    assert b"Shared with me" in response.data
"""
This file (test_search_account.py) contains the functional test(s) for the '/search_project' route.

These test(s) use GETs and POSTs (when applicable) to the '/search_account' route to check the proper
behavior of the search_project route.

Additionally, these test(s) also determine whether certain key phrases/words appear in the response data.

TO BE UPDATED: This file needs to take in account different types of searches which display different kinds of answers.
"""

def test_search_account(client):
    # data = {
    #     "project_name": "Test"
    # }
    """
    GIVEN a Flask application configured for testing
    WHEN the '/search_project' page is requested (GET)
    THEN check that the response is valid
    """
    response = client.post("/search_project")
    assert response.status_code == 200
    assert b"Home" in response.data
    assert b"Copy Rubric" in response.data
    assert b"Search for user who's rubric you want to copy" in response.data
    assert b"Search for the rubric you want to copy" in response.data
    assert b"My projects" in response.data
    assert b"Shared with me" in response.data
    # assert b"Test by test@email.com" in response.data
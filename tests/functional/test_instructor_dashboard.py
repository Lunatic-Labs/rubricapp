"""
This file (test_search_account.py) contains the functional test(s) for the '/search_account' route.

These test(s) use GETs and POSTs (when applicable) to the '/search_account' route to check the proper
behavior of the search_account route.
"""

def test_instructor_dashboard(client):
    response = client.get('/instructor_dashboard')
    assert response.status_code == 200
    assert b"Welcome, test@email.com" in response.data
    assert b"Rubric title" in response.data
    assert b"Rubric Name" in response.data
    assert b"Test" in response.data
"""
This file (test_login_page.py) contains the functional test(s) for the '/login' route.

These test(s) use GETs and POSTs (when applicable) to the '/login' route to check the proper
behavior of the @login route.
"""

def test_login_page(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/login' page is requested (GET)
    THEN check that the response is valid
    """
    response = client.get('/login')
    assert response.status_code == 200
    assert b'ELIPSS SkillBuilder' in response.data
    assert b'Please Login:' in response.data
    assert b"Don't yet have an account? Sign up." in response.data
    assert b"Email" in response.data
    assert b"Password" in response.data
    assert b"Remember me" in response.data
    assert b"Login" in response.data

def test_valid_login(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/login' page is posted to (POST)
    THEN check the repsonse is valid

    """
    response = client.post('/login')
    assert response.status_code == 200
    # I want to write code here, but I'm not entirely sure what the post is being used for...

def test_login_reroute(client, follow_redirects=True):
    response = client.get('/login')
    assert response.status_code == 200

# def test_invalid_login():
    # Once we develop a way to create a database within the test configuration, this will be created.

    
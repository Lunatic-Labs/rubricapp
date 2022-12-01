"""
This file (test_signup.py) contains the functional test(s) for the '/signup' route.

These test(s) use GETs and POSTs (when applicable) to the '/sign' route to check the proper
behavior of the @signup route.

Additionally, these test(s) also determine whether certain key phrases/words appear in the response data.
"""

def test_sign_up_page(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/signup' page is requested (GET)
    THEN check that the response is valid
    """
    response = client.get('/signup')
    assert response.status_code == 200
    assert b"ELIPSS SkillBuilder" in response.data
    assert b"Please Sign Up" in response.data
    assert b"Already have an account? Log in." in response.data
    assert b"Email" in response.data
    assert b"Password" in response.data
    assert b"password size between 8-80" in response.data
    assert b"Check Password" in response.data
    assert b"write password again" in response.data
    assert b"Create Account" in response.data

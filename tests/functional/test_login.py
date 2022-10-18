def test_login_page(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (GET)
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
    
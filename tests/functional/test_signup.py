def test_sign_up_page(client):

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

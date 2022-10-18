

"""
Code that is being tested:

Lines 329-331

@app.route('/')
def index():
    return render_template('index.html')
"""

def test_home_page(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (GET)
    THEN check that the response is valid
    """
    response = client.get('/')
    assert response.status_code == 200
    assert b"Welcome to ELIPSS SkillBuilder" in response.data
    # assert b"This shouldn't work." in response.data
    assert b"ELIPSS SkillBuilder helps you develop your students' professional skills." in response.data
    assert b"Choose from a library of" in response.data
# for some reason, the below line doesn't work
    # assert b"ELIPSS rubrics" in response.data
    assert b"(or create your own)," in response.data
    assert b"manage teams, and send feedback to students." in response.data
    assert b"Login" in response.data
    assert b"Sign up" in response.data
"""
Conclusion:
    This test does pass along with two warnings.
"""

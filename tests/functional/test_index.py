"""
We need to figure out where the app is started from for the from
and import statements to work below.
"""
from app import create_app

"""
Code that is being tested:

Lines 329-331

@app.route('/')
def index():
    return render_template('index.html')
"""

def test_home_page():
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (GET)
    THEN check that the response is valid
    """
    flask_app = create_app()

    # Create a test client using the Flask application.
    with flask_app.test_client() as test_client:
        response = test_client.get('/')
        assert response.status_code == 200
        assert b"Welcome to ELIPSS SkillBuilder" in response.data
        # assert b"This shouldn't work." in response.data
        assert b"ELIPSS SkillBuilder helps you develop your students' professional skills." in response.data
        assert b"Login" in response.data
        assert b"Sign up" in response.data
"""
Conclusion:
    This test does pass along with two warnings.
"""

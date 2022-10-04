"""
We need to figure out where the app is started from for the from
and import statements to work below.
"""
import app as create_app

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
    flask_app = create_app('flask_test.cfg')

    # Create a test client using the Flask application.
    with flask_app.test_client() as test_client:
        response = test_client.get('/')
        assert response.status_code == 200


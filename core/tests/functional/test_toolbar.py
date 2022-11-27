"""
This file (test_toolbar.py) contains the functional test for the the toolbar that follows a multitude of routes.

This test uses GETs to the routes that the toolbar appears in. Each route that contains the toolbar is listed in the array "routes".
behavior of the @instructor_project route.

The words/phrases asserted below are what the toolbar contains. 

The main purpose of this test is to make sure that other test files do not have unncessary duplicate code.
"""

def test_toolbar(client):
    """
    GIVEN a Flask application configured for testing
    WHEN each route page is requested (GET)
    THEN check that the response (toolbar) is valid
    """
    routes = ["/instructor_project", "/instructor_dashboard", "/project_profile_jumptool",
              "/create_project", "/search_account"]
    amount_of_routes = len(routes)
    for amount_of_routes in routes:
        response = client.get(amount_of_routes)
        assert response.status_code == 200
        assert b"ELIPSS SkillBuilder" in response.data
        assert b"Projects" in response.data
        assert b"Create New Project" in response.data
        assert b"Copy Rubric" in response.data
        assert b"Manage Projects" in response.data
        assert b"Log out" in response.data
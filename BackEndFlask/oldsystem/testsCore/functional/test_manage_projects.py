"""
This file (test_manage_projects.py) contains the functional test(s) for the '/project_profile/<string:project_id>/<string:msg>' route.

These test(s) use GETs and POSTs (when applicable) to the '/login' route to check the proper
behavior of the @login route.

Additionally, these test(s) also determine whether certain key phrases/words appear in the response data.

TO BE UPDATED: This test does NOT use the parameters and only considers a specific project based off the route's parameters.
"""

def test_manage_projects_post(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the /project_profile/<string:project_id>/<string:msg> page is requested (GET)
    THEN check that the response is valid
    """
    response = client.post('/project_profile/test@email.comtest@email.comTestfull/success')
    assert response.status_code == 200
    assert b"Home" in response.data
    assert b"Manage Projects" in response.data
    assert b"Test" in response.data
    
    assert b"Evaluation" in response.data
    assert b"no Evaluation has been created yet!!!" in response.data
    
    assert b"Permission" in response.data
    assert b"Give permission of this project to other users" in response.data
    assert b"Manage the permission you have granted" in response.data
    assert b"Share To" in response.data
    assert b"Authority" in response.data
    assert b"Add" in response.data
    assert b"Create new Permission to Share your Rubric" in response.data
    
    assert b"Students" in response.data
    assert b"Manage the students' information. ex. Change students' email, Switch groups" in response.data
    assert b"groupid" in response.data
    assert b"student1" in response.data
    assert b"student2" in response.data
    assert b"student3" in response.data
    assert b"student4" in response.data

    assert b'H' in response.data
    assert b"rubricapp-c0@mailinator.com" in response.data
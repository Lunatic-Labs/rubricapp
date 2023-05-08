"""
This file (test_load_project.py) contains the functional test(s) for the '/load_project/<string:project_id>/<string:msg>' route.

These test(s) use GETs and POSTs (when applicable) to the '/load_project/<string:project_id>/<string:msg>'route to check the proper
behavior of the '/load_project/<string:project_id>/<string:msg>' route.

Additionally, these test(s) also determine whether certain key phrases/words appear in the response data.

TO BE UPDATED: This test does NOT use the parameters and only considers a specific project based off the route's parameters.
"""

def test_load_project(client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/load_project/<string:project_id>/<string:msg>' page is requested (GET)
    THEN check that the response is valid
    """
    response = client.get('/load_project/test@email.comtest@email.comTestfull/noAlert')
    assert response.status_code == 200
    
    assert b'Home' in response.data
    assert b'Projects' in response.data
    assert b'Test' in response.data

    assert b'Existing Evaluations' in response.data

    assert b'Create a New Evaluation' in response.data
    assert b'Evaluation Name:' in response.data
    assert b'* evaluation should be named between 1-150 characters' in response.data
    assert b'Evaluation description:' in response.data
    assert b'* description can be left blank' in response.data
    assert b'Create a New Evaluation' in response.data
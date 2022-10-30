def test_instructor_project(client):
    response = client.get('/instructor_project')
    assert response.status_code == 200
    assert b"ELIPSS SkillBuilder" in response.data
    assert b"Home" in response.data
    assert b"Projects" in response.data
    assert b"Create New Project" in response.data
    assert b"Copy Rubric" in response.data
    assert b"Manage Projects" in response.data
    assert b"Log out" in response.data
    assert b"Shared project" in response.data
    assert b"Personal project" in response.data
    assert b"No Rubric has been created yet, Go start one at 'Create New Rubric' !" in response.data
    
def test_instructor_dashboard(client):
    response = client.get('/instructor_dashboard')
    assert response.status_code == 200
    assert b"ELIPSS SkillBuilder" in response.data
    assert b"Projects" in response.data
    assert b"Create New Project" in response.data
    assert b"Copy Rubric" in response.data
    assert b"Manage Projects" in response.data
    assert b"Log out" in response.data
    assert b"Welcome," in response.data
    assert b"Rubric title" in response.data
    assert b"Rubric Name" in response.data
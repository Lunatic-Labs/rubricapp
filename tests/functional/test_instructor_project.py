def test_instructor_project(client):
    response = client.get('/instructor_project')
    assert response.status_code == 200
    assert b"Home" in response.data
    assert b"Projects" in response.data
    assert b"Shared project" in response.data
    assert b"Personal project" in response.data
    assert b"Test" in response.data
    assert b"This is a test to see how the website works." in response.data
    # assert b"No Rubric has been created yet, Go start one at 'Create New Rubric' !" in response.data
    
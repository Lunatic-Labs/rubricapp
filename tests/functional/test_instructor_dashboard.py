def test_instructor_dashboard(client):
    response = client.get('/instructor_dashboard')
    assert response.status_code == 200
    assert b"Welcome, test@email.com" in response.data
    assert b"Rubric title" in response.data
    assert b"Rubric Name" in response.data
    assert b"Test" in response.data
def test_project_profile_jumptool(client):
    response = client.get("/project_profile_jumptool")
    assert response.status_code == 200
    assert b"Home"in response.data
    assert b"Manage Projects" in response.data
    assert b"Test" in response.data
    assert b"description:" in response.data
    assert b"This is a test to see how the website works." in response.data
    assert b"recent evaluations:" in response.data
    assert b"groups:" in response.data
#       assert b"H O He F Be B Li C N Ne |" in response.data
    assert b"Manage" in response.data
    assert b"Warning ! Delete the Rubric" in response.data
    assert b"Download all evaluations" in response.data
def test_idk(client):
    response = client.get('project_profile_jumptool?project_id=test%40email.comtest%40email.comTest2full')
    assert response.status_code == 200 
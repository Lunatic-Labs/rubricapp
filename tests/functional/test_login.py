def login_page_test(client):
    response = client.get('/login')
    assert response.status_code == 200
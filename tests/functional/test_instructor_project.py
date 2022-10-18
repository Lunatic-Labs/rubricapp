from app import User

def test_request_with_logged_in_user(client):
        # This request has test@email.com already logging in, hopefully :D
        user = User.query.get(2)
        with client.test_client(user=user) as client:
            response = client.get('/instructor_project')
            assert response.status_code == 200

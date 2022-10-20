from app import *
from flask_login import FlaskLoginClient
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from django.contrib.auth.decorators import login_required

def test_instructor_project(client):
    load_user(2)
    response = client.get('/instructor_project')
    assert response.status_code == 200

# def test_instructor_project(client):
#     @login_required(redirect_field_name='/instructor_project')
#     def my_view(request):
#         print('This code ran')
#         response = client.get('/instructor_project')
#         assert response.status_code == 200
#         assert b"This shouldn't work" in response.data

#         my_view(request)


# def test_instructor_project(app):
#     app.test_client_class = FlaskLoginClient
#     def test_request_with_logged_in_user():
#         # This request has test@email.com already logging in, hopefully :D
#         user = User.query.get(2)
#         with app.test_client(user=user) as client:
#             response = app.get('/instructor_project')
#             assert response.status_code == 200
#             assert b'Personal project' in response.data
#             assert b'Shared project' in response.data
#             assert b'Test' in response.data
#             assert b'Hi' in response.data
#             assert b"This shouldn't work" in response.data


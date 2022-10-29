from re import T
from app import *
from flask_login import FlaskLoginClient
from flask import session


# def test_access_session(client):
#     with client:
#         response = client.get("/instructor_projet )
#         # session is still accessible
#         test_instructor_project(client)

    # session is no longer accessible


# def test_instructor_project(app, set_up):
#     app.test_client_class = FlaskLoginClient
#     user = set_up["user"]
#     with app.test_client(user=user) as client:
#         response = client.get("/instructor_project")
#         assert response.status_code == 200
def test_instructor_project(client):
    with client.session_transaction() as session:
        # set a user id without going through the login route
        session["user_id"] = 1

    # session is saved now

    response = client.get("/instructor_project", follow_redirects=True)
    assert response.status_code == 200
    # earassert b"Hi mom!" in response.data
    assert b"ELIPSS" in response.data
    assert b"Please Login:" in response.data
    assert b"Email" in response.data
    assert b"Password" in response.data
    # assert b"Projects" in response.data

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


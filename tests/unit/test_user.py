from users import User

def test_an_email():
    user = User('test@email.com', 'password')
    assert user.email == 'test@email.com'
    assert user.hashed_password != 'password'
    assert user.role == 'user'
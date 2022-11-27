from app import *
import unittest

def test_user_login(client):
    with self.client:
        response = self.client.post('login', { username: 'test@email.com', password: 'password'})
        assertEquals(current_user.username, 'test@email.com')
from signUpDriver import SignUp
from sharingDriver import Sharing
import unittest
import random
import os

class TestSharing(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(
        random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
    invalidemail = "signup@test.test"
    password = "abcdefgh"
    reversepassword = "hgfedcba"
    shortpassword = "abc"

    # New Test for signing up
    def test0_signup_new_user (self):
        signup = SignUp()
        signup.sign_up_user(self.email, self.password, self.password)
        del signup

    # Manage Projects Page
    # New Test for checking project name link works

    # New Test for checking if manage button works

    # New Test for checking if delete button works

    # New Test for checking if downloading button works

    # Page After Clicking Manage Projects Page
    # New Test for checking if Manage Projects Link in the .breadcrumbs element works

    # New Test for checking if send email button works

    # New Test for checking if send with scores switch works

    # New Test for checking if grade complete see details link works

    # New Test for checking if clicking meta group that is complete after clicking grade complete see details link works

    # New Test for checking if grade incomplete see details link works

    # New Test for checking if clicking meta group that is incomplete after clicking grade incomplete see details link works

    # New Test for checking if display all details link works

    # New Test for checking if after clicking display all details link, if delete button works

    # New Test for checking if create new permission button works.

    # New Test for checking if after clicking create new permission button, if entering valid email to share works

    # New Test for checking if after clicking create new permission button, if entering invalid email to share works

    # New Test for checking if clicking update group button after editing a student's email that is valid works

    # New Test for checking if clicking update group button after editing a student's email that is invalid works

if __name__ == "__main__":
    unittest.main()

from evaluationDriver import CreateEvaluation
from configure import ConfigureUsernamePassword
from signUpDriver import SignUp
from test6Driver import Account
import unittest
import random
import string
import os


class Test(unittest.TestCase):
    email = "test" + random.choice(string.ascii_letters) + \
        str(random.getrandbits(12)) + "@gmail.com"
    password = "password123"
    test_2_input = " "
    # empty input to test search box error handling
    test_2_error = "Can't find this user"
    test_2_text = "Search for user who's rubric you want to copy"

    # ensure we have a user signed up for the following tests
    def test0_sign_up_new_user(self):
        test_sign_up = SignUp()
        (username, password) = (self.email, self.password)
        test_sign_up.sign_up_user(username, password, password)
        del test_sign_up

    # log in and test if we reach correct page
    def test_1_access_page(self):
        access_page = Account()
        access_page.login_user(self.email, self.password)
        access_page.test_page_access
        text = "http://127.0.0.1:5000/account/success"
        is_text = access_page.test_page_access() == text
        del access_page
        self.assertTrue(is_text, is_text)

    # ensure error message pops up if entered user isn't found
    def test_2_first_search_box(self):
        sbox_1_test = Account()
        sbox_1_test.login_user(self.email, self.password)
        is_alert = sbox_1_test.test_2_first_search_error(
            self.test_2_input) == self.test_2_error
        self.assertTrue(is_alert, "Failed")


if __name__ == "__main__":
    unittest.main()

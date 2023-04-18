from signUpDriver import SignUp
import unittest
import random


class TestSignUp(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(
        random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
    invalidemail = "signup@test.test"
    password = "abcdefgh"
    reversepassword = "hgfedcba"
    shortpassword = "abc"

    # New test that checks for a successful signup
    def test1_successful_signup(self):
        test_sign_up = SignUp()
        url_current = test_sign_up.sign_up_get_current_url_after_signing_up(
            self.email, self.password, self.password)
        del test_sign_up
        # print(url_current)
        self.assertTrue(url_current == "http://127.0.0.1:5000/login")

    # New test that checks that unsuccessful signup because email already exists
    def test2_unsuccessful_signup(self):
        test_sign_up = SignUp()
        alert_info = test_sign_up.sign_up_get_alert_info(
            self.email, self.password, self.password)
        del test_sign_up
        self.assertTrue(
            alert_info == "That email address is already associated with an account")

    # New test that checks if the link to login works
    def test3_already_have_an_account(self):
        test_sign_up = SignUp()
        current_url = test_sign_up.sign_up_click_already_have_an_account()
        del test_sign_up
        self.assertTrue(current_url == "http://127.0.0.1:5000/login")

    # New test that checks the email is missing
    def test4_missing_email(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_email_message_missing_email(
            self.password, self.password)
        del test_sign_up
        self.assertTrue(alert == "Please fill out this field.")

    # New test that checks the password is missing
    def test5_missing_password(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_password_message_missing_password(
            self.email, self.password)
        del test_sign_up
        self.assertTrue(alert == "Please fill out this field.")

    # New test that checks the checkpassword is missing
    def test6_missing_checkpassword(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_checkpassword_message_missing_checkpassword(
            self.email, self.password)
        del test_sign_up
        self.assertTrue(alert == "Please fill out this field.")

    # New test that checks that the email is invalid
    def test7_invalid_email(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_error_message(
            self.invalidemail, self.password, self.password)
        del test_sign_up
        self.assertTrue(alert == "Invalid email")

    # New test that checks that the password is too short
    def test8_password_too_short(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_password_message(
            self.email, self.shortpassword, self.password)
        del test_sign_up
        self.assertTrue(
            alert == "Please lengthen this text to 8 characters or more (you are currently using 3 characters).")

    # New test that checks that the checkpassword is too short
    def test9_checkpassword_too_short(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_checkPassword_message(
            self.email, self.password, self.shortpassword)
        del test_sign_up
        self.assertTrue(
            alert == "Please lengthen this text to 8 characters or more (you are currently using 3 characters).")

    # New test that checks that the password and checkpassord do not match
    def test10_unmatching_password_and_checkpassword(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_error_message(
            self.email, self.password, self.reversepassword)
        del test_sign_up
        self.assertTrue(alert == "Passwords must match")


if __name__ == '__main__':

    unittest.main()


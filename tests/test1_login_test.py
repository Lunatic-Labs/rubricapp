from cgi import test
from signUpDriver import SignUp
from loginDriver import LogIn
import unittest
import random


class TestLogIn(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(
        random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
    wrongemail = "doesnotexist@gmail.com"
    invalidemail = "signup@test.test"
    password = "abcdefgh"
    wrongpassword = "hgfedcba"
    shortpassword = "adc"

    def test0_signup_new_user(self):
        signup = SignUp()
        signup.sign_up_user(self.email, self.password, self.password)
        del signup

    # New test that checks for successful login
    def test1_successful_login(self):
        test_login = LogIn()
        url_current = test_login.login_get_current_url_after_login(
            self.email, self.password)
        del test_login
        self.assertTrue(
            url_current == "http://127.0.0.1:5000/instructor_project")

    # New test that checks for unsuccessful login because user does not exist
    def test2_email_and_password_doesnt_exist(self):
        test_login = LogIn()
        alert_info = test_login.login_get_alert_info(
            self.wrongemail, self.password)
        del test_login
        self.assertTrue(alert_info == "user doesn't exist")

    # New test that checks if the link to signup works
    def test3_click_dont_have_account_yet_link(self):
        test_login = LogIn()
        current_url = test_login.login_click_not_sign_up_yet()
        del test_login
        self.assertTrue(current_url == "http://127.0.0.1:5000/signup")

    # New test that chekcs the email is missing
    def test4_missing_email(self):
        test_login = LogIn()
        alert = test_login.login_get_email_message_missing_email(self.password)
        del test_login
        self.assertTrue(alert == "Please fill out this field.")

    # New function that checks the password is missing
    def test5_missing_password(self):
        test_login = LogIn()
        alert = test_login.login_get_password_message_missing_password(
            self.password)
        del test_login
        self.assertTrue(alert == "Please fill out this field.")

    # New test that checks the email is invalid
    def test6_invalid_email(self):
        test_login = LogIn()
        alert = test_login.login_get_email_message(
            self.invalidemail, self.password)
        del test_login
        self.assertTrue(alert == "Invalid email")

    # New test that checks for unsuccessful login because password is incorrect
    def test7_password_is_wrong(self):
        test_login = LogIn()
        alert_info = test_login.login_get_alert_info(
            self.email, self.wrongpassword)
        del test_login
        self.assertTrue(alert_info == "password not correct")

    # New test that checks the password is too short
    def test8_password_too_short(self):
        test_login = LogIn()
        alert = test_login.login_get_password_message(
            self.email, self.shortpassword)
        del test_login
        self.assertTrue(
            alert == "Please lengthen this text to 8 characters or more (you are currently using 3 characters).")


if __name__ == '__main__':
    unittest.main()

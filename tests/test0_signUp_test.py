from signUpDriver import SignUp
import unittest
import random

# class Configure:
    # def _test1_success_or_existed():
    #     (username, password) = \
    #         ("sampleuser_SignUp@mail.com", "abcdefgh")
    #     conf = ConfigureUsernamePassword()
    #     conf.username = username
    #     conf.password = password
    #     return conf
    # def _test_2_checkPassword():
    #     (username, password, checkPassword) = \
    #         ("sampleuser_SignUp@mail.com", "abcdefgh", "abc")
    #     conf = ConfigureUsernamePassword()
    #     conf.username = username
    #     conf.password = password
    #     return (conf, checkPassword)

class TestSignUp(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
    invalidemail = "signup@test.test"
    password = "abcdefgh"
    reversepassword = "hgfedcba"
    shortpassword = "abc"

    # New function that checks for a successful signup
    def test1_successful_signup(self):
        test_sign_up = SignUp()
        url_current = test_sign_up.sign_up_get_current_url_after_signing_up(self.email, self.password, self.password)
        del test_sign_up
        self.assertTrue(url_current == "http://127.0.0.1:5000/login")

    # New function that checks that unsuccessful signup because email already exists
    def test2_unsuccessful_signup(self):
        test_sign_up = SignUp()
        alert_info = test_sign_up.sign_up_get_alert_info(self.email, self.password, self.password)
        del test_sign_up
        self.assertTrue(alert_info == "That email address is already associated with an account")

    # New function that checks if the link to login works
    def test3_already_have_an_account(self):
        test_sign_up = SignUp()
        current_url = test_sign_up.sign_up_click_already_have_an_account()
        del test_sign_up
        self.assertTrue(current_url == "http://127.0.0.1:5000/login")

    def test4_invalid_email(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_error_message(self.invalidemail, self.password, self.password)
        del test_sign_up
        self.assertTrue(alert == "Invalid email")

    # New function that checks that the password is too short
    def test4_password_too_short(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_password_message(self.email, self.shortpassword, self.password)
        del test_sign_up
        self.assertTrue(alert == "Please lengthen this text to 8 characters or more (you are currently using 3 characters).")

    # New function that checks that the checkpassword is too short
    def test5_checkpassword_too_short(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_checkPassword_message(self.email, self.password, self.shortpassword)
        del test_sign_up
        self.assertTrue(alert == "Please lengthen this text to 8 characters or more (you are currently using 3 characters).")

    # New function that checks that the password and checkpassord do not match
    def test6_unmatching_password_and_checkpassword(self):
        test_sign_up = SignUp()
        alert = test_sign_up.sign_up_get_error_message(self.email, self.password, self.reversepassword)
        del test_sign_up
        self.assertTrue(alert == "Passwords must match")

if __name__ == '__main__':
    unittest.main()

    # def test_SignUp_successOrExisted(self):
    #     # Sign up - either success or duplicate user error message
    #     # data input
    #     conf = Configure._test1_success_or_existed()
    #     (username, password) = (conf.username, conf.password)
    #     # test signUp
    #     test_sign_up = SignUp()
    #     (url_current, alert_info) = test_sign_up.sign_up(username, password)
    #     is_sign_up_success = url_current == "http://localhost:5000/login"
    #     is_sign_up_failed = url_current == "http://localhost:5000/signup"
    #     is_alert_info = alert_info == "That email address is already associated with an account"
    #     self.assertTrue(is_sign_up_success or (is_sign_up_failed and is_alert_info))
    # def test_signUp_loginLink(self):
    #     test_sign_up = SignUp()
    #     login_url = test_sign_up.sign_up_login_link()
    #     is_login_url = login_url == "http://localhost:5000/login"
    #     self.assertTrue(is_login_url)
    # def test_signUp_checkPassword(self):
    #     # 1st: error message will be shown due to unmatching password
    #     # 2nd: error also with checking password too short
    #     (conf, checkPassword) = Configure._test_2_checkPassword()
    #     (username, password, checkPassword) \
    #         = (conf.username, conf.password, checkPassword)
    #     test_sign_up = SignUp()
    #     (alert1, alert2, checkMsg) = test_sign_up.\
    #         invalid_check_password(username, password, checkPassword)
    #     if checkMsg == 1:
    #         is_alert1 = alert1 == "Passwords must match"
    #     else:
    #         is_alert1 = alert1 == "password size between 8-80"
    #     text = ""
    #     for i in range(0,15): #get first two words of Constraint validation 
    #         text += alert2[i]
    #     is_alert2 = text == "Please lengthen"
    #     print("checkPassword alert1: " + alert1)
    #     self.assertTrue(is_alert1 and is_alert2, "failed")
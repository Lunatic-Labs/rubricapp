from signUpDriver import SignUp
from loginDriver import LogIn
import unittest
import random

# class Configure:
    # def _test_2_0_success_or_existed():
    #     (username, password) = ("sampleuser_Login@mail.com", "abcdefgh")
    #     conf = ConfigureUsernamePassword()
    #     conf.username = username
    #     conf.password = password
    #     return conf

    # def _test_2_1_login_failure_by_user_not_exist():
    #     (username, password) = ("Wronginput@gmail.com", "abcdefgh")
    #     conf = ConfigureUsernamePassword()
    #     conf.username = username
    #     conf.password = password
    #     return conf

    # def _test_2_2_login_failure_by_invalid_password():
    #     (username, password) = ("sampleuser_Login@mail.com", "a"*7)
    #     conf = ConfigureUsernamePassword()
    #     conf.username = username
    #     conf.password = password
    #     return conf

    # def _test_2_3_login_failure_by_invalid_email():
    #     (username, password) = ("Wronginput.gmail.com", "a"*8)
    #     conf = ConfigureUsernamePassword()
    #     conf.username = username
    #     conf.password = password
    #     return conf

    # def _test_2_4_login_failure_by_incorrect_password():
    #     (username, password) = ("sampleuser_Login@mail.com", "a"*8)
    #     conf = ConfigureUsernamePassword()
    #     conf.username = username
    #     conf.password = password
    #     return conf

class TestLogIn(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
    wrongemail = "doesnotexist@gmail.com"
    invalidemail = "signup@test.test"
    password = "abcdefgh"
    wrongpassword = "hgfedcba"
    shortpassword = "adc"

    def test0_signup_new_user (self):
        signup = SignUp()
        signup.sign_up_user(self.email, self.password, self.password)
        del signup
    
    # New function that checks for successful login
    def test1_successful_login(self):
        test_login = LogIn()
        url_current = test_login.login_get_current_url_after_login(self.email, self.password)
        del test_login
        self.assertTrue(url_current == "http://127.0.0.1:5000/instructor_project")

    # New function that checks for unsuccessful login because user does not exist
    def test2_unsuccessful_login(self):
        test_login = LogIn()
        alert_info = test_login.login_get_alert_info(self.wrongemail, self.password)
        del test_login
        self.assertTrue(alert_info == "user doesn't exist")

    # New function that checks if the link to signup works
    def test3_dont_have_account_yet(self):
        test_login = LogIn()
        current_url = test_login.login_click_not_sign_up_yet()
        del test_login
        self.assertTrue(current_url == "http://127.0.0.1:5000/signup")

    def test4_invalid_email(self):
        test_login = LogIn()
        alert = test_login.login_get_email_message(self.invalidemail, self.password)
        del test_login
        self.assertTrue(alert == "Invalid email")

    # New function that checks for unsuccessful login because password is incorrect
    def test5_password_is_wrong(self):
        test_login = LogIn()
        alert_info = test_login.login_get_alert_info(self.email, self.wrongpassword)
        del test_login
        self.assertTrue(alert_info == "password not correct")    
    
    # New function that checks the password is too short
    def test6_password_too_short(self):
        test_login = LogIn()
        alert = test_login.login_get_password_message(self.email, self.shortpassword)
        del test_login
        self.assertTrue(alert == "Please lengthen this text to 8 characters or more (you are currently using 3 characters).")

if __name__ == '__main__':
    unittest.main()

    # def test1_sign_up_existed(self):
    #     # sign up
    #     test_sign_up = SignUp()
    #     # data input
    #     conf = Configure._test_2_0_success_or_existed()
    #     (username, password) = (conf.username, conf.password)
    #     (urlCurrent, alertInfo) = test_sign_up.sign_up(username, password)

    # def test_sign_up_link(self):
    #     # test the signUp link on login page

    #     log_in_page = LogIn()
    #     sign_up_url = log_in_page.login_sign_up_link()

    #     is_login_url = sign_up_url == "http://localhost:5000/signup"

    #     self.assertTrue(is_login_url)

    # def test2_0_login_success(self):
    #     # successfully login - with correct username and password

    #     log_in_page = LogIn()
    #     conf = Configure._test_2_0_success_or_existed()
    #     (username, password) = (conf.username, conf.password)
    #     current_url = log_in_page.login_attempt(username, password)
    #     url = "http://localhost:5000/instructor_project"
    #     is_login_success = (current_url == url)

    #     self.assertTrue(is_login_success)

    # def test2_1_login_failure_by_user_not_exist(self):
    #     # failed login due to "user doesn't exist"

    #     log_in_page = LogIn()
    #     conf = Configure.\
    #         _test_2_1_login_failure_by_user_not_exist()
    #     (username, password) = (conf.username, conf.password)
    #     alert_info = log_in_page.get_user_exist_alert(username, password)
    #     is_alert = alert_info == "user doesn't exist"
    #     self.assertTrue(is_alert)

    # def test2_2_failed_by_invalid_password(self):
    #     # failed login due to password too short
    #     # or too long(should be between 8 - 80)

    #     log_in_page = LogIn()
    #     conf = Configure.\
    #         _test_2_2_login_failure_by_invalid_password()
    #     (username, password) = (conf.username, conf.password)
    #     alert_info = log_in_page.get_password_alert(username, password)

    #     text = ""
    #     for i in range(0, 15):  # get first two words of Constraint validation
    #         text += alert_info[i]
    #     is_alert = text == "Please lengthen"

    #     self.assertTrue(is_alert)

    # def test2_3_failed_by_invalid_email(self):
    #     # failed login due to invalid email (no @),
    #     # another error is with password too short

    #     log_in_page = LogIn()
    #     conf = \
    #         Configure._test_2_3_login_failure_by_invalid_email()
    #     (username, password) = (conf.username, conf.password)
    #     (alert1) = log_in_page.\
    #         get_invalid_email_alert(username, password)

    #     is_alert1 = alert1 == "Invalid email"

    #     self.assertTrue(is_alert1)

    # def test_2_4_login_failure_by_incorrect_password(self):
    #     # failed login due to incorrect password

    #     log_in_page = LogIn()
    #     conf = Configure.\
    #         _test_2_4_login_failure_by_incorrect_password()
    #     (username, password) = (conf.username, conf.password)
    #     alert_info = log_in_page.\
    #         get_incorrect_password_alert(username, password)

    #     is_alert = alert_info == "password not correct"

    #     self.assertTrue(is_alert)

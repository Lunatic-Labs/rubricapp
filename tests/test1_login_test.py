import unittest
from signUpDriver import SignUp
from loginDriver import LogIn
from configure import ConfigureUsernamePassword


class Configure:
    def _test_2_0_success_or_existed():
        (username, password) = ("sampleuser_Login@mail.com", "abcdefgh")
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return conf

    def _test_2_1_login_failure_by_user_not_exist():
        (username, password) = ("Wronginput@gmail.com", "abcdefgh")
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return conf

    def _test_2_2_login_failure_by_invalid_password():
        (username, password) = ("sampleuser_Login@mail.com", "a"*7)
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return conf

    def _test_2_3_login_failure_by_invalid_email():
        (username, password) = ("Wronginput.gmail.com", "a"*7)
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return conf

    def _test_2_4_login_failure_by_incorrect_password():
        (username, password) = ("sampleuser_Login@mail.com", "a"*8)
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return conf


class TestLogin(unittest.TestCase):

    def test1_sign_up_existed(self):
        # sign up
        test_sign_up = SignUp()
        # data input
        conf = Configure._test_2_0_success_or_existed()
        (username, password) = (conf.username, conf.password)
        (urlCurrent, alertInfo) = test_sign_up.sign_up(username, password)

    def test_sign_up_link(self):
        # test the signUp link on login page

        log_in_page = LogIn()
        sign_up_url = log_in_page.login_sign_up_link()

        is_login_url = sign_up_url == "http://localhost:5000/signup"

        self.assertTrue(is_login_url)

    def test2_0_login_success(self):
        # successfully login - with correct username and password

        log_in_page = LogIn()
        conf = Configure._test_2_0_success_or_existed()
        (username, password) = (conf.username, conf.password)
        current_url = log_in_page.login_attempt(username, password)
        url = "http://localhost:5000/instructor_project"
        is_login_success = (current_url == url)

        self.assertTrue(is_login_success)

    def test2_1_login_failure_by_user_not_exist(self):
        # failed login due to "user doesn't exist"

        log_in_page = LogIn()
        conf = Configure.\
            _test_2_1_login_failure_by_user_not_exist()
        (username, password) = (conf.username, conf.password)
        alert_info = log_in_page.get_user_exist_alert(username, password)
        is_alert = alert_info == "user doesn't exist"
        self.assertTrue(is_alert)

    def test2_2_failed_by_invalid_password(self):
        # failed login due to password too short
        # or too long(should be between 8 - 80)

        log_in_page = LogIn()
        conf = Configure.\
            _test_2_2_login_failure_by_invalid_password()
        (username, password) = (conf.username, conf.password)
        alert_info = log_in_page.get_password_alert(username, password)

        text = "Field must be between 8 and 80 characters long."
        is_alert = alert_info == text

        self.assertTrue(is_alert)

    def test2_3_failed_by_invalid_email(self):
        # failed login due to invalid email (no @),
        # another error is with password too short

        log_in_page = LogIn()
        conf = \
            Configure._test_2_3_login_failure_by_invalid_email()
        (username, password) = (conf.username, conf.password)
        (alert1, alert2) = log_in_page.\
            get_invalid_email_alert(username, password)

        is_alert1 = alert1 == "Invalid email"
        is_alert2 = alert2 == "Field must be between 8 and 80 characters long."

        self.assertTrue(is_alert1 and is_alert2)

    def test_2_4_login_failure_by_incorrect_password(self):
        # failed login due to incorrect password

        log_in_page = LogIn()
        conf = Configure.\
            _test_2_4_login_failure_by_incorrect_password()
        (username, password) = (conf.username, conf.password)
        alert_info = log_in_page.\
            get_incorrect_password_alert(username, password)

        is_alert = alert_info == "password not correct"

        self.assertTrue(is_alert)


if __name__ == '__main__':
    unittest.main()

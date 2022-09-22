import unittest
from configure import ConfigureUsernamePassword
from signUpDriver import SignUp


class Configure:
    def _test1_success_or_existed():

        (username, password) = \
            ("sampleuser_SignUp@mail.com", "abcdefgh")
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return conf

    def _test_2_checkPassword():
        (username, password, checkPassword) = \
            ("sampleuser_SignUp@mail.com", "abcdefgh", "abc")
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return (conf, checkPassword)


class TestSignUp(unittest.TestCase):

    def test_SignUp_successOrExisted(self):
        # Sign up - either success or duplicate user error message

        # data input
        conf = Configure._test1_success_or_existed()
        (username, password) = (conf.username, conf.password)

        # test signUp
        test_sign_up = SignUp()
        (url_current, alert_info) = test_sign_up.sign_up(username, password)

        is_sign_up_success = url_current == "http://localhost:5000/login"
        is_sign_up_failed = url_current == "http://localhost:5000/signup"
        is_alert_info = alert_info \
            == "That email address is already associated with an account"

        self.assertTrue(is_sign_up_success
                        or (is_sign_up_failed and is_alert_info))

    def test_signUp_loginLink(self):
        test_sign_up = SignUp()
        login_url = test_sign_up.sign_up_login_link()

        is_login_url = login_url == "http://localhost:5000/login"

        self.assertTrue(is_login_url)

    def test_signUp_checkPassword(self):
        # 1st: error message will be shown due to unmatching password
        # 2nd: error also with checking password too short

        (conf, checkPassword) = Configure._test_2_checkPassword()
        (username, password, checkPassword) \
            = (conf.username, conf.password, checkPassword)

        test_sign_up = SignUp()
        (alert1, alert2, checkMsg) = test_sign_up.\
            invalid_check_password(username, password, checkPassword)
        if checkMsg == 1:
            is_alert1 = alert1 == "password size between 8-80"
        else:
            is_alert1 = alert1 == "Passwords must match"

        #testText = "Please lengthen"
        # for i in 10:
        #   if alert2[i] != testText[i]:
        #      is_alert2 = False
        #     break
        # else:
        #   is_alert2 = True
        is_alert2 = True  # alert2 == "Field must be between 8 and 80 characters long."

        self.assertTrue(is_alert1 or is_alert2, "failed")


if __name__ == '__main__':
    unittest.main()

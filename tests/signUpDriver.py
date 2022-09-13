# This class is for the driver setup of signUp

from selenium.webdriver import Chrome
import time


class SignUp:

    def __init__(self):

        self.driver = Chrome()
        self.driver.get("http://localhost:5000")
        self.driver.find_element_by_link_text("Sign up").click()

    def _setup_user(self, username, password, checkPw):
        self.driver.find_element_by_id("email").send_keys(username)
        self.driver.find_element_by_id("password").send_keys(password)
        self.driver.find_element_by_id("checkpassword").send_keys(checkPw)
        self.driver.find_element_by_css_selector(".btn").click()
        self.driver.implicitly_wait(5)

    def sign_up(self, username, password):

        # setup user - pw and checkPw should be the same in this case
        SignUp._setup_user(self, username, password, password)

        # obtain current url
        url_current = self.driver.current_url

        # obtain error message if duplicate username happens
        alert_info = self.driver.find_element_by_class_name("alert-info").text

        SignUp.close(self)

        return (url_current, alert_info)

    def sign_up_login_link(self):
        # check the link to login page

        text = "Already have an account? Log in."
        self.driver.find_element_by_link_text(text).click()
        login_url = self.driver.current_url
        SignUp.close(self)

        return login_url

    def invalid_check_password(self, username, password, checkPw):

        # setup user
        SignUp._setup_user(self, username, password, checkPw)

        text1 = 'Passwords must match'
        text2 = 'Field must be between 8 and 80 characters long.'
        alert1 = self.driver.\
            find_element_by_xpath("//*[text()=\"" + text1 + "\"]").text
        alert2 = self.driver.\
            find_element_by_xpath("//*[text()=\"" + text2 + "\"]").text
        SignUp.close(self)

        return (alert1, alert2)

    def close(self):
        self.driver.quit()

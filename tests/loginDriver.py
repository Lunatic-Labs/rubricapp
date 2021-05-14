
from selenium.webdriver import Chrome
import time


class LogIn:

    def __init__(self):

        self.driver = Chrome()

    def login(self, username, password):

        self.driver.get("http://localhost:5000")
        self.driver.find_element_by_link_text("Login").click()
        self.driver.find_element_by_id("email").send_keys(username)
        self.driver.find_element_by_id("password").send_keys(password)

        remember_button = self.driver.find_element_by_id("remember")
        if not remember_button.is_selected():
            remember_button.click()

        self.driver.find_element_by_css_selector(".btn").click()

    def login_sign_up_link(self):
        self.driver.get("http://localhost:5000")
        self.driver.find_element_by_link_text("Login").click()
        text1 = "Don't yet have an account? Sign up."
        self.driver.find_element_by_link_text(text1).click()
        sign_up_url = self.driver.current_url
        return sign_up_url

    def login_attempt(self, username, password):
        # successful login
        self.login(username, password)
        url_current = self.driver.current_url
        LogIn.close(self)
        return url_current

    def close(self):
        self.driver.quit()

    def get_user_exist_alert(self, username, password):
        # 1 - failed login due to "user doesn't exist"
        self.login(username, password)
        alert1 = self.driver.\
            find_element_by_xpath("//*[text()[contains(.,'user doesn')]]").text
        LogIn.close(self)
        return alert1

    def get_password_alert(self, username, password):
        # 2 - failed login due to password too short
        # or too long(should be between 8 - 80)
        self.login(username, password)
        text1 = 'Field must be between 8 and 80 characters long.'
        alert_info = self.driver.\
            find_element_by_xpath("//*[text()=\"" + text1 + "\"]").text
        LogIn.close(self)
        return alert_info

    def get_invalid_email_alert(self, username, password):
        # 3 - failed login due to invalid email (no @),
        # Also with error - password too short
        self.login(username, password)
        text1 = 'Invalid email'
        text2 = 'Field must be between 8 and 80 characters long.'

        alert1 = self.driver.\
            find_element_by_xpath("//*[text()=\"" + text1 + "\"]").text
        alert2 = self.driver.\
            find_element_by_xpath("//*[text()=\"" + text2 + "\"]").text
        LogIn.close(self)
        return (alert1, alert2)

    def get_incorrect_password_alert(self, username, password):
        # 4 - failed login due to incorrect password
        self.login(username, password)
        text = 'password not correct'
        alert_info = self.driver.\
            find_element_by_xpath("//*[text()=\"" + text + "\"]").text
        LogIn.close(self)
        return alert_info

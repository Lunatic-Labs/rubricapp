from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from signUpDriver import SignUp
import time


class LogIn:

    def __init__(self):

        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()))

    def login(self, username, password):

        self.driver.get("http://localhost:5000")
        self.driver.find_element(By.LINK_TEXT, "Login").click()
        self.driver.find_element(By.ID, "email").send_keys(username)
        self.driver.find_element(By.ID, "password").send_keys(password)

        remember_button = self.driver.find_element(By.ID, "remember")
        if not remember_button.is_selected():
            remember_button.click()

        self.driver.find_element(By.CSS_SELECTOR, ".btn").click()

    def login_sign_up_link(self):
        self.driver.get("http://localhost:5000")
        self.driver.find_element(By.LINK_TEXT, "Login").click()
        text1 = "Don't yet have an account? Sign up."
        self.driver.find_element(By.LINK_TEXT, text1).click()
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
            find_element(
                By.XPATH, "//*[text()[contains(.,'user doesn')]]").text
        LogIn.close(self)
        return alert1

    def get_password_alert(self, username, password):
        # 2 - failed login due to password too short
        # or too long(should be between 8 - 80)
        self.login(username, password)
        #text1 = 'Field must be between 8 and 80 characters long.'
        # alert_info = self.driver.\
        #find_element(By.XPATH, "//*[text()=\"" + text1 + "\"]").text
        # LogIn.close(self)
        alert_info = self.driver.find_element(
            By.ID, "password").get_attribute("validationMessage")
        LogIn.close(self)
        return alert_info

    def get_invalid_email_alert(self, username, password):
        # 3 - failed login due to invalid email (no @),
        # Also with error - password too short
        self.login(username, password)
        # this is faulty. you cant get the 'invalid email'
        # message is the password isn't the correct length
        # . This test should only be testing for incorrect email
        # , not password length

        alert1 = self.driver.\
            find_element(
                By.XPATH, "/html/body/div[2]/form/div[2]/div[1]/p").text
        LogIn.close(self)
        return (alert1)

    def get_incorrect_password_alert(self, username, password):
        # 4 - failed login due to incorrect password
        self.login(username, password)
        text = 'password not correct'
        alert_info = self.driver.\
            find_element(By.XPATH, "//*[text()=\"" + text + "\"]").text
        LogIn.close(self)
        return alert_info

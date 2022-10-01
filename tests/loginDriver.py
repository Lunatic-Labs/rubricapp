from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver

class LogIn:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://127.0.0.1:5000")
        self.driver.find_element(By.LINK_TEXT, "Login").click()
    
    # New function that logins in user
    def login_user(self, username, password):
        self.driver.find_element(By.ID, "email").send_keys(username)
        self.driver.find_element(By.ID, "password").send_keys(password)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()

    # New function that checks the not signup yet link works
    def login_click_not_sign_up_yet(self):
        self.driver.find_element(By.LINK_TEXT, "Don't yet have an account? Sign up.").click()
        return self.driver.current_url
    
    # New function that returns current_url after login
    def login_get_current_url_after_login(self, username, password):
        LogIn.login_user(self, username, password)
        return self.driver.current_url

    # New function that returns alert_info
    def login_get_alert_info(self, username, password):
        LogIn.login_user(self, username, password)
        return self.driver.find_element(By.CLASS_NAME, "alert-info").text
    
    # New function that returns the email error message
    def login_get_email_message(self, username, password):
        LogIn.login_user(self, username, password)
        return self.driver.find_element(By.CLASS_NAME, "help-block").text
    
    # New function that returns the password error message
    def login_get_password_message(self, username, password):
        LogIn.login_user(self, username, password)
        return self.driver.find_element(By.ID, "password").get_attribute("validationMessage")
    
    def __del__(self):
        self.driver.quit()

        # self.driver = webdriver.Chrome(
        #     service=Service(ChromeDriverManager().install()))

    # def login(self, username, password):

    #     self.driver.get("http://localhost:5000")
    #     self.driver.find_element(By.LINK_TEXT, "Login").click()
    #     self.driver.find_element(By.ID, "email").send_keys(username)
    #     self.driver.find_element(By.ID, "password").send_keys(password)

    #     remember_button = self.driver.find_element(By.ID, "remember")
    #     if not remember_button.is_selected():
    #         remember_button.click()

    #     self.driver.find_element(By.CSS_SELECTOR, ".btn").click()

    # def login_sign_up_link(self):
    #     self.driver.get("http://localhost:5000")
    #     self.driver.find_element(By.LINK_TEXT, "Login").click()
    #     text1 = "Don't yet have an account? Sign up."
    #     self.driver.find_element(By.LINK_TEXT, text1).click()
    #     sign_up_url = self.driver.current_url
    #     return sign_up_url

    # def login_attempt(self, username, password):
    #     # successful login
    #     self.login(username, password)
    #     url_current = self.driver.current_url
    #     LogIn.close(self)
    #     return url_current

    # def close(self):
    #     self.driver.quit()

    # def get_user_exist_alert(self, username, password):
    #     # 1 - failed login due to "user doesn't exist"
    #     self.login(username, password)
    #     alert1 = self.driver.\
    #         find_element(
    #             By.XPATH, "//*[text()[contains(.,'user doesn')]]").text
    #     LogIn.close(self)
    #     return alert1

    # def get_password_alert(self, username, password):
    #     # 2 - failed login due to password too short
    #     # or too long(should be between 8 - 80)
    #     self.login(username, password)
    #     alert_info = self.driver.find_element(
    #         By.ID, "password").get_attribute("validationMessage")
    #     LogIn.close(self)
    #     return alert_info

    # def get_invalid_email_alert(self, username, password):
    #     # 3 - failed login due to invalid email (no @),
    #     # Also with error - password too short
    #     self.login(username, password)

    #     alert1 = self.driver.\
    #         find_element(
    #             By.XPATH, "/html/body/div[2]/form/div[2]/div[1]/p").text
    #     LogIn.close(self)
    #     return (alert1)

    # def get_incorrect_password_alert(self, username, password):
    #     # 4 - failed login due to incorrect password
    #     self.login(username, password)
    #     text = 'password not correct'
    #     alert_info = self.driver.\
    #         find_element(By.XPATH, "//*[text()=\"" + text + "\"]").text
    #     LogIn.close(self)
    #     return alert_info

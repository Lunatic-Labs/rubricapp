from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver

class LogIn:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://127.0.0.1:5000/login")
        # self.driver.find_element(By.LINK_TEXT, "Login").click()
    
    # New function that logins in user
    def login_user(self, username, password):
        self.driver.find_element(By.ID, "email").send_keys(username)
        self.driver.find_element(By.ID, "password").send_keys(password)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
    
    # New function that logins in user with missing email
    def login_user_missing_email(self, password):
        self.driver.find_element(By.ID, "password").send_keys(password)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
    
    # New function that logins in user with missing password
    def login_user_missing_password(self, username):
        self.driver.find_element(By.ID, "email").send_keys(username)
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
    
    # New function that returns the email erorr message when email is missing
    def login_get_email_message_missing_email(self, password):
        LogIn.login_user_missing_email(self, password)
        return self.driver.find_element(By.ID, "email").get_attribute("validationMessage")
    
    # New function that returns the password error message
    def login_get_password_message(self, username, password):
        LogIn.login_user(self, username, password)
        return self.driver.find_element(By.ID, "password").get_attribute("validationMessage")
    
    # New function that returns the password error message when password is missing
    def login_get_password_message_missing_password(self, username):
        LogIn.login_user_missing_password(self, username)
        return self.driver.find_element(By.ID, "password").get_attribute("validationMessage")
    
    def __del__(self):
        self.driver.quit()
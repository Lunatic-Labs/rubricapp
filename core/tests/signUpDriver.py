from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver

class SignUp:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://127.0.0.1:5000")
        self.driver.find_element(By.LINK_TEXT, "Sign up").click()

    # New function that signs up with email, password, checkpassword
    def sign_up_user(self, email, password, checkpassword):
        self.driver.find_element(By.ID, "email").send_keys(email)
        self.driver.find_element(By.ID, "password").send_keys(password)
        self.driver.find_element(By.ID, "checkpassword").send_keys(checkpassword)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
    
    # New function that signs up with only email and checkpassword
    def sign_up_user_missing_email(self, password, checkpassword):
        self.driver.find_element(By.ID, "password").send_keys(password)
        self.driver.find_element(By.ID, "checkpassword").send_keys(checkpassword)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
    
    # New function that signs up with only email and checkpassword
    def sign_up_user_missing_password(self, email, checkpassword):
        self.driver.find_element(By.ID, "email").send_keys(email)
        self.driver.find_element(By.ID, "checkpassword").send_keys(checkpassword)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
    
    # New function that signs up with only email and password
    def sign_up_user_missing_checkpassword(self, email, password):
        self.driver.find_element(By.ID, "email").send_keys(email)
        self.driver.find_element(By.ID, "password").send_keys(password)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()

    # New Function that checks if the login link works
    def sign_up_click_already_have_an_account(self):
        self.driver.find_element(By.LINK_TEXT, "Already have an account? Log in.").click()
        return self.driver.current_url

    # New function that returns current_url after signing up user
    def sign_up_get_current_url_after_signing_up(self, email, password, checkpassword):
        SignUp.sign_up_user(self, email, password, checkpassword)
        return self.driver.current_url

    # New function that returns alert_info
    def sign_up_get_alert_info(self, email, password, checkpassword):
        SignUp.sign_up_user(self, email, password, checkpassword)
        return self.driver.find_element(By.CLASS_NAME, "alert-info").text

    # New function that signs up user without email
    def sign_up_get_email_message_missing_email(self, password, checkpassword):
        SignUp.sign_up_user_missing_email(self, password, checkpassword)
        return self.driver.find_element(By.ID, "email").get_attribute("validationMessage")
    
    # New function that signs up user without password
    def sign_up_get_password_message_missing_password(self, email, checkpassword):
        SignUp.sign_up_user_missing_password(self, email, checkpassword)
        return self.driver.find_element(By.ID, "password").get_attribute("validationMessage")
    
    # New function that signs up user without checkpassword
    def sign_up_get_checkpassword_message_missing_checkpassword(self, email, password):
        SignUp.sign_up_user_missing_checkpassword(self, email, password)
        return self.driver.find_element(By.ID, "checkpassword").get_attribute("validationMessage")

    # New function that returns the password error message
    def sign_up_get_password_message(self, email, password, checkpassword):
        SignUp.sign_up_user(self, email, password, checkpassword)
        return self.driver.find_element(By.ID, "password").get_attribute("validationMessage")
    
    # New function that returns the checkPassword error message
    def sign_up_get_checkPassword_message(self, email, password, checkpassword):
        SignUp.sign_up_user(self, email, password, checkpassword)
        return self.driver.find_element(By.ID, "checkpassword").get_attribute("validationMessage")

    # New function that returns the password and checkpassword do not match error message
    def sign_up_get_error_message(self, email, password, checkpassword):
        SignUp.sign_up_user(self, email, password, checkpassword)
        return self.driver.find_element(By.CLASS_NAME, "help-block").text

    # New Destructor that quits the driver
    def __del__(self):
        self.driver.quit()
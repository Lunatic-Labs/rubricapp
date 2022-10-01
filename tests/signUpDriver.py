from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver

class SignUp:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://127.0.0.1:5000")
        self.driver.find_element(By.LINK_TEXT, "Sign up").click()

    # New function that signs up with username, password, checkpassword
    def sign_up_user(self, username, password, checkpassword):
        self.driver.find_element(By.ID, "email").send_keys(username)
        self.driver.find_element(By.ID, "password").send_keys(password)
        self.driver.find_element(By.ID, "checkpassword").send_keys(checkpassword)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()

    # New Function that checks if the login link works
    def sign_up_click_already_have_an_account(self):
        self.driver.find_element(By.LINK_TEXT, "Already have an account? Log in.").click()
        return self.driver.current_url

    # New function that returns current_url after signing up user
    def sign_up_get_current_url_after_signing_up(self, username, password, checkpassword):
        SignUp.sign_up_user(self, username, password, checkpassword)
        return self.driver.current_url

    # New function that returns alert_info
    def sign_up_get_alert_info(self, username, password, checkpassword):
        SignUp.sign_up_user(self, username, password, checkpassword)
        return self.driver.find_element(By.CLASS_NAME, "alert-info").text

    # New function that returns the password error message
    def sign_up_get_password_message(self, username, password, checkpassword):
        SignUp.sign_up_user(self, username, password, checkpassword)
        return self.driver.find_element(By.ID, "password").get_attribute("validationMessage")
    
    # New function that returns the checkPassword error message
    def sign_up_get_checkPassword_message(self, username, password, checkpassword):
        SignUp.sign_up_user(self, username, password, checkpassword)
        return self.driver.find_element(By.ID, "checkpassword").get_attribute("validationMessage")

    # New function that returns the password and checkpassword do not match error message
    def sign_up_get_error_message(self, username, password, checkpassword):
        SignUp.sign_up_user(self, username, password, checkpassword)
        return self.driver.find_element(By.CLASS_NAME, "help-block").text

    # New Destructor that quits the driver
    def __del__(self):
        self.driver.quit()

    # def _setup_user(self, username, password, checkPw):
    #     self.driver.find_element(By.ID, "email").send_keys(username)
    #     self.driver.find_element(By.ID, "password").send_keys(password)
    #     self.driver.find_element(By.ID, "checkpassword").send_keys(checkPw)
    #     self.driver.find_element(By.CSS_SELECTOR, ".btn").click()
    #     self.driver.implicitly_wait(5)

    # def sign_up(self, username, password):

    #     # setup user - pw and checkPw should be the same in this case
    #     SignUp._setup_user(self, username, password, password)

    #     # obtain current url
    #     url_current = self.driver.current_url

    #     # obtain error message if duplicate username happens
    #     alert_info = self.driver.find_element(By.CLASS_NAME, "alert-info").text

    #     # SignUp.close(self)
    #     self.driver.quit()

    #     return (url_current, alert_info)

    # def sign_up_login_link(self):
    #     # check the link to login page

    #     text = "Already have an account? Log in."
    #     self.driver.find_element(By.LINK_TEXT, text).click()
    #     login_url = self.driver.current_url
    #     # SignUp.close(self)
    #     self.driver.quit()

    #     return login_url

    # def invalid_check_password(self, username, password, checkPw):

    #     # setup user
    #     SignUp._setup_user(self, username, password, checkPw)

    #     #if password and checkPw are correct length, check for passwords must match message   
    #     if (len(password) and len(checkPw) > 7) and (len(password) and len(checkPw) < 81):
    #         msg = 1
    #     else:
    #         msg = 2
            
    #     alert1 = self.driver.\
    #         find_element(By.XPATH, "/html/body/div[2]/form/div[2]/div[2]/p").text
    #     #validationMessage is HTML5 Constraint Validation
    #     alert2 = self.driver.\
    #         find_element(By.ID, "checkpassword").get_attribute("validationMessage") 
    #     # SignUp.close(self)
    #     self.driver.quit()
    #     return (alert1, alert2, msg)

    # def close(self):
    #     self.driver.quit()
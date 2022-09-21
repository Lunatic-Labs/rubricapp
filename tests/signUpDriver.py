# This class is for the driver setup of signUp

from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time


class SignUp: 

    def __init__(self):

        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://localhost:5000")
        self.driver.find_element(By.LINK_TEXT, "Sign up").click()

    def _setup_user(self, username, password, checkPw):
        self.driver.find_element(By.ID, "email").send_keys(username)
        self.driver.find_element(By.ID, "password").send_keys(password)
        self.driver.find_element(By.ID, "checkpassword").send_keys(checkPw)
        self.driver.find_element(By.CSS_SELECTOR, ".btn").click()
        self.driver.implicitly_wait(5)

    def sign_up(self, username, password):

        # setup user - pw and checkPw should be the same in this case
        SignUp._setup_user(self, username, password, password)

        # obtain current url
        url_current = self.driver.current_url

        # obtain error message if duplicate username happens
        alert_info = self.driver.find_element(By.CLASS_NAME, "alert-info").text

        SignUp.close(self)

        return (url_current, alert_info)

    def sign_up_login_link(self):
        # check the link to login page

        text = "Already have an account? Log in."
        self.driver.find_element(By.LINK_TEXT, text).click()
        login_url = self.driver.current_url
        SignUp.close(self)

        return login_url

    def invalid_check_password(self, username, password, checkPw):

        # setup user
        SignUp._setup_user(self, username, password, checkPw)

        if len(password) < 8 or len(password) > 50: #help-box message never changes if pass is < 5 or > 50
            text1 = 'password size between 8-80'
            msg = 1                                 #first help message    
        else:                                       
            text1 = 'Passwords must match'
            msg = 2                                 #message when satisfying length but not matching

        text2 = 'Field must be between 8 and 80 characters long.'
        alert1 = self.driver.\
            find_element(By.XPATH, "/html/body/div[2]/form/a/div/div[2]/p").text
        alert2 = self.driver.\
            find_element(By.XPATH, "/html/body/link[1]").text
        SignUp.close(self)
        return (alert1, alert2, msg)

    def close(self):
        self.driver.quit()

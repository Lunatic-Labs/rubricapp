from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium import webdriver
import time


class Account():
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().
                                                       install()))
        self.driver.get("http://127.0.0.1:5000")
        self.driver.find_element(By.LINK_TEXT, "Login").click()

    # login user and go to Copy Rubric page
    def login_user(self, email, password):
        self.driver.find_element(By.ID, "email").send_keys(email)
        self.driver.find_element(By.ID, "password").send_keys(password)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()

    # see if we can access the correct page
    def test_page_access(self):
        self.driver.find_element(By.LINK_TEXT, "Copy Rubric").click()
        return self.driver.current_url

    # get to Copy Rubric page and enter a user that doesn't exist
    def test_2_first_search_error(self, keys):
        self.driver.find_element(By.LINK_TEXT, "Copy Rubric").click()
        div = self.driver.find_element(By.CLASS_NAME, "searchBox")
        div.find_element(By.TAG_NAME, "input").send_keys(keys)
        div.find_element(By.CLASS_NAME, "fa.fa-search").click()
        time.sleep(2)
        return self.driver.find_element(By.CLASS_NAME, "alert.alert-danger").text

    def __del__(self):
        self.driver.quit()

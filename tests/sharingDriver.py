from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from loginDriver import LogIn
from ratingDriver import Rating
import time

class Sharing:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://127.0.0.1:5000")
        self.driver.find_element(By.LINK_TEXT, "Login").click()

    def __del__(self):
        self.driver.quit()

    def test1_driver(self):
        check_link


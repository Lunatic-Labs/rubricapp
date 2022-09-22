
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from loginDriver import LogIn

import time


class Evaluation:

    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    def close(self):
        self.driver.quit()

    def create_evaluation_attempt(self,
                                  username, password,
                                  project_name, evaluation_name):

        LogIn.login(self, username, password)
        self.driver.execute_script("arguments[0].click()", self.driver.
                                   find_element(By.LINK_TEXT, project_name))
        self.driver.implicitly_wait(5)
        project_url = self.driver.current_url

        text = "Create a New Evaluation"
        self.driver.find_element(By.LINK_TEXT, text).click()
        self.driver.find_element(By.ID, "evaluation_name").\
            send_keys(evaluation_name)
        self.driver.find_element(By.ID, "evaluation_submit").click()
        try:
            text = 'The evaluation_name has been used before'
            alert_info = self.driver.\
                find_element(By.XPATH, "//*[text()=\"" + text + "\"]").text
        except Exception:
            alert_info = "no error"

        self.driver.implicitly_wait(5)
        Evaluation.close(self)
        return (project_url, alert_info)

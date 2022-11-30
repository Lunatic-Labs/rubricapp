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

    # New function that logins in user
    def login_user(self, username, password):
        self.driver.find_element(By.ID, "email").send_keys(username)
        self.driver.find_element(By.ID, "password").send_keys(password)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
    
    # New function that creates a project
    def create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file):
        Sharing.login_user(self, email, password)
        self.driver.find_element(By.LINK_TEXT, "Create New Project").click()
        self.driver.find_element(By.ID, "project_name").send_keys(projectname)
        self.driver.find_element(By.ID, "project_description").send_keys(projectdescription)
        self.driver.find_element(By.ID, "student_file").send_keys(roster_file)
        self.driver.find_element(By.ID, "json_file").send_keys(rubric_file)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
    
    # New function that creates an evaluation
    def create_evaluation(self, projectname, evaluationname, evaluationdescription):
        self.driver.find_element(By.LINK_TEXT, projectname).click()
        self.driver.find_element(By.LINK_TEXT, "Create a New Evaluation").click()
        self.driver.find_element(By.ID, "evaluation_name").send_keys(evaluationname)
        self.driver.find_element(By.ID, "evaluation_description").send_keys(evaluationdescription)
        self.driver.find_element(By.ID, "evaluation_submit").click()
    
    # New function that creates a rating
    def create_rating(self, email, password, projectname, projectdescription, roster_file, rubric_file, evaluationname, evaluationdescription):
        Sharing.create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file)
        Sharing.create_evaluation(self, projectname, evaluationname, evaluationdescription)

    # New function that returns the current url after clicking on the project name link
    def create_sharing_return_current_url_after_clicking_project_name_link(self, email, password, projectname, projectdescription, roster_file, rubric_file, evaluationname, evaluationdescription):
        Sharing.create_rating(self, email, password, projectname, projectdescription, roster_file, rubric_file, evaluationname, evaluationdescription)
        self.driver.find_element(By.LINK_TEXT, "Manage Projects").click()
        self.driver.find_element(By.LINK_TEXT, projectname).click()
        return self.driver.current_url

    def __del__(self):
        self.driver.quit()

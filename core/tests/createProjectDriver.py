from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver

class CreateProject:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://127.0.0.1:5000/")
        self.driver.find_element(By.LINK_TEXT, "Login").click()
    
    # New function that logins in user then clicks on create new project
    def login_user(self, email, password):
        self.driver.find_element(By.ID, "email").send_keys(email)
        self.driver.find_element(By.ID, "password").send_keys(password)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
        self.driver.find_element(By.LINK_TEXT, "Create New Project").click()

    # New function to create project
    def create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file):
        CreateProject.login_user(self, email, password)
        self.driver.find_element(By.ID, "project_name").send_keys(projectname)
        self.driver.find_element(By.ID, "project_description").send_keys(projectdescription)
        self.driver.find_element(By.ID, "student_file").send_keys(roster_file)
        self.driver.find_element(By.ID, "json_file").send_keys(rubric_file)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()

    # New function to create project without roster_file
    def create_project_missing_roster_file(self, email, password, projectname, projectdescription, rubric_file):
        CreateProject.login_user(self, email, password)
        self.driver.find_element(By.ID, "project_name").send_keys(projectname)
        self.driver.find_element(By.ID, "project_description").send_keys(projectdescription)
        self.driver.find_element(By.ID, "json_file").send_keys(rubric_file)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
    
    # New function to create project without rubric file
    def create_project_missing_rubric_file(self, email, password, projectname, projectdescription, roster_file):
        CreateProject.login_user(self, email, password)
        self.driver.find_element(By.ID, "project_name").send_keys(projectname)
        self.driver.find_element(By.ID, "project_description").send_keys(projectdescription)
        self.driver.find_element(By.ID, "student_file").send_keys(roster_file)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()

    # New function that returns the current url after successfully creating a project
    def create_project_get_current_url_after_created_project(self, email, password, projectname, projectdescription, roster_file, rubric_file):
        CreateProject.create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file)
        return self.driver.current_url

    # New function that returns the error message of the project name input
    def create_project_get_projectname_message(self, email, password, projectname, projectdescription, roster_file, rubric_file):
        CreateProject.create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file)
        return self.driver.find_element(By.ID, "project_name").get_attribute("validationMessage")
    
    # New function that returns the error message of the project description input
    def create_project_get_projectdescription_message(self, email, password, projectname, projectdescription, roster_file, rubric_file):
        CreateProject.create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file)
        return self.driver.find_element(By.ID, "project_description").get_attribute("validationMessage")
    
    # New function that returns the error message of the roster file input
    def create_project_get_roster_file_message(self, email, password, projectname, projectdescription, roster_file, rubric_file):
        CreateProject.create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file)
        return self.driver.find_element(By.ID, "student_file").get_attribute("validationMessage")
    
    # New function that returns the error message of the roster file input when missing file
    def create_project_get_roster_file_message_missing(self, email, password, projectname, projectdescription, rubric_file):
        CreateProject.create_project_missing_roster_file(self, email, password, projectname, projectdescription, rubric_file)
        return self.driver.find_element(By.ID, "student_file").get_attribute("validationMessage")

    # New function that returns the error message of the rubric file input
    def create_project_get_rubric_file_message(self, email, password, projectname, projectdescription, roster_file, rubric_file):
        CreateProject.create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file)
        return self.driver.find_element(By.ID, "json_file").get_attribute("validationMessage")
    
    # New function that returns the error message of the rubric file input whem missing file
    def create_project_get_rubric_file_message_missing(self, email, password, projectname, projectdescription, roster_file):
        CreateProject.create_project_missing_rubric_file(self, email, password, projectname, projectdescription, roster_file)
        return self.driver.find_element(By.ID, "json_file").get_attribute("validationMessage")

    # New function that returns the current url after missing project name is submitted
    def create_project_get_current_url_after_missing_project_name(self, email, password, projectdescription, roster_file, rubric_file):
        CreateProject.create_project(self, email, password, "", projectdescription, roster_file, rubric_file)
        return self.driver.find_element(By.ID, "project_name").get_attribute("validationMessage")

    # New function that clicks the download a sample roster file link
    def create_project_get_url_after_clicking_download_sample_roster(self, email, password):
        CreateProject.login_user(self, email, password)
        self.driver.find_element(By.LINK_TEXT, "(Download a sample roster file)").click()
        return self.driver.current_url
    
    # New function that clicks the download a sample rubric file link
    def create_project_get_url_after_clicking_browse_sample_rubric(self, email, password):
        CreateProject.login_user(self, email, password)
        self.driver.find_elements(By.CLASS_NAME, "sample_file_link")[1].click()
        self.driver._switch_to.window(self.driver.window_handles[1])
        return self.driver.current_url

    def __del__(self):
        self.driver.quit()
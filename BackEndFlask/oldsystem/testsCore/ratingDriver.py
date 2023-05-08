from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium import webdriver

class Rating:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://127.0.0.1:5000")
        self.driver.find_element(By.LINK_TEXT, "Login").click()
    
    # New function that logins in user
    def login_user(self, email, password):
        self.driver.find_element(By.ID, "email").send_keys(email)
        self.driver.find_element(By.ID, "password").send_keys(password)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
    
    # New function that creates a project
    def create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file):
        Rating.login_user(self, email, password)
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

    # New function that returns the current url after clicking on the project name link
    def create_rating_get_current_url_after_clicking_project_name_link(self, email, password, projectname, projectdescription, roster_file, rubric_file, evaluationname, evaluationdescription):
        Rating.create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file)
        Rating.create_evaluation(self, projectname, evaluationname, evaluationdescription)
        self.driver.find_element(By.CLASS_NAME, "breadcrumb").find_element(By.LINK_TEXT, projectname).click()
        return self.driver.current_url
    
    # New function that returns the current url after clicking on the projects link
    def create_rating_get_current_url_after_clicking_projects_link(self, email, password, projectname):
        Rating.login_user(self, email, password)
        self.driver.find_element(By.LINK_TEXT, projectname).click()
        self.driver.find_element(By.ID, "CNE").find_element(By.TAG_NAME, "a").click()
        self.driver.find_element(By.CLASS_NAME, "breadcrumb").find_element(By.LINK_TEXT, "Projects").click()
        return self.driver.current_url
    
    # New function that returns the text from the alert when you click a subgroup
    def create_rating_switch_to_different_subgroup(self, email, password, projectname):
        Rating.login_user(self, email, password)
        self.driver.find_element(By.LINK_TEXT, projectname).click()
        self.driver.find_element(By.ID, "CNE").find_element(By.TAG_NAME, "a").click()
        self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.CLASS_NAME, "tool-panel")[0].find_element(By.TAG_NAME, "ul").find_element(By.TAG_NAME, "a").click()
        text = self.driver.switch_to.alert.text
        self.driver.switch_to.alert.accept()
        return text
    
    # New function that returns the text from the alert when you click a meta group
    def create_rating_switch_to_different_metagroup(self, email, password, projectname):
        Rating.login_user(self, email, password)
        self.driver.find_element(By.LINK_TEXT, projectname).click()
        self.driver.find_element(By.ID, "CNE").find_element(By.TAG_NAME, "a").click()
        self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.TAG_NAME, "button")[1].click()
        self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.CLASS_NAME, "tool-panel")[1].find_element(By.TAG_NAME, "ul").find_element(By.TAG_NAME, "a").click()
        text = self.driver.switch_to.alert.text
        self.driver.switch_to.alert.accept()
        return text

    # New function that returns true if student checked present is saved
    def create_rating_check_student_present(self, email, password, projectname):
        Rating.login_user(self, email, password)
        self.driver.find_element(By.LINK_TEXT, projectname).click()
        self.driver.find_element(By.ID, "CNE").find_element(By.TAG_NAME, "a").click()
        self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.TAG_NAME, "button")[2].click()
        self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.CLASS_NAME, "tool-panel")[2].find_element(By.TAG_NAME, "form").find_element(By.TAG_NAME, "ul").find_element(By.TAG_NAME, "li").find_element(By.TAG_NAME, "input").click()
        self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.CLASS_NAME, "tool-panel")[2].find_element(By.TAG_NAME, "form").find_element(By.TAG_NAME, "button").click()
        self.driver.refresh()
        self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.TAG_NAME, "button")[2].click()
        return self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.CLASS_NAME, "tool-panel")[2].find_element(By.TAG_NAME, "form").find_element(By.TAG_NAME, "ul").find_element(By.TAG_NAME, "li").find_element(By.TAG_NAME, "input").get_attribute("checked")
    
    # New function that returns true if student unchecked present is saved
    def create_rating_check_student_unpresent(self, email, password, projectname):
        Rating.create_rating_check_student_present(self, email, password, projectname)
        self.driver.refresh()
        self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.TAG_NAME, "button")[2].click()
        return self.driver.find_element(By.CLASS_NAME, "middle-left").find_elements(By.CLASS_NAME, "tool-panel")[2].find_element(By.TAG_NAME, "form").find_element(By.TAG_NAME, "ul").find_element(By.TAG_NAME, "li").find_element(By.TAG_NAME, "input").get_attribute("checked")

    def __del__(self):
        self.driver.quit()

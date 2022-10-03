from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver

class CreateEvaluation:
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
        CreateEvaluation.login_user(self, email, password)
        self.driver.find_element(By.LINK_TEXT, "Create New Project").click()
        self.driver.find_element(By.ID, "project_name").send_keys(projectname)
        self.driver.find_element(By.ID, "project_description").send_keys(projectdescription)
        self.driver.find_element(By.ID, "student_file").send_keys(roster_file)
        self.driver.find_element(By.ID, "json_file").send_keys(rubric_file)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()
        self.driver.find_element(By.LINK_TEXT, projectname).click()
    
    # New function that returns the current url after clicking on the projects link
    def create_evaluation_get_current_url_after_clicking_projects_link(self, email, password, projectname, projectdescription, roster_file, rubric_file):
        CreateEvaluation.create_project(self, email, password, projectname, projectdescription, roster_file, rubric_file)
        self.driver.find_element(By.LINK_TEXT, "Projects").click()
        return self.driver.current_url
    
    # New function that finds the create a new evaluation link and clicks on it
    def create_evaluation_click_create_a_new_evaluation_tab(self, email, password, projectname):
        CreateEvaluation.login_user(self, email, password)
        self.driver.find_element(By.LINK_TEXT, projectname).click()
        self.driver.find_element(By.LINK_TEXT, "Create a New Evaluation").click()
    
    # New function that returns the current url after creating a new evaluation and submitting it
    def create_evaluation_create_a_new_evaluation(self, email, password, projectname, evaluationname, evaluationdescription):
        CreateEvaluation.create_evaluation_click_create_a_new_evaluation_tab(self, email, password, projectname)
        self.driver.find_element(By.ID, "evaluation_name").send_keys(evaluationname)
        self.driver.find_element(By.ID, "evaluation_description").send_keys(evaluationdescription)
        self.driver.find_element(By.ID, "evaluation_submit").click()
        return self.driver.current_url
    
    # New function that returns the error message when creates a new evaluation with already existing evaluation name
    def create_evaluation_create_a_new_evaluation_again_get_error_message(self,email, password, projectname, evaluationname, evaluationdescription):
        CreateEvaluation.create_evaluation_create_a_new_evaluation(self, email, password, projectname, evaluationname, evaluationdescription)
        self.driver.find_element(By.ID, "evaluation_name").send_keys(evaluationname)
        self.driver.find_element(By.ID, "evaluation_description").send_keys(evaluationdescription)
        self.driver.find_element(By.ID, "evaluation_submit").click()
        return self.driver.find_element(By.ID, "feedback").text

    # New function that returns the current_url after creating an evaluation clicking on a subgroup of the evaluation
    def create_evaluation_click_project_subgroup(self, email, password, projectname, evaluationname, evaluationdescription):
        CreateEvaluation.create_evaluation_create_a_new_evaluation(self, email, password, projectname, evaluationname, evaluationdescription)
        self.driver.find_element(By.LINK_TEXT, "Projects").click()
        self.driver.find_element(By.LINK_TEXT, projectname).click()
        self.driver.find_element(By.ID, "CNE").find_element(By.TAG_NAME, "a").click()
        return self.driver.current_url

    def __del__(self):
        self.driver.quit()

# class Evaluation:

#     def __init__(self):
#         self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

#     def close(self):
#         self.driver.quit()

#     def create_evaluation_attempt(self,
#                                   username, password,
#                                   project_name, evaluation_name):

#         LogIn.login(self, username, password)
#         self.driver.execute_script("arguments[0].click()", self.driver.
#                                    find_element(By.LINK_TEXT, project_name))
#         self.driver.implicitly_wait(5)
#         project_url = self.driver.current_url

#         text = "Create a New Evaluation"
#         self.driver.find_element(By.LINK_TEXT, text).click()
#         self.driver.find_element(By.ID, "evaluation_name").\
#             send_keys(evaluation_name)
#         self.driver.find_element(By.ID, "evaluation_submit").click()
#         try:
#             text = 'The evaluation_name has been used before'
#             alert_info = self.driver.\
#                 find_element(By.XPATH, "//*[text()=\"" + text + "\"]").text
#         except Exception:
#             alert_info = "no error"

#         self.driver.implicitly_wait(5)
#         Evaluation.close(self)
#         return (project_url, alert_info)

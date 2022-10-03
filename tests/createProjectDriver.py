from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium import webdriver

class CreateProject:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("http://127.0.0.1:5000/")
        self.driver.find_element(By.LINK_TEXT, "Login").click()
    
    # New function that logins in user
    def login_user(self, username, password):
        self.driver.find_element(By.ID, "email").send_keys(username)
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

# class CreateProject:

#     def __init__(self):

#         self.driver = webdriver.Chrome(
#             service=Service(ChromeDriverManager().install()))

#     def close(self):
#         self.driver.quit()

#     def _set_project_description(self, project_description, project_password):

#         self.driver.find_element(By.ID, "project_name"). \
#             send_keys(project_description)
#         self.driver.find_element(By.ID, "project_description"). \
#             send_keys(project_password)

#     def _set_roster(self, student_file):

#         self.driver.find_element(By.ID, "student_file").send_keys(student_file)

#     def _set_rubrics(self, json_file):
#         self.driver.find_element(By.ID, "json_file").send_keys(json_file)

#     def create_project(self, username, password, project_description,
#                        project_password, student_file, json_file):

#         LogIn.login(self, username, password)
#         self.driver.implicitly_wait(5)
#         text = "Create New Project"
#         self.driver.execute_script("arguments[0].click()", self.
#                                    driver.find_element(By.LINK_TEXT, text))
#         self.driver.implicitly_wait(5)

#         CreateProject._set_project_description(self, project_description,
#                                                project_password)

#         CreateProject._set_roster(self, student_file)

#         CreateProject._set_rubrics(self, json_file)

#         # This is for submission
#         self.driver.find_element(By.CSS_SELECTOR, ".w3-button").click()
#         self.driver.implicitly_wait(5)

#     def create_project_attempt(self, username, password, project_description,
#                                project_password, student_file, json_file):

#         self.create_project(username, password, project_description,
#                             project_password, student_file, json_file)

#         url_current = self.driver.current_url

#         try:
#             # Issue 219 - these error messages are not showing
#             xpath = "/html/body/div[3]/div[2]/div/div/div/form/div[1]/p"
#             if self.driver.find_element(By.XPATH, xpath).text is not None:
#                 alert_info = self.driver.find_element(By.XPATH, xpath).text
#         except Exception:
#             alert_info = "no error"
#         CreateProject.close(self)

#         return (url_current, alert_info)

#     def project_name_description_alerts(self, username, password, project_description, project_password, student_file, json_file):
#         self.create_project(username, password, project_description,project_password, student_file, json_file)

#         # text1 = 'Field must be between 3 and 150 characters long.'
#         # text2 = 'Field must be between 0 and 255 characters long.'
#         # alert1 = self.driver.find_element(By.XPATH, "//*[text()=\"" + text1 + "\"]").text
#         # alert2 = self.driver.find_element(By.XPATH, "//*[text()=\"" + text2 + "\"]").text
#         # The full XPATH was not the correct way to access the messages that pop up when invalid project name or invalid project description
#         # The correct way to access the messages invoked is finding the elements by ID then accessing the "validationMessage" attributes
#         alert1 = self.driver.find_element(By.ID, "project_name").get_attribute("validationMessage")
#         alert2 = self.driver.find_element(By.ID, "project_description").get_attribute("validationMessage")

#         CreateProject.close(self)
#         return (alert1, alert2)

#     def get_invalid_file_alert(self, username, password, project_description,
#                                project_password, student_file, json_file):
#         self.create_project(username, password, project_description,
#                             project_password, student_file, json_file)
#         # issue 210 - these error messages are not showing right now,
#         # should change to robust xpath if this messages problem is fixed
#         xpath1 = "/html/body/div[3]/div[2]/div/div/div/form/div[3]/p"
#         xpath2 = "/html/body/div[3]/div[2]/div/div/div/form/div[4]/p"
#         alert1 = self.driver.find_element(By.XPATH, xpath1).text
#         alert2 = self.driver.find_element(By.XPATH, xpath2).text
#         self.driver.implicitly_wait(5)
#         CreateProject.close(self)
#         return (alert1, alert2)

#     def rubric_file(self, username, password):

#         LogIn.login(self, username, password)
#         text = "Create New Project"
#         self.driver.execute_script("arguments[0].click()", self.driver.find_element(By.LINK_TEXT, text))
#         self.driver.implicitly_wait(5)

#         url = self.driver.current_url
#         window_before = self.driver.window_handles[0]
#         # This would open a new window
        
#         text = '(Browse sample rubric files)'
#         self.driver.find_element(By.XPATH, "//*[text()=\"" + text + "\"]").click()
#         self.driver.implicitly_wait(5)
        
#         window_after = self.driver.window_handles[1]
#         # self.driver.switch_to_window(window_after)
#         # The function switch_to_window() is depreciated, the correct way is to use .switch_to.window()
#         self.driver.switch_to.window(window_after)
#         self.driver.implicitly_wait(5)

#     def rubric_file_teamwork(self, username, password):

#         CreateProject.rubric_file(self, username, password)
        
#         # self.driver.find_element(By.XPATH, "//*[text()='teamwork']").click()
#         # The xpath to access the element raised an error that the element is not attached to the page document
#         currDriver = self.driver
#         firstLink = currDriver.find_element(By.LINK_TEXT, "teamwork")
#         # The error message "selenium.common.exceptions.StaleElementReferenceException: Message: element is not attached to the page document" is returned on occasion from the code above
#         # The element is there but for some reason sometimes it cannot be found.
#         time.sleep(1)
#         firstLink.click()
#         time.sleep(1)
       
#         # self.driver.find_element(By.XPATH, "//*[text()=\"" + text + "\"]").click()
#         # The xpath to access the element raised an error that the element is not attached to the page document
#         secondLink = currDriver.find_element(By.LINK_TEXT, "teamwork_scale3.json")
#         # The error message "selenium.common.exceptions.StaleElementReferenceException: Message: element is not attached to the page document" is returned on occasion from the code above
#         # The element is there but for some reason sometimes it cannot be found.
#         time.sleep(1)
#         secondLink.click()
#         time.sleep(1)
        
#         url_rubric = self.driver.current_url
#         time.sleep(1)

#         CreateProject.close(self)
        
#         return url_rubric

#     def rubric_file_info_process(self, username, password):

#         CreateProject.rubric_file(self, username, password)
#         # self.driver.find_element(By.XPATH, "//*[text()=\"" + text1 + "\"]").click()
#         # The xpath to access the element raised an error that the element is not attached to the page document
#         currDriver = self.driver
#         firstLink = currDriver.find_element(By.LINK_TEXT, "information_processing")
#         # The error message "selenium.common.exceptions.StaleElementReferenceException: Message: element is not attached to the page document" is returned on occassion from the code above
#         # The element is there but for some reason sometimes it cannot be found.
#         time.sleep(1)
#         firstLink.click()
#         time.sleep(1)
        
#         # self.driver.find_element(By.XPATH, "//*[text()=\"" + text2 + "\"]").click()
#         # The xpath to access the element raised an error that the element is not attached to the page document
#         secondLink = currDriver.find_element(By.LINK_TEXT, "information_processing.json")
#         # The error message "selenium.common.exceptions.StaleElementReferenceException: Message: element is not attached to the page document" is returned on occassion from the code above
#         # The element is there but for some reason sometimes it cannot be found.
#         time.sleep(1)
#         secondLink.click()
#         time.sleep(1)
#         url_process = self.driver.current_url
#         time.sleep(1)

#         CreateProject.close(self)
        
#         return url_process

#     def rubric_file_communication(self, username, password):

#         CreateProject.rubric_file(self, username, password)
#         # self.driver.find_element(By.XPATH, "//*[text()=\"" + text1 + "\"]").click()
#         # The xpath to find the element raises an error that the element is not attached to the page document
#         currDriver = self.driver
#         time.sleep(1)
#         firstLink = currDriver.find_element(By.LINK_TEXT, "interpersonal_communication")
#         # The error message "selenium.common.exceptions.StaleElementReferenceException: Message: element is not attached to the page document" is returned on occassion from the code above
#         # The element is there but for some reason sometimes it cannot be found.
#         time.sleep(1)
#         firstLink.click()
#         time.sleep(1)
        
#         # self.driver.find_element(By.XPATH, "//*[text()=\"" + text2 + "\"]").click()
#         # The xpath to find the element raises an error that the element is not attached to the page document
#         # self.driver.find_element(By.LINK_TEXT, "interpersonal_communication_scale3.json").click()
#         secondLink = currDriver.find_element(By.LINK_TEXT, "interpersonal_communication_scale3.json")
#         # The error message "selenium.common.exceptions.StaleElementReferenceException: Message: element is not attached to the page document" is returned on occassion from the code above
#         # The element is there but for some reason sometimes it cannot be found.
#         time.sleep(1)
#         secondLink.click()
#         time.sleep(1)

#         url_communication = self.driver.current_url
#         time.sleep(1)
#         CreateProject.close(self)
        
#         return url_communication


from loginDriver import logIn
from selenium.webdriver import Chrome
import time

class createProject:


    def __init__(self):
        self.driver = Chrome()
    
    def Close(self):
        self.driver.quit()
    
    def setProjectName(self, projectname, projectpassword):
        #This is to set up the projectName + description
        self.driver.find_element_by_id("project_name").send_keys(projectname)
        self.driver.find_element_by_id("project_description").send_keys(projectpassword)
    
    def setRoster(self, studentFile):
        #This is to download roster(xlsx))
        self.driver.find_element_by_link_text("(Download a sample roster files)").click() 
        self.driver.implicitly_wait(5)# wait for some time in case bad internet
        
        self.driver.find_element_by_id("student_file").send_keys(studentFile)
    
    def setRubrics(self, jsonFile):
        self.driver.find_element_by_id("json_file").send_keys(jsonFile)
    
    def driver_createProject(self, username, password, projectname, projectpassword, 
        studentFile = "C:/Users/Wangj/Downloads/sample_roster.xlsx", jsonFile = "C:/Users/Wangj/Downloads/teamwork_scale3.json"):
        
        logIn.Driver_Login(self,username, password) #login first
        self.driver.implicitly_wait(5)
        self.driver.execute_script("arguments[0].click()",self.driver.find_element_by_link_text("Create New Project"))        
        self.driver.implicitly_wait(5)

        createProject.setProjectName(self, projectname, projectpassword)
        
        createProject.setRoster(self, studentFile)

        createProject.setRubrics(self, jsonFile) 
        
        #This is for submission
        self.driver.find_element_by_css_selector(".w3-button").click()

    
    
    def createProject_attempt(self, username, password, projectname, projectpassword, studentFile, jsonFile): # if run the 2nd time, the control flow would go to duplicate username

        self.driver_createProject(username, password, projectname, projectpassword, studentFile, jsonFile)  

        urlCurrent = self.driver.current_url
        
        try:
            if self.driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[1]/p").text != None:
                alertInfo = self.driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[1]/p").text
        except:
            alertInfo = "no error"

            
        return (urlCurrent, alertInfo)
        
        
    def getProjectNameAndDescriptionAlert(self):
        alert1 = self.driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[1]/p").text
        alert2 = self.driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[2]/p").text
        self.driver.implicitly_wait(5)
        return (alert1, alert2)
        
    def getInvalidFileAlert(self):
        self.driver.implicitly_wait(5)
        alert1 = self.driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[3]/p").text
        alert2 = self.driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[4]/p").text
        self.driver.implicitly_wait(5)
        return (alert1, alert2)
    

    
    def testRubricFile_teamwork(self, username, password):
        logIn.Driver_Login(self, username, password) #login first        
        self.driver.execute_script("arguments[0].click()",self.driver.find_element_by_link_text("Create New Project"))
        self.driver.implicitly_wait(5)
        
        self.driver.find_element_by_link_text("(Browse sample rubric files)").click()
        self.driver.find_element_by_link_text("teamwork").click()
        self.driver.implicitly_wait(5)
        self.driver.find_element_by_link_text("teamwork_scale3.json").click()
        
        url = self.driver.current_url
        
        
        return url
    
    def testRubricFile_infoProcess(self, username, password):
        logIn.Driver_Login(self, username, password) #login first        
        self.driver.execute_script("arguments[0].click()",self.driver.find_element_by_link_text("Create New Project"))
        self.driver.implicitly_wait(5)
        
        self.driver.find_element_by_link_text("(Browse sample rubric files)").click()
        self.driver.find_element_by_link_text("information_processing").click()
        self.driver.implicitly_wait(5)
        self.driver.find_element_by_link_text("information_processing.json").click()
        
        url = self.driver.current_url
        
        
        return url
    
    def testRubricFile_communication(self, username, password):
        logIn.Driver_Login(self, username, password) #login first        
        self.driver.execute_script("arguments[0].click()",self.driver.find_element_by_link_text("Create New Project"))        
        self.driver.implicitly_wait(5)
        
        self.driver.find_element_by_link_text("(Browse sample rubric files)").click()
        self.driver.find_element_by_partial_link_text("interpersonal_communication").click()
        url = self.driver.current_url
        
        
        return url
    
    
    
    
    
    
    
    
    
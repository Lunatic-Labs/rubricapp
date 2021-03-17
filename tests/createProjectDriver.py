
from loginDriver import logIn
from selenium.webdriver import Chrome
import time

class createProject:


    def __init__(self):
        self.driver = Chrome()
    
    def Close(self):
        self.driver.quit()

    def driver_createProject(self, username, password, projectname, projectpassword, 
        studentFile = "C:/Users/Wangj/Downloads/sample_roster.xlsx", jsonFile = "C:/Users/Wangj/Downloads/teamwork_scale3.json"):
        
        #logInPage = logIn()
        logIn.Driver_Login(self,username, password) #login first
        
        self.driver.execute_script("arguments[0].click()",self.driver.find_element_by_css_selector(".nav-span"))

        time.sleep(2)
        self.driver.find_element_by_id("project_name").send_keys(projectname)
        self.driver.find_element_by_id("project_description").send_keys(projectpassword)
        self.driver.find_element_by_link_text("(Download a sample roster files)").click()
        time.sleep(5)  # wait for some time in case bad internet
        
        # Both files should now in download        
        self.driver.find_element_by_id("student_file").send_keys(studentFile) 
        self.driver.find_element_by_id("json_file").send_keys(jsonFile)
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
        time.sleep(3)
        return (alert1, alert2)
        
    def getInvalidFileAlert(self):
        time.sleep(3)
        alert1 = self.driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[3]/p").text
        alert2 = self.driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[4]/p").text
        time.sleep(3)
        return (alert1, alert2)
    

    
    def testRubricFile(self, username, password):
        logIn.Driver_Login(self, username, password) #login first        
        self.driver.execute_script("arguments[0].click()",self.driver.find_element_by_css_selector(".nav-span"))
        time.sleep(2)
        
        self.driver.find_element_by_link_text("(Browse sample rubric files)").click()
        self.driver.find_element_by_link_text("teamwork").click()
        time.sleep(3)
        self.driver.find_element_by_link_text("teamwork_scale3.json").click()
        
        url = self.driver.current_url
        self.driver.quit()
        
        return url

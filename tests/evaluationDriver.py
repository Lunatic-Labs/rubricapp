
from selenium.webdriver import Chrome
from loginDriver import logIn

import time

class evaluation:
    
    def __init__(self):
        self.driver = Chrome()
    
    def Close(self):
        self.driver.quit()
        
    def driver_createEvaluation_attempt(self, username, password, projectName, evaluationName):
        
        logIn.Driver_Login(self,username, password) #login first
        self.driver.execute_script("arguments[0].click()",self.driver.find_element_by_link_text(projectName))
        time.sleep(2)        
        projectURL = self.driver.current_url
        
        self.driver.find_element_by_link_text("Create a New Evaluation").click()
        self.driver.find_element_by_id("evaluation_name").send_keys(evaluationName)  # the testing name should be a new name
        self.driver.find_element_by_id("evaluation_submit").click()
        
        try:
            #if self.driver.find_element_by_id("feedback").text != None:
            alertInfo = self.driver.find_element_by_id("feedback").text
        except:
            alertInfo = "no error"
        
        time.sleep(5)
        
        return (projectURL,alertInfo)
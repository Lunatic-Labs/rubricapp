
from selenium.webdriver import Chrome
import time


class logIn:


    def __init__(self):
        
        self.driver = Chrome() 


    def Driver_Login(self, username, password):
        
        self.driver.get("http://localhost:5000")
        self.driver.find_element_by_link_text("Login").click()
        self.driver.find_element_by_id("email").send_keys(username)
        self.driver.find_element_by_id("password").send_keys(password)
        
        rememberButton = self.driver.find_element_by_id("remember")     
        if not rememberButton.is_selected():
            rememberButton.click()
        
        self.driver.find_element_by_css_selector(".btn").click()
        
            
    def LoginAttempt(self, username, password):        
        self.Driver_Login(username, password)
        urlCurrent = self.driver.current_url        
        return urlCurrent
    
    def Close(self):
        self.driver.quit()
        
        
    def getUserExistAlert(self):  #1
        alertInfo = self.driver.find_element_by_class_name("alert-info").text        
        return alertInfo
        
    def getPasswordAlert(self): #2
        alertInfo = self.driver.find_element_by_class_name("help-block").text
        return alertInfo
        
    def getInvalidEmailAlert(self): #3
        alert1 = self.driver.find_element_by_xpath("/html/body/div[2]/form/div[2]/div[1]/p").text
        alert2 = self.driver.find_element_by_xpath("/html/body/div[2]/form/div[2]/div[2]/p").text
        return (alert1, alert2)
        
    def getIncorrectPasswordAlert(self): #4
        alertInfo = self.driver.find_element_by_xpath("/html/body/div[2]/div/h4").text
        return alertInfo
        
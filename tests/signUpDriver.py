#This class is for the driver setup of signUp

from selenium.webdriver import Chrome
import time


class signUp:   
    
    def __init__(self):
        
        self.driver = Chrome() 
    
    def Driver_SignUp(self, username, password):

        self.driver.get("http://localhost:5000")
        self.driver.find_element_by_link_text("Sign up").click()
        self.driver.find_element_by_id("email").send_keys(username)  #the username here is existed
        self.driver.find_element_by_id("password").send_keys(password)
        self.driver.find_element_by_css_selector(".btn").click()
        
        #for tests:
        urlCurrent = self.driver.current_url 
        
        alertInfo = self.driver.find_element_by_class_name("alert-info").text
        
        
        return (urlCurrent, alertInfo)
    
    def Close(self):
        self.driver.quit()

from selenium.webdriver import Chrome
from loginDriver import logIn

import time



class rating:
    def __init__(self):
        self.driver = Chrome()
    
    def Close(self):
        self.driver.quit()
    
    
    def driver_Rating_attempt(self, username, password, projectName, evaluationName):
    
        logIn.Driver_Login(self,username, password) #login first
        
        # Click into "Teamwork1" project using execute_script()
        self.driver.execute_script("arguments[0].click()",self.driver.find_element_by_link_text(projectName))  # assuming we created a rubric called "Teamwork1" already
        time.sleep(2)
        projectURL = self.driver.current_url
        
        # log into b metagroup
        self.driver.find_element_by_link_text("b").click()
        metaGroupURL = self.driver.current_url
        time.sleep(2)
        
        # The following is to find the data & time of the creation of the data. 
        # for example: 2021-03-09_00-15-17
        html = self.driver.page_source        
        str1 = "grade by"
        a = html.find(str1)
        timeCreation = html[(a-21):(a-2)]
        
        # This is for converting username to be a css version of username
        # for example: sampleuser13@mailinator.com -> #sampleuser13\@mailinator\.com
        css = "#"
        for s in username:
            if s == '@':
                css = css + "\@"
            elif s == ".":
                css = css + "\."
            else:
                css = css + s

        
        #initially in F group:
        # select a rating + check 2 boxes for Interacting category
        
        #self.driver.find_element_by_css_selector("#sampleuser13\@mailinator\.com2021-03-09_00-15-17\|Interacting0 .w3-parallel-box:nth-child(4) .L-labels").click()
        self.driver.find_element_by_css_selector(css + timeCreation + "\|Interacting0 .w3-parallel-box:nth-child(4) .L-labels").click()
        
        rateA = self.driver.find_element_by_id(username + timeCreation + "|Interacting|Observed Characteristics|a")
        
        if not rateA.is_selected():
            rateA.click()
        statusA =  rateA.is_selected()
        
        rateB = self.driver.find_element_by_id(username + timeCreation + "|Interacting|Observed Characteristics|b")
        if not rateB.is_selected():
            rateB.click()
        statusB = rateB.is_selected()
        
        self.driver.find_element_by_id("button").click()
        time.sleep(2)
        
        #now switch to O group:
        self.driver.find_element_by_css_selector(".tool-panel:nth-child(2) #O > .active-toolbox").click()
        self.driver.switch_to.alert.accept()
        secondGroupURL = self.driver.current_url
        time.sleep(2)
        
        #Rate the O group with 1 rating + check 1 box for Interacting category
        self.driver.find_element_by_css_selector(css + timeCreation+"\|Interacting0 .w3-parallel-box:nth-child(5) .L-labels").click()
        rateC = self.driver.find_element_by_css_selector(css + timeCreation + "\|Interacting\|Observed\ Characteristics\|a")
        if not rateC.is_selected():
            rateC.click()
        statusC = rateC.is_selected()
        
        self.driver.find_element_by_id("button").click()
        time.sleep(2)
        
        status = statusA and statusB and statusC
        
        
             
        
        
        return (projectURL, metaGroupURL, secondGroupURL, status,timeCreation,css)
        
        
        

    
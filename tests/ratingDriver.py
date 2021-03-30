
from selenium.webdriver import Chrome
from loginDriver import logIn

import time



class rating:
    def __init__(self):
        self.driver = Chrome()
    
    def Close(self):
        self.driver.quit()
    
    def getTimeCreationOfEvaluation(self):
        html = self.driver.page_source        
        str1 = "grade by"
        a = html.find(str1)
        timeCreation = html[(a-21):(a-2)]
        return timeCreation
    
    def usernameToCssUsername(username):
        css = "#"
        for s in username:
            if s == '@':
                css = css + "\@"
            elif s == ".":
                css = css + "\."
            else:
                css = css + s
        return css
    
    def getCssUsernameAndTimeCreateOfEvaluation(self, username):
        #get time creation of the evaluation - for later locating element
        timeCreation = rating.getTimeCreationOfEvaluation(self)
        #set username in css format
        css = rating.usernameToCssUsername(username)
        return (timeCreation, css)
    
    
    
    def rateInteractingLevel(self, css, timeCreation, level):
        switcher = {
            "N/A"         : "1",
            "No evidence" : "2",
            "Rarely"      : "3",
            "Sporadically": "4",
            "Frequently"  : "5"
        }
        self.driver.find_element_by_css_selector(css + timeCreation + "\|Interacting0 .w3-parallel-box:nth-child(" 
                  + switcher.get(level, "None") + ") .L-labels").click()
    
    def rateInteractingCheckbox(self, username, timeCreation, choice):
        #choice is limited to "a", "b", "c"
        rate = self.driver.find_element_by_id(username + timeCreation + "|Interacting|Observed Characteristics|" + choice)
        
        if not rate.is_selected():
            rate.click()
        status =  rate.is_selected()
        return status
        
    def rateInteracting(self, css, username, timeCreation, level, choice1="none", choice2="none", choice3="none"):
        #Rate the level in Interacting category - here the choice is "Sporadically"
        rating.rateInteractingLevel(self, css, timeCreation, level)
        
        #Rate the checkboxes in Interacting category:
        status1=status2=status3 = False
        #here rate checkbox "a"
        if choice1 != "none":   status1 = rating.rateInteractingCheckbox(self, username, timeCreation, choice1)
        
        #here rate checkbox "b"
        if choice2 != "none":   status2 = rating.rateInteractingCheckbox(self, username, timeCreation, choice2)
        if choice3 != "none":   status3 = rating.rateInteractingCheckbox(self, username, timeCreation, choice3)
        
        #this is to save the rating
        self.driver.find_element_by_id("button").click()
        self.driver.implicitly_wait(5)
        
        return (status1, status2, status3)
    
    def switchGroup(self, groupName):
        self.driver.find_element_by_css_selector(".tool-panel:nth-child(2) #" + groupName + " > .active-toolbox").click()
        self.driver.switch_to.alert.accept()
    
    
    def driver_Rating_attempt(self, username, password, projectName, evaluationName):
        
        #login
        logIn.Driver_Login(self,username, password) 
        
        # Select project
        self.driver.execute_script("arguments[0].click()",self.driver.find_element_by_link_text(projectName))
        self.driver.implicitly_wait(5)
        projectURL = self.driver.current_url
        
        #Select evaluation and the metagroup to rate:  here I tested the b metagroup of the first evaluation      
        self.driver.find_element_by_link_text("b").click()
        metaGroupURL = self.driver.current_url
        self.driver.implicitly_wait(5)
        
        # obtain creation time of the evaluation, and css version of username for locating element
        (timeCreation, css) = rating.getCssUsernameAndTimeCreateOfEvaluation(self, username)
        
        #initially in F group in my case: 
        #Rate the interacting category of F group: my choices are: level is "Sporadically", and first two checkboxes (label "a", "b")
        (statusA, statusB, statusNA) = rating.rateInteracting(self, css, username, timeCreation, "Sporadically", "a", "b")
        
        #now switch to O group:
        rating.switchGroup(self, "O")
        secondGroupURL = self.driver.current_url
        self.driver.implicitly_wait(5)      

        #Rate the interacting category of F group: my choices are: level is "Frequently", and the third checkboxes (label "c")
        (statusC, statusNA2, status3) = rating.rateInteracting(self, css, username, timeCreation, "Frequently", "c")
        
        #This is to check the all the checkboxes that were selected above
        status = statusA and statusB and statusC
        
        return (projectURL, metaGroupURL, secondGroupURL, status)
        
        
        

    
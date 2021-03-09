# The order of each test cases is dependent on the fxn name. If first time running, the SignUp test should be run first prior to others.
# The functions should be separated into different files later on.


import unittest


from selenium.webdriver import Chrome
import time



        
class signUp:   

    def Driver_SignUp(username, password):
        driver = Chrome()
        driver.get("http://localhost:5000")
        driver.find_element_by_link_text("Sign up").click()
        driver.find_element_by_id("email").send_keys(username)  #the username here is existed
        driver.find_element_by_id("password").send_keys(password)
        driver.find_element_by_css_selector(".btn").click()
        
        #for tests:
        urlCurrent = driver.current_url 
        
        alertInfo = driver.find_element_by_class_name("alert-info").text
        driver.quit()  # must have, otherwise there will be an exception at the end
        
        return (urlCurrent, alertInfo)


class logIn:


    def __init__(self):
        
        self.driver = Chrome() 


    def Driver_Login(self, username, password):
        
        self.driver.get("http://localhost:5000")
        self.driver.find_element_by_link_text("Login").click()
        self.driver.find_element_by_id("email").send_keys(username)
        self.driver.find_element_by_id("password").send_keys(password)
        self.driver.find_element_by_id("remember").click() # add to click rememrber me
        self.driver.find_element_by_css_selector(".btn").click()
        
            
    def LoginAttempt(self, username, password): # now it's an instance 
        
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
        
        #initially in F group:
        # select a rating + check 2 boxes for Interacting category
        self.driver.find_element_by_css_selector("#sampleuser13\@mailinator\.com2021-03-09_00-15-17\|Interacting0 .w3-parallel-box:nth-child(4) .L-labels").click()
        self.driver.find_element_by_id("sampleuser13@mailinator.com2021-03-09_00-15-17|Interacting|Observed Characteristics|a").click()
        self.driver.find_element_by_id("sampleuser13@mailinator.com2021-03-09_00-15-17|Interacting|Observed Characteristics|b").click()
        self.driver.find_element_by_id("button").click()
        time.sleep(2)
        
        #now switch to O group:
        self.driver.find_element_by_css_selector(".tool-panel:nth-child(2) #O > .active-toolbox").click()
        self.driver.switch_to.alert.accept()
        secondGroupURL = self.driver.current_url
        time.sleep(2)
        
        #Rate the O group with 1 rating + check 1 box for Interacting category
        self.driver.find_element_by_css_selector("#sampleuser13\@mailinator\.com2021-03-09_00-15-17\|Interacting0 .w3-parallel-box:nth-child(5) .L-labels").click()
        self.driver.find_element_by_css_selector("#sampleuser13\@mailinator\.com2021-03-09_00-15-17\|Interacting0 .L2-li:nth-child(3) > .L2-labels").click()
        self.driver.find_element_by_id("button").click()
        time.sleep(2)
        
        return (projectURL, metaGroupURL, secondGroupURL)
    
    

class TestAll(unittest.TestCase):



    def test_1_SignUp_Existed(self):
        #If this is not the first time of running this code, then the username would be existed
        print("\n\nTesting SignUp\n\n")  #somehow this is not printed
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")  
        (urlCurrent, alertInfo) = signUp.Driver_SignUp(username, password)
        
        IsSignUpSuccess = urlCurrent == "http://localhost:5000/login"
        IsSignUpFailed = urlCurrent == "http://localhost:5000/signup"
        IsAlertInfo = alertInfo == "Warning !!! The email has been used"
        
        self.assertTrue(IsSignUpSuccess or (IsSignUpFailed and IsAlertInfo))
      
    
    def test_2_0_LoginSuccess(self):
        #successfully login - with correct username and password
        print("\n\nTesting LoginSuccess\n\n")
        
        logInPage = logIn()     # constuctor
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")  
        currentUrl = logInPage.LoginAttempt(username, password)
        logInPage.Close()
        
        
        IsLoginSuccess = (currentUrl == "http://localhost:5000/instructor_project")
        
        self.assertTrue(IsLoginSuccess)   
    
    
    def test_2_1_LoginFailure_by_user_not_exist(self):
        #failed login due to "user doesn't exist"

        print("\n\nTesting LoginFailure1 - due to 'user doesn't exist'\n\n")
        
        logInPage = logIn()
        (username, password) = ("Wronginput@gmail.com","abcdefgh") 
        currentUrl = logInPage.LoginAttempt(username, password)
        alertInfo = logInPage.getUserExistAlert()  # no need for self -- passed already through logInPage
        logInPage.Close()
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert = alertInfo == "user doesn't exist"
        
        self.assertTrue(IsUrlTrue and IsAlert)
        
    
    def test_2_2_LoginFailure_by_invalid_password(self):
        #failed login due to password too short or too long(should be between 8 - 80)

        print("\n\nTesting LoginFailure1 - due to 'user doesn't exist'\n\n")
        
        logInPage = logIn()
        (username, password) = ("sampleuser13@mailinator.com","a"*7) 
        currentUrl = logInPage.LoginAttempt(username, password)
        alertInfo = logInPage.getPasswordAlert()  # no need for self -- passed already through logInPage
        logInPage.Close()
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert = alertInfo == "Field must be between 8 and 80 characters long."
        
        self.assertTrue(IsUrlTrue and IsAlert)
    
    def test_2_2_LoginFailure_by_invalid_email(self):
        #failed login due to invalid email (no @), along with password too short 

        print("\n\nTesting LoginFailure1 - due to 'user doesn't exist'\n\n")
        
        logInPage = logIn()
        (username, password) = ("Wronginput.gmail.com","a"*7) 
        currentUrl = logInPage.LoginAttempt(username, password)
        (alert1, alert2) = logInPage.getInvalidEmailAlert()
        logInPage.Close()
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert1 = alert1 == "Invalid email"
        IsAlert2 = alert2 == "Field must be between 8 and 80 characters long."
            
        self.assertTrue(IsUrlTrue and IsAlert1 and IsAlert2)    
    
    def test_2_2_LoginFailure_by_incorrect_password(self):
        #failed login due to incorrect password 

        print("\n\nTesting LoginFailure1 - due to 'user doesn't exist'\n\n")
        
        logInPage = logIn()
        (username, password) = ("sampleuser13@mailinator.com","a"*8) 
        currentUrl = logInPage.LoginAttempt(username, password)
        alertInfo = logInPage.getIncorrectPasswordAlert()
        logInPage.Close()
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert = alertInfo == "password not correct"
        
        self.assertTrue(IsUrlTrue and IsAlert)
    
    
    def test_3_CreateProject(self):
        #if first time run, this test will create a project; if not the first time, there won't be duplicate projects created
        
        # The rubric file (.json) must be first downloaded
        
        print("\n\nTesting createProject\n\n")  #somehow this is not printed
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")          
        (projectname, projectpassword) = ("Teamwork", "A sample project using an ELPISSrubric for Teamwork")        
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")
        
        createP = createProject()
        
        (urlCurrent, alertInfo) = createP.createProject_attempt(username, password, projectname, projectpassword, studentFile, jsonFile)
        
        createP.Close()
        
        IsProjectCreated = urlCurrent == "http://localhost:5000/instructor_project"
        
        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlertInfo = alertInfo == "The project name has been used before"
        
        msg = alertInfo
        
        self.assertTrue(IsProjectCreated or (IsProjectNotCreated and IsAlertInfo), msg)
    
    
    def test_3_0_Rubric_file(self):
        #test the rubric file location
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")     
        createP = createProject()
        
        url = createP.testRubricFile(username, password)
        createP.Close()
        IsUrlTrue = url == "https://github.com/sotl-technology/rubricapp/blob/master/sample_file/rubrics/teamwork/teamwork_scale3.json"
        self.assertTrue(IsUrlTrue)
        
    
    def test_3_1_CreateProject_InvalidProjectNameAndDescription(self):
        #invalid project name and description 
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")         
        (projectname, projectpassword) = ("12", "1"*256)        
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")
        
        createP = createProject()
        
        (urlCurrent, alertInfo) = createP.createProject_attempt(username, password, projectname, projectpassword,studentFile, jsonFile)
        (alert1, alert2) = createP.getProjectNameAndDescriptionAlert()
        createP.Close()
        
        
        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlert1 = alert1 == "Field must be between 3 and 150 characters long."
        IsAlert2 = alert2 == "Field must be between 0 and 255 characters long."
        
        self.assertTrue(IsProjectNotCreated and alert1 and alert2)
    
    
    def test_3_2_CreateProject_InvalidFileFormat(self):
        #incorrect format of files uploaded for Roster and Rubric
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")        
        (projectname, projectpassword) = ("Teamwork", "A sample project using an ELPISSrubric for Teamwork")
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/teamwork_scale3.json","C:/Users/Wangj/Downloads/sample_roster.xlsx")
        
        createP = createProject()
        
        (urlCurrent, alertInfo) = createP.createProject_attempt(username, password, projectname, projectpassword,studentFile, jsonFile)
        (alert1, alert2) = createP.getInvalidFileAlert()
        createP.Close()

        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlert1 = alert1 == "File is not a zip file"
        IsAlert2 = alert2 == "'charmap' codec can't decode byte 0x81 in position 22: character maps to <undefined>"

        
        self.assertTrue(IsProjectNotCreated and alert1 and alert2)

    
    def test_Evaluations(self):
        # This evaluation will test for either successfully creating evaluation or fail due to existed evaluation name
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh") 
        (projectName, evaluationName) = ("Teamwork", "Week 222")
        createE = evaluation()
        
        (projectURL, alertInfo) = createE.driver_createEvaluation_attempt(username, password, projectName, evaluationName)
        createE.Close()
        
        IsAtEvalCreatePage = projectURL == "http://localhost:5000/load_project/" + username + username + projectName + "full/noAlert"
        #"http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamworkfull/noAlert"
        
        IsAlertInfo = alertInfo == "The evaluation_name has been used before"
        IsNoError = alertInfo == "no error"
        
        msg = alertInfo
        
        self.assertTrue((not IsAtEvalCreatePage and IsNoError) or (IsAtEvalCreatePage and IsAlertInfo, msg))
    def test_Rating(self):
        # Here is only my hardcoding work
        # due to Out-Of-Index problem, I created a new rubric called "Teamwork1" with one evalution as "Week 1"
        # in addition, almost all the elements on the page is associated with my userid and the time of the creation of the evaluation
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")
        (projectName, evaluationName) = ("Teamwork1", "Week 1")
        
        createR = rating()        
        (projectURL, metaGroupURL, secondGroupURL) = createR.driver_Rating_attempt(username, password, projectName, evaluationName)
        createR.Close()
        
        IsProject = projectURL == "http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/noAlert"
        
        IsMetaGroup = metaGroupURL == "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/Week%201/b/***None***/noAlert"
        
        IsSecondGroup = secondGroupURL == "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamwork1full/Week%201/b/O/Connected%20to%20groupO"
        
        self.assertTrue(IsProject and IsMetaGroup and IsSecondGroup)
    
    

    
            




if __name__ == '__main__':
    unittest.main()
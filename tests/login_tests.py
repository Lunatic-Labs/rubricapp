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

    def Driver_Login(driver, username, password):
        
        driver.get("http://localhost:5000")
        driver.find_element_by_link_text("Login").click()
        driver.find_element_by_id("email").send_keys(username)
        driver.find_element_by_id("password").send_keys(password)
        driver.find_element_by_id("remember").click() # add to click rememrber me
        driver.find_element_by_css_selector(".btn").click()

    def LoginSuccess(username, password):
        driver = Chrome()
        logIn.Driver_Login(driver, username, password);
        urlCurrent = driver.current_url
        driver.quit()        
        return urlCurrent
    
    def Failure1(username, password):
        driver = Chrome()
        logIn.Driver_Login(driver, username, password);
        urlCurrent = driver.current_url
        alertInfo = driver.find_element_by_class_name("alert-info").text
        driver.quit()        
        return (urlCurrent, alertInfo)
        
    def Failure2(username, password):
        driver = Chrome()
        logIn.Driver_Login(driver, username, password);
        urlCurrent = driver.current_url
        alertInfo = driver.find_element_by_class_name("help-block").text
        driver.quit()
        return (urlCurrent, alertInfo)
        
    def Failure3(username, password):
        driver = Chrome()
        logIn.Driver_Login(driver, username, password);
        urlCurrent = driver.current_url
        alert1 = driver.find_element_by_xpath("/html/body/div[2]/form/div[2]/div[1]/p").text
        alert2 = driver.find_element_by_xpath("/html/body/div[2]/form/div[2]/div[2]/p").text
        driver.quit()
        return (urlCurrent, alert1, alert2)        

    def Failure4(username, password):
        driver = Chrome()
        logIn.Driver_Login(driver, username, password);
        urlCurrent = driver.current_url
        alertInfo = driver.find_element_by_xpath("/html/body/div[2]/div/h4").text
        driver.quit()
        return (urlCurrent, alertInfo)


class createProject:
    def driver_createProject(driver, username, password, projectname, projectpassword, 
         studentFile = "C:/Users/Wangj/Downloads/sample_roster.xlsx", jsonFile = "C:/Users/Wangj/Downloads/teamwork_scale3.json"):
        
        
        logIn.Driver_Login(driver, username, password) #login first
        
        driver.execute_script("arguments[0].click()",driver.find_element_by_css_selector(".nav-span"))
        time.sleep(2)
        driver.find_element_by_id("project_name").send_keys(projectname)
        driver.find_element_by_id("project_description").send_keys(projectpassword)
        driver.find_element_by_link_text("(Download a sample roster files)").click()
        time.sleep(5)  # wait for some time in case bad internet

       
        
        # Both files should now in download
        
        driver.find_element_by_id("student_file").send_keys(studentFile) 
        driver.find_element_by_id("json_file").send_keys(jsonFile)
        driver.find_element_by_css_selector(".w3-button").click()
        
        #urlCurrent = driver.current_url
        #alertInfo = driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[1]/p").text
        
        
        #driver.quit()

        #return (urlCurrent, alertInfo)
    
    
    def success(username, password, projectname, projectpassword, studentFile, jsonFile): # if run the 2nd time, the control flow would go to duplicate username
        driver = Chrome()
        createProject.driver_createProject(driver, username, password, projectname, projectpassword)  
        

        urlCurrent = driver.current_url
        
        try:
            if driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[1]/p").text != None:
                alertInfo = driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[1]/p").text
        except:
            alertInfo = "no error"
            driver.quit()
            
        return (urlCurrent, alertInfo)
        
        
    def failure1(username, password, projectname, projectpassword, studentFile, jsonFile):
        driver = Chrome()
        createProject.driver_createProject(driver, username, password, projectname, projectpassword)  
        

        urlCurrent = driver.current_url
        time.sleep(10) 
        alert1 = driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[1]/p").text
        alert2 = driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[2]/p").text
                
        return (urlCurrent, alert1, alert2)
    
    def failure2(username, password, projectname, projectpassword, studentFile, jsonFile):
        driver = Chrome()
        createProject.driver_createProject(driver, username, password, projectname, projectpassword, studentFile, jsonFile)  
        

        urlCurrent = driver.current_url
        time.sleep(10) 
        alert1 = driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[3]/p").text
        alert2 = driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[4]/p").text
                
        return (urlCurrent, alert1, alert2)

    
    def testRubricFile(username, password):
        driver = Chrome()
        logIn.Driver_Login(driver, username, password) #login first        
        driver.execute_script("arguments[0].click()",driver.find_element_by_css_selector(".nav-span"))
        time.sleep(2)
        
        driver.find_element_by_link_text("(Browse sample rubric files)").click()
        driver.find_element_by_link_text("teamwork").click()
        time.sleep(3)
        driver.find_element_by_link_text("teamwork_scale3.json").click()
        
        url = driver.current_url
        driver.quit()
        
        return url
        
        


        



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
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")  
        currentUrl   = logIn.LoginSuccess(username, password)
        
        
        
        IsLoginSuccess = (currentUrl == "http://localhost:5000/instructor_project")
        
        self.assertTrue(IsLoginSuccess)   
    
    
    def test_2_1_LoginFailure1(self):
        #failed login due to "user doesn't exist"

        print("\n\nTesting LoginFailure1 - due to 'user doesn't exist'\n\n")
        
        (username, password) = ("Wronginput@gmail.com","abcdefgh") 
        (currentUrl, alertInfo) = logIn.Failure1(username, password)
        
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert = alertInfo == "user doesn't exist"
        
        self.assertTrue(IsUrlTrue and IsAlert)

    
    def test_2_2_LoginFailure2(self):
        #failed login due to password too short or too long(should be between 8 - 80)
        
        print("\n\nTesting LoginFailure2 - due to too short or too long.\n\n")
        
        (username, password) = ("sampleuser13@mailinator.com","a"*7) 
        (currentUrl, alertInfo) = logIn.Failure2(username, password)
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert = alertInfo == "Field must be between 8 and 80 characters long."
            
        self.assertTrue(IsUrlTrue and IsAlert)
    
    def test_2_3_LoginFailure2(self):
        #failed login due to password too short or too long(should be between 8 - 80)
        
        print("\n\nTesting LoginFailure2 - due to too short or too long.\n\n")
        
        (username, password) = ("Wronginput.gmail.com","a"*7)  #could change password == a*81, also fail
        (currentUrl, alert1, alert2) = logIn.Failure3(username, password)
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert1 = alert1 == "Invalid email"
        IsAlert2 = alert2 == "Field must be between 8 and 80 characters long."
            
        self.assertTrue(IsUrlTrue and IsAlert1 and IsAlert2)

    
    def test_2_4_LoginFailure2(self):
        #failed login due to password too short or too long(should be between 8 - 80)
        
        print("\n\nTesting LoginFailure2 - due to too short or too long.\n\n")
        
        (username, password) = ("sampleuser13@mailinator.com","a"*8) 
        (currentUrl, alertInfo) = logIn.Failure4(username, password)
        
        IsUrlTrue = currentUrl == "http://localhost:5000/login"
        IsAlert = alertInfo == "password not correct"
            
        self.assertTrue(IsUrlTrue and IsAlert)
        
    def test_3_CreateProject(self):
        
        # The rubric file (.json) must be first downloaded
        
        print("\n\nTesting SignUp\n\n")  #somehow this is not printed
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")  
        
        (projectname, projectpassword) = ("Teamwork", "A sample project using an ELPISSrubric for Teamwork")
        
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")
        
        (urlCurrent, alertInfo) = createProject.success(username, password, projectname, projectpassword, studentFile, jsonFile)
        
        
        IsProjectCreated = urlCurrent == "http://localhost:5000/instructor_project"
        
        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlertInfo = alertInfo == "The project name has been used before"
        
        msg = alertInfo
        
        self.assertTrue(IsProjectCreated or (IsProjectNotCreated and IsAlertInfo), msg)

        
        
        #test the rubric file location
        url = createProject.testRubricFile(username, password)
        IsUrlTrue = url == "https://github.com/sotl-technology/rubricapp/blob/master/sample_file/rubrics/teamwork/teamwork_scale3.json"
        self.assertTrue(IsUrlTrue)
        


    
    def test_3_1_CreateProjectFail(self):
        #improper project name and description 
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")  
        
        (projectname, projectpassword) = ("12", "1"*256)
        
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/sample_roster.xlsx", "C:/Users/Wangj/Downloads/teamwork_scale3.json")
        
        (urlCurrent, alert1, alert2) = createProject.failure1(username, password, projectname, projectpassword,studentFile, jsonFile)
        

        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlert1 = alert1 == "Field must be between 3 and 150 characters long."
        IsAlert2 = alert2 == "Field must be between 0 and 255 characters long."
        
        
        self.assertTrue(IsProjectNotCreated and alert1 and alert2)
    
    
    
    def test_3_2_CreateProjectFail(self):
        #improper files uploaded for Roster and Rubric
        
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")  
        
        (projectname, projectpassword) = ("Teamwork", "A sample project using an ELPISSrubric for Teamwork")
        (studentFile, jsonFile) = ("C:/Users/Wangj/Downloads/teamwork_scale3.json","C:/Users/Wangj/Downloads/sample_roster.xlsx")
        
        (urlCurrent, alert1, alert2) = createProject.failure2(username, password, projectname, projectpassword, studentFile,jsonFile)
        
        

        IsProjectNotCreated = urlCurrent == "http://localhost:5000/create_project"
        IsAlert1 = alert1 == "File is not a zip file"
        IsAlert2 = alert2 == "'charmap' codec can't decode byte 0x81 in position 22: character maps to <undefined>"
        
        
        self.assertTrue(IsProjectNotCreated and alert1 and alert2)
    
 
    '''continue from here:
    '''




    '''

    def test_Evaluations(self):
        driver = Chrome()

        with Chrome() as driver:
            #here is the previous login step:
            
            driver.get("http://localhost:5000")
            driver.find_element_by_link_text("Login").click()
            driver.find_element_by_id("email").send_keys("sampleuser13@mailinator.com")
            driver.find_element_by_id("password").send_keys("abcdefgh")
            driver.find_element_by_id("remember").click() # add to click rememrber me
            driver.find_element_by_css_selector(".btn").click()
            self.assertEqual(driver.current_url, "http://localhost:5000/instructor_project")


            # start testing evaluation

            # Click into "Teamwork" using execute_script()
            driver.execute_script("arguments[0].click()",driver.find_element_by_link_text("Teamwork"))  # assuming we created a rubric called "teamwork" already
            time.sleep(2)
            self.assertEqual(driver.current_url, "http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamworkfull/noAlert")

                        
            driver.find_element_by_link_text("Create a New Evaluation").click()
            
            
            self.assertEqual(driver.current_url, "http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamworkfull/noAlert")
            driver.find_element_by_id("evaluation_name").send_keys("2")  # the testing name should be a new name
            driver.find_element_by_id("evaluation_submit").click()
            # this is succesful to create a new evaluation as can be seen in webpage
            # but each time the newly arrived webpage would have a different url based on the key (now is week 3) above - cannot assert
            

    def test_Rating(self):
        driver = Chrome()

        with Chrome() as driver:
            #login step
            driver.get("http://localhost:5000")
            driver.find_element_by_link_text("Login").click()
            driver.find_element_by_id("email").send_keys("sampleuser13@mailinator.com")
            driver.find_element_by_id("password").send_keys("abcdefgh")
            driver.find_element_by_id("remember").click() # add to click rememrber me
            driver.find_element_by_css_selector(".btn").click()
            self.assertEqual(driver.current_url, "http://localhost:5000/instructor_project")


            #Here starts the rating part: (now should be at the default: metagroup b, group C

            
            # Click into "Teamwork" using execute_script()
            driver.execute_script("arguments[0].click()",driver.find_element_by_link_text("Teamwork"))  # assuming we created a rubric called "teamwork" already
            time.sleep(2)
            self.assertEqual(driver.current_url, "http://localhost:5000/load_project/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamworkfull/noAlert")

            driver.find_element_by_css_selector(".w3-card:nth-child(10) > .w3-button:nth-child(7)").click()  # this css is changing!
            self.assertEqual(driver.current_url, "http://localhost:5000/jump_to_evaluation_page/sampleuser13@mailinator.comsampleuser13@mailinator.comTeamworkfull/2/b/***None***/noAlert")

            #currently is in C group:
            driver.find_element_by_css_selector("#sampleuser13\@mailinator\.com2020-12-16_22-18-33\|Interacting0 .w3-parallel-box:nth-child(3) .scoreDisplay").click()
            driver.find_element_by_id("sampleuser13@mailinator.com2020-12-16_22-18-33|Interacting|Observed Characteristics|b").click()
            driver.find_element_by_id("sampleuser13@mailinator.com2020-12-16_22-18-33|Interacting|Observed Characteristics|c").click()
            #time.sleep(10)  
            driver.find_element_by_id("button").click()
            time.sleep(2)  # the addition of this waiting time is necessary

            #now switch to O group:

            driver.find_element_by_css_selector(".tool-panel:nth-child(2) #O > .active-toolbox").click()
            driver.switch_to.alert.accept()
            time.sleep(2)
            driver.find_element_by_css_selector("#sampleuser13\@mailinator\.com2020-12-16_22-18-33\|Interacting0 .w3-parallel-box:nth-child(4) .scoreDisplay").click()
            driver.find_element_by_id("sampleuser13@mailinator.com2020-12-16_22-18-33|Interacting|Observed Characteristics|a").click()
            driver.find_element_by_id("button").click()
            time.sleep(2)    # the addition of this waiting time is necessary           
         

            
    '''   
   



if __name__ == '__main__':
    unittest.main()
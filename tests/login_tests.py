# The order of each test cases is dependent on the fxn name. If first time running, the SignUp test should be run first prior to others.
# The functions should be separated into different files later on.


import unittest

from selenium.webdriver import Chrome
import time

class TestLogin(unittest.TestCase):

    
    def test_1_SignUp_Existed(self):
        #If this is not the first time of running this code, then the username would be existed

        print("\n\nTesting SignUp\n\n")
        
        driver = Chrome()
        
        #with Chrome() as driver:
        driver.get("http://localhost:5000")
        driver.find_element_by_link_text("Sign up").click()
        driver.find_element_by_id("email").send_keys("sampleuser13@mailinator.com")  #the username here is existed
        driver.find_element_by_id("password").send_keys("abcdefgh")
        driver.find_element_by_css_selector(".btn").click()
        if driver.current_url == "http://localhost:5000/login":  # if a new username created
            self.assertTrue(True)        
        elif driver.current_url == "http://localhost:5000/signup": # if username already exists
            self.assertTrue(True)
            if driver.find_element_by_class_name("alert-info").text == "Warning !!! The email has been used":
                self.assertTrue(True)                            # if username exists, there will be this warning sign
            else:
                self.assertTrue(False)
        else:
            self.assertTrue(False)


        
    
    def test_2_LoginSuccess(self):
        #successfully login

        print("\n\nTesting LoginSuccess\n\n")

        
        driver = Chrome()

        with Chrome() as driver:
            #your code inside this indent
            driver.get("http://localhost:5000")
            driver.find_element_by_link_text("Login").click()
            driver.find_element_by_id("email").send_keys("sampleuser13@mailinator.com")
            driver.find_element_by_id("password").send_keys("abcdefgh")
            driver.find_element_by_id("remember").click() # add to click rememrber me
            driver.find_element_by_css_selector(".btn").click()
            if driver.current_url == "http://localhost:5000/instructor_project":
                #time.sleep(5)    #make sure the page is on
                self.assertTrue(True)
            else:
                self.assertTrue(False)
    
    
    def test_2_1_LoginFailure1(self):
        #failed login due to "user doesn't exist"

        print("\n\nTesting LoginFailure1 - due to 'user doesn't exist'\n\n")

        
        driver = Chrome()

        with Chrome() as driver:
            #your code inside this indent
            driver.get("http://localhost:5000")
            driver.find_element_by_link_text("Login").click()
            driver.find_element_by_id("email").send_keys("Wronginput@gmail.com")
            driver.find_element_by_id("password").send_keys("abcdefgh")
            driver.find_element_by_id("remember").click() # add to click rememrber me
            driver.find_element_by_css_selector(".btn").click()
            if driver.current_url == "http://localhost:5000/login":
                self.assertTrue(True)
                
                if driver.find_element_by_class_name("alert-info").text == "user doesn't exist":
                    self.assertTrue(True)
                else:
                    self.assertTrue(False)
                             
            else:
                self.assertTrue(False)
 
    
    def test_2_2_LoginFailure2(self):
        #failed login due to password too short or too long(should be between 8 - 80)
        driver = Chrome()

        print("\n\nTesting LoginFailure2 - due to too short or too long.\n\n")

        with Chrome() as driver:
            #your code inside this indent
            
            driver.get("http://localhost:5000")
            driver.find_element_by_link_text("Login").click()
            driver.find_element_by_id("email").send_keys("Wronginput@gmail.com")
            driver.find_element_by_id("password").send_keys("a"*7)    #key too short
            driver.find_element_by_id("remember").click() 
            driver.find_element_by_css_selector(".btn").click()
            if driver.current_url == "http://localhost:5000/login":
                self.assertTrue(True)                
                if driver.find_element_by_class_name("help-block").text== "Field must be between 8 and 80 characters long.":
                    self.assertTrue(True)
                else:
                    self.assertTrue(False)           
            else:
                self.assertTrue(False)

            #time.sleep(5)

            driver.find_element_by_id("password").send_keys("a"*81)  # key too long
            driver.find_element_by_css_selector(".btn").click()
            if driver.current_url == "http://localhost:5000/login":
                self.assertTrue(True)
                
                if driver.find_element_by_class_name("help-block").text== "Field must be between 8 and 80 characters long.":
                    self.assertTrue(True)
                else:
                    self.assertTrue(False)
                             
            else:
                self.assertTrue(False)

            #time.sleep(5)
    

    def test_2_3_LoginFailure3(self):
        #failed login due to invalid email and key too short (both are labelled by "help-block")

        print("\n\nTesting LoginFailure3 - due to invalid email and key too short\n\n")
        
        driver = Chrome()

        with Chrome() as driver:
            #your code inside this indent
            driver.get("http://localhost:5000")
            driver.find_element_by_link_text("Login").click()
            driver.find_element_by_id("email").send_keys("Wronginput.gmail.com")
            driver.find_element_by_id("password").send_keys("a"*7)
            driver.find_element_by_id("remember").click() # add to click rememrber me
            driver.find_element_by_css_selector(".btn").click()
            if driver.current_url == "http://localhost:5000/login":
                self.assertTrue(True)
                
                #if driver.find_element_by_class_name("form-group  has-error required").find_element_by_class_name("help-block").text== "Invalid email":
                if driver.find_element_by_xpath("/html/body/div[2]/form/div[2]/div[1]/p").text == "Invalid email":
                    self.assertTrue(True)
                else:
                    self.assertTrue(False)
                    
                if driver.find_element_by_xpath("/html/body/div[2]/form/div[2]/div[2]/p").text == "Field must be between 8 and 80 characters long.":
                    self.assertTrue(True)
                else:
                    self.assertTrue(False)

            else:
                self.assertTrue(False)
    
    
    def test_2_4_LoginFailure4(self):
        #email address correst, password incorrect

        print("\n\nTesting LoginFailure4 - due to incorrest password with a valid email\n\n")
        
        driver = Chrome()

        with Chrome() as driver:
            #your code inside this indent
            driver.get("http://localhost:5000")
            driver.find_element_by_link_text("Login").click()
            driver.find_element_by_id("email").send_keys("sampleuser13@mailinator.com")
            driver.find_element_by_id("password").send_keys("a"*8)
            driver.find_element_by_id("remember").click() # add to click rememrber me
            driver.find_element_by_css_selector(".btn").click()
            if driver.current_url == "http://localhost:5000/login":
                self.assertTrue(True)
                
                if driver.find_element_by_xpath("/html/body/div[2]/div/h4").text == "password not correct":
                    self.assertTrue(True)
                else:
                    self.assertTrue(False)
                             
            else:
                self.assertTrue(False)
    
 



    
    def test_3_CreateProject_Existed(self):

        # If this is not the first time to run, the project would be already existed.
        # The roster.xlsx file is downloaded here, but rubric (.json) file should be downloaded by person
        # The path where the files are downloaded should be adjusted if testing at a different computer

        print("\n\nTesting Create the Project\n\n")

        
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

            #click into "Create New Project" using execute_script()
            driver.execute_script("arguments[0].click()",driver.find_element_by_css_selector(".nav-span"))
            time.sleep(2)
            self.assertEqual(driver.current_url, "http://localhost:5000/create_project")  # it keeps giving me http://localhost:5000/instructor_project

            driver.find_element_by_id("project_name").send_keys("Teamwork")
            driver.find_element_by_id("project_description").send_keys("A sample project using an ELPISSrubric for Teamwork")

            driver.find_element_by_link_text("(Download a sample roster files)").click()

            # the following is the steps of rubric download

            '''
            driver.find_element_by_link_text("(Browse sample rubric files)").click()
            driver.find_element_by_link_text("teamwork").click()
            driver.find_element_by_link_text("teamwork_scale3.json").click()
            driver.find_element_by_id("raw-url").click()
            '''
            # then need to save to download (or from the previous step, right click raw - save link as)
   
            
            # Both files should now in download
            
            driver.find_element_by_id("student_file").send_keys("C:/Users/Wangj/Downloads/sample_roster.xlsx") 
            driver.find_element_by_id("json_file").send_keys("C:/Users/Wangj/Downloads/teamwork_scale3.json")
            driver.find_element_by_css_selector(".w3-button").click()
            if driver.current_url == "http://localhost:5000/instructor_project" :  # create a new Project
                self.assertTrue(True)

            elif driver.current_url == "http://localhost:5000/create_project": # project name already exists
                self.assertTrue(True)
                if driver.find_element_by_xpath("/html/body/div[3]/div[2]/div/div/div/form/div[1]/p").text == "The project name has been used before":
                    self.assertTrue(True)
                else:
                    self.assertTrue(False)

            else:
                self.assertTrue(False)
    




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

import unittest

from selenium.webdriver import Chrome
import time

class TestLogin(unittest.TestCase):

    def test_SignUp(self):
        driver = Chrome()

        with Chrome() as driver:
            driver.get("http://localhost:5000")
            driver.find_element_by_link_text("Sign up").click()
            driver.find_element_by_id("email").send_keys("sampleuser13@mailinator.com")
            driver.find_element_by_id("password").send_keys("abcdefgh")
            driver.find_element_by_css_selector(".btn").click()
            if driver.current_url == "http://localhost:5000/login":  # if a new username created
                self.assertTrue(True)
            elif driver.current_url == "http://localhost:5000/signup": # if username already exists
                self.assertTrue(True)
            else:
                self.assertTrue(False)
          
            

    def test_Login(self):
        driver = Chrome()

        with Chrome() as driver:
            #your code inside this indent
            driver.get("http://localhost:5000")
            driver.find_element_by_link_text("Login").click()
            driver.find_element_by_id("email").send_keys("sampleuser13@mailinator.com")
            driver.find_element_by_id("password").send_keys("abcdefgh")
            driver.find_element_by_id("remember").click() # add to click rememrber me
            driver.find_element_by_css_selector(".btn").click()
            self.assertEqual(driver.current_url, "http://localhost:5000/instructor_project")

    
    def test_CreateProject(self):
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
            
            driver.find_element_by_id("student_file").send_keys("D:/CS_Project_Test/sample_roster.xlsx")  # Here these 2 files cannot be set in C drive when testing
            driver.find_element_by_id("json_file").send_keys("D:/CS_Project_Test/teamwork_scale3.json")
            driver.find_element_by_css_selector(".w3-button").click()
            if driver.current_url == "http://localhost:5000/instructor_project" :  # create a new Project
                self.assertTrue(True)

            elif driver.current_url == "http://localhost:5000/create_project": # project name already exists
                self.assertTrue(True)

            else:
                self.assertTrue(False)

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
         

            
    


if __name__ == '__main__':
    unittest.main()

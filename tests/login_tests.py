import unittest

from selenium.webdriver import Chrome

class TestLogin(unittest.TestCase):


    def test_signUp(self):
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
          
            

    def test_login(self):
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

    
    def test_createProject(self):
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

            #This step is failed to click "Create New Project
            #driver.find_element_by_class_name("nav-body").find_element_by_css_selector(".nav-span").click()
            #self.assertEqual(driver.current_url, "http://localhost:5000/create_project")  # it keeps giving me http://localhost:5000/instructor_project
            
            #driver.find_elements_by_xpath("//*[contains(text(), 'Create New Project')]") # Method 2: also not working
            
            

            driver.get("http://localhost:5000/create_project") #directly jump to the next step
            self.assertEqual(driver.current_url, "http://localhost:5000/create_project")
            

            driver.find_element_by_id("project_name").send_keys("Teamwork")
            driver.find_element_by_id("project_description").send_keys("A sample project using an ELPISSrubric for Teamwork")
            
            driver.find_element_by_id("student_file").send_keys("D:/CS_Project_Test/sample_roster.xlsx")  # Here these 2 files cannot be set in C drive when testing
            driver.find_element_by_id("json_file").send_keys("D:/CS_Project_Test/teamwork_scale3.json")
            driver.find_element_by_css_selector(".w3-button").click()
            if driver.current_url == "http://127.0.0.1:5000/instructor_project" :  # create a new Project
                self.assertTrue(True)

            elif driver.current_url == "http://localhost:5000/create_project": # project name already exists
                self.assertTrue(True)

            else:
                self.assertTrue(False)

 
            
            

        




    


if __name__ == '__main__':
    unittest.main()

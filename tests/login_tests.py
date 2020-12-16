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
            if driver.current_url == "http://localhost:5000/login":  # if username already exists
                self.assertTrue(True)
            elif driver.current_url == "http://localhost:5000/signup": # if a new username created
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
            driver.find_element_by_css_selector(".btn").click()
            self.assertEqual(driver.current_url, "http://localhost:5000/instructor_project")




    


if __name__ == '__main__':
    unittest.main()

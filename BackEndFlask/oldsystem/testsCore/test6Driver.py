from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium import webdriver
import time


class Account():
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().
                                                       install()))
        self.driver.get("http://127.0.0.1:5000")
        self.driver.find_element(By.LINK_TEXT, "Login").click()

    # login user and go to Copy Rubric page
    def login_user(self, email, password):
        self.driver.find_element(By.ID, "email").send_keys(email)
        self.driver.find_element(By.ID, "password").send_keys(password)
        createLink = self.driver.find_element(By.TAG_NAME, "button")
        createLink.click()

    # see if we can access the correct page
    def test_page_access(self):
        self.driver.find_element(By.LINK_TEXT, "Copy Rubric").click()
        return self.driver.current_url

    # get to Copy Rubric page and enter a user that doesn't exist
    def test_2_first_search_error(self, keys):
        self.driver.find_element(By.LINK_TEXT, "Copy Rubric").click()
        div = self.driver.find_element(By.CLASS_NAME, "searchBox")
        div.find_element(By.TAG_NAME, "input").send_keys(keys)
        div.find_element(By.CLASS_NAME, "fa.fa-search").click()
        return self.driver.find_element(By.CLASS_NAME, "alert.alert-danger").text

    # enter a rubric that doesn't exist into second search field
    def test_3_second_search_error(self, keys):
        self.driver.find_element(By.LINK_TEXT, "Copy Rubric").click()
        div = self.driver.find_elements(By.CLASS_NAME, "searchBox")[1]
        div.find_element(By.TAG_NAME, "input").send_keys(keys)
        div.find_element(By.CLASS_NAME, "fa.fa-search").click()
        return self.driver.find_element(By.CLASS_NAME, "alert.alert-danger").text

    # test if text appears under button when button is clicked
    def test_4_shared_text(self, text):
        self.driver.find_element(By.LINK_TEXT, "Copy Rubric").click()
        link = self.driver.find_element(
            By.XPATH, "/html/body/div[3]/div/div/div[2]/div[2]/div[4]/button[2]")
        link.click()
        source = self.driver.page_source
        return (text in source)

    # test if project appears when searching in first search box
    def test_5_my_projects_first_search(self, username):
        self.driver.find_element(By.LINK_TEXT, "Copy Rubric").click()
        div = self.driver.find_element(By.CLASS_NAME, "searchBox")
        div.find_element(By.TAG_NAME, "input").send_keys(username)
        div.find_element(By.CLASS_NAME, "fa.fa-search").click()
        try:
            proj = self.driver.find_element(
                By.CLASS_NAME, "w3-card.w3.margin.w3-container.w3-round")
            is_element = True
        except NoSuchElementException:
            is_element = False

        return is_element, proj.find_element(By.CLASS_NAME, "w3-opacity").text

    # search for rubric in second search box
    # def test_6_second_search(self, project_name):
    #     self.driver.find_element(By.LINK_TEXT, "Copy Rubric").click()
    #     div = self.driver.find_elements(By.CLASS_NAME, "searchBox")[1]
    #     div.find_element(By.TAG_NAME, "input").send_keys(project_name)
    #     div.find_element(By.CLASS_NAME, "fa.fa-search").click()
    #     try:
    #         proj = self.driver.find_element(
    #             By.CLASS_NAME, "w3-card.w3.margin.w3-container.w3-round")
    #         is_element = True
    #     except NoSuchElementException:
    #         is_element = False
    #         # proj = self.driver.find_element(By.CLASS_NAME, "w3-opacity").text
    #         proj = self.driver.find_element(By.CLASS_NAME, "w3-card.w3.margin.w3-container.w3-round").find_element(By.CLASS_NAME, "w3-opacity").text
    #     return is_element, proj

    def __del__(self):
        self.driver.quit()

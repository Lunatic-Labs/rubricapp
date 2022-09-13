from selenium.webdriver import Chrome
from loginDriver import LogIn
from ratingDriver import Rating
import time


class Sharing:
    def __init__(self):
        self.driver = Chrome()

    def close(self):
        self.driver.quit()

    def _manage_project(self):
        self.driver.execute_script(
            "arguments[0].click()",
            self.driver.
            find_element_by_link_text("Manage Projects"))
        self.driver.implicitly_wait(5)
        self.driver.find_element_by_xpath("//*[text()='Manage']").click()
        self.driver.implicitly_wait(5)

    def _share_project(self, shareToUser):
        self.driver.find_element_by_xpath(
            "//*[text()='Create new Permission to Share your Rubric']").\
            click()
        self.driver.implicitly_wait(5)

        self.driver.find_element_by_name("username").send_keys(shareToUser)
        self.driver.find_element_by_css_selector(
            "#CNP > div > div > div.modal-footer > button.btn.btn-primary").\
            click()
        self.driver.implicitly_wait(5)

    def _delete_sharing(self):
        self.driver.find_element_by_xpath("//input[@value='delete']").click()
        self.driver.implicitly_wait(5)
        self.driver.switch_to.alert.accept()
        time.sleep(1)
        self.driver.implicitly_wait(5)

    def _logout(self):
        self.driver.execute_script(
            "arguments[0].click()",
            self.driver.find_element_by_link_text("Manage Projects"))
        self.driver.implicitly_wait(5)

    def sharing_project_and_delete(self, username, password, share_to_user):
        # one user shares the project to another user

        # login
        LogIn.login(self, username, password)
        self.driver.implicitly_wait(5)

        # Manage Projects
        Sharing._manage_project(self)

        # share the project
        Sharing._share_project(self, share_to_user)

        # obtain the success_text of sharing
        success_text = self.driver.\
            find_element_by_xpath("//*[text()="
                                  "'Permission successfully created']").\
            text

        # delete the sharing
        Sharing._delete_sharing(self)

        # obtain the deleteSuccess text
        delete_text = self.driver.\
            find_element_by_xpath("//*[text()="
                                  "'successfully delete permission']").\
            text

        Sharing.close(self)

        return (success_text, delete_text)

    def sharing_project_and_check(
            self, username, password,
            shared_user, shared_user_pw,
            project_name, evaluation_name,
            metagroup_name, group_name, rating_level,
            checkbox1, checkbox2, checkbox3):
        # Share the project and modify from the sharedUser

        # Firstly share the project from one user
        # -- (username, password) to (sharedUser, sharedUserPw)
        LogIn.login(self, username, password)
        self.driver.implicitly_wait(5)

        # Manage Projects
        Sharing._manage_project(self)

        # share the project
        Sharing._share_project(self, shared_user)

        # obtain the success_text of sharing
        success_text =\
            self.driver.find_element_by_xpath("//*[@id='feedback']").text

        # logout
        Sharing._logout(self)

        # login as the user who receives the shared project
        # - (sharedUser, sharedUserPw)
        LogIn.login(self, shared_user, shared_user_pw)

        self.driver.execute_script(
            "arguments[0].click()",
            self.driver.find_element_by_xpath("//*[text()='Shared project']"))
        self.driver.execute_script(
            "arguments[0].click()",
            self.driver.find_element_by_link_text("Teamwork2"))

        # rate as a sharedUser
        (statusA, statusB, statusC) = \
            Rating._rate_group(self, username, password,
                               project_name, evaluation_name,
                               metagroup_name, group_name,
                               rating_level, checkbox1, checkbox2, checkbox3)

        # login as the (username, password) again to delete the sharing
        # - ensure to run for another time won't fail
        LogIn.login(self, username, password)
        self.driver.implicitly_wait(5)
        # Manage Projects
        Sharing._manage_project(self)
        # delete the sharing
        Sharing._delete_sharing(self)

        Sharing.close(self)

        return (statusA, statusB, statusC)

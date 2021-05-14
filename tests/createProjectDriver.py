from loginDriver import LogIn
from selenium.webdriver import Chrome

import time


class CreateProject:

    def __init__(self):
        self.driver = Chrome()

    def close(self):
        self.driver.quit()

    def _set_project_description(self, project_description, project_password):

        self.driver.find_element_by_id("project_name"). \
            send_keys(project_description)
        self.driver.find_element_by_id("project_description"). \
            send_keys(project_password)

    def _set_roster(self, student_file):

        self.driver.find_element_by_id("student_file").send_keys(student_file)

    def _set_rubrics(self, json_file):
        self.driver.find_element_by_id("json_file").send_keys(json_file)

    def create_project(self, username, password, project_description,
                       project_password, student_file, json_file):

        LogIn.login(self, username, password)
        self.driver.implicitly_wait(5)
        text = "Create New Project"
        self.driver.execute_script("arguments[0].click()", self.
                                   driver.find_element_by_link_text(text))
        self.driver.implicitly_wait(5)

        CreateProject._set_project_description(self, project_description,
                                               project_password)

        CreateProject._set_roster(self, student_file)

        CreateProject._set_rubrics(self, json_file)

        # This is for submission
        self.driver.find_element_by_css_selector(".w3-button").click()
        self.driver.implicitly_wait(5)

    def create_project_attempt(self, username, password, project_description,
                               project_password, student_file, json_file):

        self.create_project(username, password, project_description,
                            project_password, student_file, json_file)

        url_current = self.driver.current_url

        try:
            # Issue 219 - these error messages are not showing
            xpath = "/html/body/div[3]/div[2]/div/div/div/form/div[1]/p"
            if self.driver.find_element_by_xpath(xpath).text is not None:
                alert_info = self.driver.find_element_by_xpath(xpath).text
        except Exception:
            alert_info = "no error"
        CreateProject.close(self)

        return (url_current, alert_info)

    def project_name_description_alerts(self, username, password,
                                        project_description, project_password,
                                        student_file, json_file):
        self.create_project(username, password, project_description,
                            project_password, student_file, json_file)

        text1 = 'Field must be between 3 and 150 characters long.'
        text2 = 'Field must be between 0 and 255 characters long.'

        alert1 = self.driver.find_element_by_xpath(
            "//*[text()=\"" + text1 + "\"]").text
        alert2 = self.driver.find_element_by_xpath(
            "//*[text()=\"" + text2 + "\"]").text
        self.driver.implicitly_wait(5)
        CreateProject.close(self)
        return (alert1, alert2)

    def get_invalid_file_alert(self, username, password, project_description,
                               project_password, student_file, json_file):
        self.create_project(username, password, project_description,
                            project_password, student_file, json_file)
        # issue 210 - these error messages are not showing right now,
        # should change to robust xpath if this messages problem is fixed
        xpath1 = "/html/body/div[3]/div[2]/div/div/div/form/div[3]/p"
        xpath2 = "/html/body/div[3]/div[2]/div/div/div/form/div[4]/p"
        alert1 = self.driver.find_element_by_xpath(xpath1).text
        alert2 = self.driver.find_element_by_xpath(xpath2).text
        self.driver.implicitly_wait(5)
        CreateProject.close(self)
        return (alert1, alert2)

    def rubric_file(self, username, password):

        LogIn.login(self, username, password)
        text = "Create New Project"
        self.driver.execute_script("arguments[0].click()", self.
                                   driver.find_element_by_link_text(text))
        self.driver.implicitly_wait(5)

        url = self.driver.current_url
        window_before = self.driver.window_handles[0]
        # This would open a new window
        text = '(Browse sample rubric files)'
        self.driver.\
            find_element_by_xpath("//*[text()=\"" + text + "\"]").click()
        self.driver.implicitly_wait(5)
        window_after = self.driver.window_handles[1]
        self.driver.switch_to_window(window_after)
        self.driver.implicitly_wait(5)

    def rubric_file_teamwork(self, username, password):

        CreateProject.rubric_file(self, username, password)
        self.driver.find_element_by_xpath("//*[text()='teamwork']").click()
        self.driver.implicitly_wait(5)
        text = 'teamwork_scale3.json'
        self.driver.\
            find_element_by_xpath("//*[text()=\"" + text + "\"]").click()
        url_rubric = self.driver.current_url
        CreateProject.close(self)
        return url_rubric

    def rubric_file_info_process(self, username, password):

        CreateProject.rubric_file(self, username, password)
        text1 = 'information_processing'
        self.driver.\
            find_element_by_xpath("//*[text()=\"" + text1 + "\"]").click()
        self.driver.implicitly_wait(5)
        text2 = 'information_processing.json'
        self.driver.\
            find_element_by_xpath("//*[text()=\"" + text2 + "\"]").click()
        url = self.driver.current_url
        CreateProject.close(self)
        return url

    def rubric_file_communication(self, username, password):

        CreateProject.rubric_file(self, username, password)
        text1 = 'interpersonal_communication'
        self.driver.\
            find_element_by_xpath("//*[text()=\"" + text1 + "\"]").click()
        self.driver.implicitly_wait(5)
        text2 = 'interpersonal_communication_scale3.json'
        self.driver.\
            find_element_by_xpath("//*[text()=\"" + text2 + "\"]").click()
        url = self.driver.current_url

        CreateProject.close(self)
        return url

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from loginDriver import LogIn
import time


class Rating:
    def __init__(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    def close(self):
        self.driver.quit()

    def _get_time_creation_of_evaluation(self):
        html = self.driver.page_source
        str1 = "grade by"
        a = html.find(str1)
        time_creation = html[(a-21):(a-2)]
        return time_creation

    def _username_to_css_username(username):
        css = "#"
        for s in username:
            if s == '@':
                css = css + "\@"
            elif s == ".":
                css = css + "\."
            else:
                css = css + s
        return css

    def _get_css_username_and_time_create_of_evaluation(self, username):
        # both css-username and creation time are used for locating elements

        # get time creation of the evaluation
        time_creation = Rating._get_time_creation_of_evaluation(self)
        # set username in css format
        css = Rating._username_to_css_username(username)
        return (time_creation, css)

    def _rate_interacting_level(self, css, time_creation, level):
        switcher = {
            "N/A"         : "1",
            "No evidence" : "2",
            "Rarely"      : "3",
            "Sporadically": "4",
            "Frequently"  : "5"
        }
        self.driver.\
            find_element(By.CSS_SELECTOR, css + time_creation +
                                         "\|Interacting0 ."
                                         "w3-parallel-box:nth-child(" +
                                         switcher.
                                         get(level, "None") + ") .L-labels").\
            click()

    def _rate_interacting_checkbox(self, username, timeCreation, choice):
        # choice is limited to "a", "b", "c"
        rate = self.driver.find_element(By.ID, username +
                                              timeCreation +
                                              "|Interacting|"
                                              "Observed Characteristics|" +
                                              choice)

        if not rate.is_selected():
            rate.click()
        status = rate.is_selected()
        return status

    def _rate_interacting(self, css, username, time_creation, level,
                          choice1=False, choice2=False, choice3=False):
        # Rate the level in Interacting category

        # click the dropdown for rating Interacting:
        self.driver.find_element(By.CSS_SELECTOR, "#Interacting\|" +
                                                 css[1:] + time_creation +
                                                 "\|panel-heading ."
                                                 "cateNames").\
            click()

        # Rate the level
        Rating._rate_interacting_level(self, css, time_creation, level)

        # Rate the checkboxes:
        status1 = status2 = status3 = False
        # here rate checkbox "a"
        if choice1:
            status1 = Rating.\
                _rate_interacting_checkbox(self, username, time_creation, "a")
        # here rate checkbox "b"
        if choice2:
            status2 = Rating.\
                _rate_interacting_checkbox(self, username, time_creation, "b")
        # here rate checkbox "c"
        if choice3:
            status3 = Rating.\
                _rate_interacting_checkbox(self, username, time_creation, "c")

        # Save the rating
        self.driver.find_element(By.ID, "button").click()
        self.driver.implicitly_wait(5)

        return (status1, status2, status3)

    def _switch_group(self, group_name):

        # For now (0425) there is an issue
        # - duplicate code existing on rating page.
        self.driver.find_elements(By.CSS_SELECTOR,
            "#" + group_name + "> li")[1].click()

        self.driver.switch_to.alert.accept()

    def _select_project(self, project_name):
        self.driver.execute_script(
            "arguments[0].click()", self.
            driver.find_element(By.LINK_TEXT, project_name))
        self.driver.implicitly_wait(5)

    def _select_evaluation(self, metagroup_name):
        self.driver.find_element(By.LINK_TEXT, metagroup_name).click()
        self.driver.implicitly_wait(5)

    def _rate_group(self, username, password, project_name,
                    evaluation_name, metagroup_name, group_name, rating_level,
                    checkbox1=False, checkbox2=False, checkbox3=False):
        # rate one group as desired.
        # For now it's limited to rate "Interacting" only

        # Select evaluation and the metagroup to rate
        Rating._select_evaluation(self, metagroup_name)
        self.driver.implicitly_wait(5)

        # select group to rate
        Rating._switch_group(self, group_name)

        # obtain creation time of the evaluation,
        # and css version of username for locating element
        (timeCreation, css) = Rating.\
            _get_css_username_and_time_create_of_evaluation(self, username)

        # Rate the interacting category
        (statusA, statusB, statusC) = \
            Rating._rate_interacting(self, css, username, timeCreation,
                                     rating_level,
                                     checkbox1, checkbox2, checkbox3)

        return (statusA, statusB, statusC)

    def rating_one_group(self, username, password, project_name,
                         evaluation_name, metagroup_name, group_name,
                         rating_level,
                         checkbox1=False, checkbox2=False, checkbox3=False):

        # login
        LogIn.login(self, username, password)

        # Select project
        Rating._select_project(self, project_name)

        # Rate group
        (statusA, statusB, statusC) = Rating.\
            _rate_group(self, username, password, project_name, evaluation_name,
                        metagroup_name, group_name, rating_level,
                        checkbox1, checkbox2, checkbox3)

        Rating.close(self)
        return (statusA, statusB, statusC)

    def rate_attendance(self, username, password, project_name,
                        evaluation_name, metagroup_name,
                        group_name, student_name_to_check):
        # login
        LogIn.login(self, username, password)

        # Select project
        Rating._select_project(self, project_name)

        # Select evaluation and the metagroup to rate
        Rating._select_evaluation(self, metagroup_name)

        # Select the group to rate
        Rating._switch_group(self, group_name)

        # Expand the "attendance" dropdown
        css1 = "body > div.middle > div.middle-left > " \
               "div:nth-child(2) > button:nth-child(5)"
        self.driver.find_element(By.CSS_SELECTOR, css1).click()

        # Issue 222 - duplicate code existing on rating page.
        response_list = self.driver.\
            find_elements(By.XPATH, "//input[@value='"
                                   + student_name_to_check + "']")
        self.driver.implicitly_wait(5)
        response = response_list[1]

        if not response.is_selected():
            response.click()
        self.driver.find_element(By.ID, "AttendenceButton").click()
        self.driver.implicitly_wait(5)
        is_response = response.is_selected()

        Rating.close(self)

        return is_response

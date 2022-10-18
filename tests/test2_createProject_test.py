from createProjectDriver import CreateProject
from signUpDriver import SignUp
import unittest
import random
import os

class TestCreateProject(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
    password = "abcdefgh"
    projectname = "Project Name Test"
    invalidprojectname = "p"
    missingprojectname = ""
    projectdescription = "Project Description"
    rosterfile = os.getcwd() + "/sample_roster.xlsx"
    rubricfile = os.getcwd() + "/teamwork_scale3.json"

    def test0_signup_new_user(self):
        signup = SignUp()
        signup.sign_up_user(self.email, self.password, self.password)
        del signup

    # New test that checks for successful project creation
    def test1_successful_create_project(self):
        create_project = CreateProject()
        current_url = create_project.create_project_get_current_url_after_created_project(self.email, self.password, self.projectname, self.projectdescription, self.rosterfile, self.rubricfile)
        del create_project
        self.assertTrue(current_url.find("instructor_project"))
    
    # New test that checks for invalid project name
    def test2_invalid_project_name(self):
        create_project = CreateProject()
        alert = create_project.create_project_get_projectname_message(self.email, self.password, self.invalidprojectname, self.projectdescription, self.rosterfile, self.rubricfile)
        del create_project
        self.assertTrue(alert == "Please lengthen this text to 3 characters or more (you are currently using 1 character).")
    
    # New test that checks for invalid roster_file
    def test3_invalid_roster_file(self):
        create_project = CreateProject()
        current_url = create_project.create_project_get_current_url_after_created_project(self.email, self.password, self.projectname, self.projectdescription, self.rubricfile, self.rubricfile)
        del create_project
        self.assertTrue(current_url.find("create_project"))
    
    # New test that checks for invalid rubric_file
    def test4_invalid_rubric_file(self):
        create_project = CreateProject()
        current_url = create_project.create_project_get_current_url_after_created_project(self.email, self.password, self.projectname, self.projectdescription, self.rubricfile, self.rubricfile)
        del create_project
        self.assertTrue(current_url.find("create_project"))
    
    # New test that checks for missing project name
    def test5_missing_project_name(self):
        create_project = CreateProject()
        alert = create_project.create_project_get_projectname_message(self.email, self.password, self.missingprojectname, self.projectdescription, self.rosterfile, self.rubricfile)
        del create_project
        self.assertTrue(alert == "Please fill out this field.")
    
    # New test that checks for missing roster_file
    def test6_missing_roster_file(self):
        create_project = CreateProject()
        alert = create_project.create_project_get_roster_file_message_missing(self.email, self.password, self.projectname, self.projectdescription, self.rubricfile)
        del create_project
        self.assertTrue(alert == "Please select a file.")

    # New test that checks for missing rubric_file
    def test7_missing_rubric_file(self):
        create_project = CreateProject()
        alert = create_project.create_project_get_rubric_file_message_missing(self.email, self.password, self.projectname, self.projectdescription, self.rosterfile)
        del create_project
        self.assertTrue(alert == "Please select a file.")

    # New test that checks if the browse sample rubrics works
    def test8_browse_sample_rubric(self):
        create_project = CreateProject()
        current_url = create_project.create_project_get_url_after_clicking_browse_sample_rubric(self.email, self.password)
        del create_project
        self.assertTrue(current_url == "https://github.com/Lunatic-Labs/rubricapp/tree/master/sample_file/rubrics")

if __name__ == '__main__':
    unittest.main()

# class Configure:
#     def configure_test_1_success_or_existed():

#         (username, password) = \
#             ("sampleuser_CreateProject@mail.com", "abcdefgh")
#         conf = ConfigureUsernamePassword()
#         conf.username = username
#         conf.password = password
#         return conf

#     def configure_test_3_create_project_success():
#         # both xlsx and json files are downloaded in the selenium/tests
#         (username, password) = \
#             ("sampleuser_CreateProject@mail.com", "abcdefgh")
#         (project_name, project_description) =\
#             ("Teamwork", "A sample project using an ELPISSrubric for Teamwork")
#         (student_file, json_file) = \
#             (os.getcwd() + "/sample_roster.xlsx",
#              os.getcwd() + "/teamwork_scale3.json")

#         conf1 = ConfigureUsernamePassword()
#         conf1.username = username
#         conf1.password = password

#         conf2 = ConfigureProject
#         conf2.project_name = project_name
#         conf2.project_description = project_description
#         conf2.student_file = student_file
#         conf2.json_file = json_file

#         return (conf1, conf2)

#     def configure_test3_1_invalid_project_name_and_description():
#         # both xlsx and json files are downloaded in the selenium/tests
#         (username, password) = \
#             ("sampleuser_CreateProject@mail.com", "abcdefgh")
#         (projectname, projectdescription) = ("12", "1"*500)
#         (student_file, json_file) = \
#             (os.getcwd() + "/sample_roster.xlsx",
#              os.getcwd() + "/teamwork_scale3.json")

#         conf1 = ConfigureUsernamePassword()
#         conf1.username = username
#         conf1.password = password

#         conf2 = ConfigureProject
#         conf2.project_name = projectname
#         conf2.project_description = projectdescription
#         conf2.student_file = student_file
#         conf2.json_file = json_file
#         return (conf1, conf2)

#     def configure_test_3_2_create_project_invalid_file_format():
#         # both xlsx and json files are downloaded in the selenium/tests

#         (username, password) = \
#             ("sampleuser_CreateProject@mail.com", "abcdefgh")
#         (projectname, projectdescription) = \
#             ("Teamwork", "A sample project using an ELPISSrubric for Teamwork")
#         (studentFile, jsonFile) = \
#             (os.getcwd() + "/teamwork_scale3.json",
#              os.getcwd() + "/sample_roster.xlsx")
#         return (username, password, projectname,
#                 projectdescription, studentFile, jsonFile)


# class TestCreateProject(unittest.TestCase):

#     def test1_sign_up_existed(self):

#         test_sign_up = SignUp()
#         conf = Configure.configure_test_1_success_or_existed()
#         (username, password) = (conf.username, conf.password)
#         (urlCurrent, alertInfo) = test_sign_up.sign_up(username, password)

#     def test3_create_project_success(self):
#         # success or duplicate project name error
#         (conf1, conf2) = Configure.configure_test_3_create_project_success()
#         (username, password) = (conf1.username, conf1.password)
#         (project_name, project_description, student_file, json_file) = (conf2.project_name, conf2.project_description, conf2.student_file, conf2.json_file)

#         create_p = CreateProject()

#         (url_current, alert_info) = create_p.create_project_attempt(username, password, project_name, project_description, student_file, json_file)

#         url1 = "http://localhost:5000/instructor_project"
#         is_project_created = url_current == url1

#         url2 = "http://localhost:5000/create_project"
#         is_project_not_created = url_current == url2
#         # issue 219 - the error message
#         #  -- "The project name has been used before" is missing.
#         # here I am just using the current info being detected
#         is_alert_info = alert_info == "3-150 characters"

#         msg = alert_info

#         self.assertTrue(is_project_created or (is_project_not_created and is_alert_info), msg)

#     def test3_1_create_project_invalid_project_name_and_description(self):
#         # invalid length of project name and description
#         (conf1, conf2) = Configure.configure_test3_1_invalid_project_name_and_description()
#         (username, password) = (conf1.username, conf1.password)
#         (project_name, project_description, student_file, json_file) = (conf2.project_name, conf2.project_description, conf2.student_file, conf2.json_file)

#         create_p = CreateProject()

#         (alert1, alert2) = create_p.project_name_description_alerts(username, password, project_name, project_description, student_file, json_file)

#         # is_alert1 = alert1 == "Field must be between 3 and 150 characters long."
#         # is_alert2 = alert2 == "Field must be between 0 and 255 characters long."
#         # The error message for alert1 above is not invoked, the correct alert1 error message is below
#         # There is no alert2 error message that is invoked, therefore the alert2 error message is the empty string
#         is_alert1 = alert1 == "Please lengthen this text to 3 characters or more (you are currently using 2 characters)."
#         is_alert2 = alert2 == ""
#         self.assertTrue(is_alert1 and is_alert2)

#     # issue219 - the error messages are currently not shown
#     # -this unit is not tested using since 0413

#     # def test_3_2_CreateProject_InvalidFileFormat(self):
#     #     # incorrect format of files uploaded for Roster and Rubric
#     #
#     #     (conf1, conf2) = Configure.\
#     #         configure_test_3_2_create_project_invalid_file_format()
#     #     (username, password) = (conf1.username, conf1.password)
#     #     (project_name, project_description, student_file, json_file) =\
#     #         (conf2.project_name, conf2.project_description,
#     #          conf2.student_file, conf2.json_file)
#     #     create_p = CreateProject()
#     #
#     #     (alert1, alert2) = create_p.\
#     #         getInvalidFileAlert(username, password, project_name,
#     #                             project_description, student_file, json_file)
#     #     text = "'charmap' codec can't decode byte " \
#     #            "0x81 in position 22: character maps to <undefined>"
#     #     is_alert1 = alert1 == "File is not a zip file"
#     #     is_alert2 = alert2 == text
#     #
#     #     self.assertTrue(is_alert1 and is_alert2)
#     #
#     def test_3_0_rubric_file_teamwork(self):
#         # test the rubric file - teamwork_scale3 location

#         conf = Configure.configure_test_1_success_or_existed()
#         (username, password) = (conf.username, conf.password)
#         create_p = CreateProject()

#         url = create_p.rubric_file_teamwork(username, password)
#         # std_url = "https://github.com/sotl-technology/rubricapp/blob/master/sample_file/rubrics/teamwork/teamwork_scale3.json"
#         # The url above does not matches the current url because the project "rubricapp" is in a new repository "Lunatic-Labs"
#         # std_url = "https://github.com/Lunatic-Labs/rubricapp/blob/master/sample_file/rubrics/teamwork/teamwork_scale3.json"
#         # is_url_true = url == "https://github.com/Lunatic-Labs/rubricapp/blob/master/sample_file/rubrics/teamwork/teamwork_scale3.json"
#         # self.assertTrue(is_url_true)
#         # Removed unnecessary variable "is_url_true" because it is only used once
#         # For some reason the directory of "/blob/" changed to "/tree/" and vice versa at random
#         self.assertTrue(url == "https://github.com/Lunatic-Labs/rubricapp/blob/master/sample_file/rubrics/teamwork/teamwork_scale3.json")

#     def test_3_0_rubric_file_infoProcess(self):
#         # test the rubric file - information_processing location

#         # (username, password) = Configure.configure_test_1_successOrExisted()
#         conf = Configure.configure_test_1_success_or_existed()
#         (username, password) = (conf.username, conf.password)
#         create_p = CreateProject()

#         url = create_p.rubric_file_info_process(username, password)
#         # std_url = "https://github.com/sotl-technology/rubricapp/blob/master/sample_file/rubrics/information_processing/information_processing.json"
#         # The url above does not matches the current url because the project "rubricapp" is in a new repository "Lunatic-Labs"
#         # std_url = "https://github.com/Lunatic-Labs/rubricapp/tree/master/sample_file/rubrics/information_processing/information_processing.json"
#         # is_url_true = url == "https://github.com/Lunatic-Labs/rubricapp/blob/master/sample_file/rubrics/information_processing/information_processing.json"
#         # self.assertTrue(is_url_true)
#         # Removed unnecessary variable "is_url_true" because it is only used once
#         # For some reason the directory of "/blob/" changed to "/tree/" and vice versa at random
#         self.assertTrue(url == "https://github.com/Lunatic-Labs/rubricapp/blob/master/sample_file/rubrics/information_processing/information_processing.json")

#     def test_3_0_rubric_file_communication(self):
#         # test the rubric file - interpersonal_communication location
#         # (username, password) = Configure.configure_test_1_successOrExisted()
#         conf = Configure.configure_test_1_success_or_existed()
#         (username, password) = (conf.username, conf.password)
#         create_p = CreateProject()

#         url = create_p.rubric_file_communication(username, password)
#         # std_url = "https://github.com/sotl-technology/rubricapp/blob/master/sample_file/rubrics/interpersonal_communication/interpersonal_communication_scale3.json"
#         # The url above does not matches the current url because the project "rubricapp" is in a new repository "Lunatic-Labs"
#         # std_url = "https://github.com/Lunatic-Labs/rubricapp/blob/master/sample_file/rubrics/interpersonal_communication/interpersonal_communication_scale3.json"
#         # is_url_true = url == "https://github.com/Lunatic-Labs/rubricapp/blob/master/sample_file/rubrics/interpersonal_communication/interpersonal_communication_scale3.json"
#         # self.assertTrue(is_url_true)
#         # Removed unnecessary variable "is_url_true" because it is only used once
#         # For some reason the directory of "/blob/" changed to "/tree/" and vice versa at random
#         self.assertTrue(url == "https://github.com/Lunatic-Labs/rubricapp/blob/master/sample_file/rubrics/interpersonal_communication/interpersonal_communication_scale3.json")
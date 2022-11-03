from createProjectDriver import CreateProject
from signUpDriver import SignUp
import unittest
import random
import os


class TestCreateProject(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(
        random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
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
        current_url = create_project.create_project_get_current_url_after_created_project(
            self.email, self.password, self.projectname, self.projectdescription, self.rosterfile, self.rubricfile)
        del create_project
        self.assertTrue(current_url.find("instructor_project"))

    # New test that checks for invalid project name
    def test2_invalid_project_name(self):
        create_project = CreateProject()
        alert = create_project.create_project_get_projectname_message(
            self.email, self.password, self.invalidprojectname, self.projectdescription, self.rosterfile, self.rubricfile)
        del create_project
        self.assertTrue(
            alert == "Please lengthen this text to 3 characters or more (you are currently using 1 character).")

    # New test that checks for invalid roster_file
    def test3_invalid_roster_file(self):
        create_project = CreateProject()
        current_url = create_project.create_project_get_current_url_after_created_project(
            self.email, self.password, self.projectname, self.projectdescription, self.rubricfile, self.rubricfile)
        del create_project
        self.assertTrue(current_url.find("create_project"))

    # New test that checks for invalid rubric_file
    def test4_invalid_rubric_file(self):
        create_project = CreateProject()
        current_url = create_project.create_project_get_current_url_after_created_project(
            self.email, self.password, self.projectname, self.projectdescription, self.rubricfile, self.rubricfile)
        del create_project
        self.assertTrue(current_url.find("create_project"))

    # New test that checks for missing project name
    def test5_missing_project_name(self):
        create_project = CreateProject()
        alert = create_project.create_project_get_projectname_message(
            self.email, self.password, self.missingprojectname, self.projectdescription, self.rosterfile, self.rubricfile)
        del create_project
        self.assertTrue(alert == "Please fill out this field.")

    # New test that checks for missing roster_file
    def test6_missing_roster_file(self):
        create_project = CreateProject()
        alert = create_project.create_project_get_roster_file_message_missing(
            self.email, self.password, self.projectname, self.projectdescription, self.rubricfile)
        del create_project
        self.assertTrue(alert == "Please select a file.")

    # New test that checks for missing rubric_file
    def test7_missing_rubric_file(self):
        create_project = CreateProject()
        alert = create_project.create_project_get_rubric_file_message_missing(
            self.email, self.password, self.projectname, self.projectdescription, self.rosterfile)
        del create_project
        self.assertTrue(alert == "Please select a file.")

    # New test that checks if the browse sample rubrics works
    def test8_browse_sample_rubric(self):
        create_project = CreateProject()
        current_url = create_project.create_project_get_url_after_clicking_browse_sample_rubric(
            self.email, self.password)
        del create_project
        self.assertTrue(
            current_url == "https://github.com/Lunatic-Labs/rubricapp/tree/master/sample_file/rubrics")


if __name__ == '__main__':
    unittest.main()

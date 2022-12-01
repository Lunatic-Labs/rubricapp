from signUpDriver import SignUp
from sharingDriver import Sharing
import unittest
import random
import os
 
class TestSharing(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
    password = "abcdefgh"
    projectname = "Project Name Test"
    projectdescription = "Project Description"
    rosterfile = os.getcwd().replace(os.path.join(os.path.sep, "tests"), "") + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "sample_file") + os.path.join(os.path.sep, "rosters") + os.path.join(os.path.sep, "sample_roster.xlsx")
    rubricfile = os.getcwd().replace(os.path.join(os.path.sep, "tests"), "") + os.path.join(os.path.sep, "core") + os.path.join(os.path.sep, "sample_file") + os.path.join(os.path.sep, "rubrics") + os.path.join(os.path.sep, "teamwork") + os.path.join(os.path.sep, "teamwork_scale3.json")
    evaluationname = "Evaluation Name Test"
    evaluationdescription = "This is a test description for the Evaluation!"

    # New Test for signing up
    def test0_signup_new_user (self):
        signup = SignUp()
        signup.sign_up_user(self.email, self.password, self.password)
        del signup

    # Manage Projects Page
    # New Test for checking project name link works
    def test1_check_project_name_link_works(self):
        create_sharing = Sharing()
        url = create_sharing.create_sharing_return_current_url_after_clicking_project_name_link(self.email, self.password, self.projectname, self.projectdescription, self.rosterfile, self.rubricfile, self.evaluationname, self.evaluationdescription)
        del create_sharing
        self.assertTrue(url.find("load_project"))

    # New Test for checking if manage button works
    def test2_check_if_manage_button_works(self):
        create_sharing = Sharing()
        url = create_sharing.create_sharing_return_current_url_after_clicking_manage_projects_button(self.email, self.password, self.projectname)
        del create_sharing
        self.assertTrue(url.find("project_profile"))

    # New Test for checking if delete button works

    # New Test for checking if downloading button works

    # Page After Clicking Manage Projects Page
    # New Test for checking if Manage Projects Link in the .breadcrumbs element works

    # New Test for checking if send email button works

    # New Test for checking if send with scores switch works

    # New Test for checking if grade complete see details link works

    # New Test for checking if clicking meta group that is complete after clicking grade complete see details link works

    # New Test for checking if grade incomplete see details link works

    # New Test for checking if clicking meta group that is incomplete after clicking grade incomplete see details link works

    # New Test for checking if display all details link works

    # New Test for checking if after clicking display all details link, if delete button works

    # New Test for checking if create new permission button works.

    # New Test for checking if after clicking create new permission button, if entering valid email to share works

    # New Test for checking if after clicking create new permission button, if entering invalid email to share works

    # New Test for checking if clicking update group button after editing a student's email that is valid works

    # New Test for checking if clicking update group button after editing a student's email that is invalid works
    
if __name__ == "__main__":
    unittest.main()
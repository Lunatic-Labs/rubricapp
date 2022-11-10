from signUpDriver import SignUp
from ratingDriver import Rating
import unittest
import random
import os


class TestRating(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(
        random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
    password = "abcdefgh"
    projectname = "Project Name Test"
    projectdescription = "Project Description"
    rosterfile = os.getcwd() + "/sample_roster.xlsx"
    rubricfile = os.getcwd() + "/teamwork_scale3.json"
    evaluationname = "Evaluation Name Test"
    evaluationdescription = "This is a test description for the Evaluation!"

    def test0_signup_new_user(self):
        signup = SignUp()
        signup.sign_up_user(self.email, self.password, self.password)
        del signup

    # New test that checks if the project name link works
    def test1_check_if_project_name_link_works(self):
        create_rating = Rating()
        current_url = create_rating.create_rating_get_current_url_after_clicking_project_name_link(
            self.email, self.password, self.projectname, self.projectdescription, self.rosterfile, self.rubricfile, self.evaluationname, self.evaluationdescription)
        del create_rating
        self.assertTrue(current_url.find("load/project"))

    # New test that checks if the projects link works
    def test2_check_if_projects_link_works(self):
        create_rating = Rating()
        current_url = create_rating.create_rating_get_current_url_after_clicking_projects_link(
            self.email, self.password, self.projectname)
        del create_rating
        self.assertTrue(current_url.find("instructor_project"))

    # New test that checks if the subgroup link when click triggers alert with corresponding text
    def test3_check_if_subgroup_works(self):
        create_rating = Rating()
        text = create_rating.create_rating_switch_to_different_subgroup(
            self.email, self.password, self.projectname)
        del create_rating
        self.assertTrue(text == "Do you want to switch group?")

    # New test that checks if the meta group link when click triggers alert with corresponding text
    def test4_check_if_metagroup_works(self):
        create_rating = Rating()
        text = create_rating.create_rating_switch_to_different_metagroup(
            self.email, self.password, self.projectname)
        del create_rating
        self.assertTrue(text == "Do you want to switch meta group?")
    
    # New test that checks if attendance saves for checking student present
    def test5_check_if_checked_attendance_works(self):
        create_rating = Rating()
        condition = create_rating.create_rating_check_student_present(self.email, self.password, self.projectname)
        del create_rating
        self.assertTrue(condition)

    # New test that checks if attendance saves for unchecking student present
    def test6_check_if_unchecked_attedance_works(self):
        create_rating = Rating()
        condition = create_rating.create_rating_check_student_unpresent(self.email, self.password, self.projectname)
        del create_rating
        self.assertTrue(not condition)


if __name__ == "__main__":

    unittest.main()


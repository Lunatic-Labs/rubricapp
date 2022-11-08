from evaluationDriver import CreateEvaluation
from signUpDriver import SignUp
import unittest
import random
import os


class TestEvaluation(unittest.TestCase):
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

    # New test that checks if the Projects link in the div.breadcrumbs works
    def test1_check_if_projects_link_works(self):
        create_evaluation = CreateEvaluation()
        current_url = create_evaluation.create_evaluation_get_current_url_after_clicking_projects_link(
            self.email, self.password, self.projectname, self.projectdescription, self.rosterfile, self.rubricfile)
        del create_evaluation
        self.assertTrue(current_url.find("instructor_project"))

    # New test that checks for a successful creation of a new evaluation
    def test2_successful_create_evaluation(self):
        create_evaluation = CreateEvaluation()
        current_url = create_evaluation.create_evaluation_create_a_new_evaluation(
            self.email, self.password, self.projectname, self.evaluationname, self.evaluationdescription)
        del create_evaluation
        self.assertTrue(current_url.find("load_project"))

    # New test that checks cannot make new evaluation because evaluation_name already exists
    def test3_unsuccessfull_evaluation_name_already_exists(self):
        create_evaluation = CreateEvaluation()
        alert = create_evaluation.create_evaluation_create_a_new_evaluation_again_get_error_message(
            self.email, self.password, self.projectname, self.evaluationname, self.evaluationdescription)
        del create_evaluation
        self.assertTrue(alert == "The evaluation_name has been used before")

    # New test that checks if the subgroup link works
    def test4_check_if_subgroup_link_works(self):
        create_evaluation = CreateEvaluation()
        current_url = create_evaluation.create_evaluation_click_project_subgroup(
            self.email, self.password, self.projectname, self.evaluationname, self.evaluationdescription)
        del create_evaluation
        self.assertTrue(current_url.find("jump_to_evaluation_page"))


if __name__ == "__main__":

    unittest.main()


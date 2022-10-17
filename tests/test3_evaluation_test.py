from evaluationDriver import CreateEvaluation
from signUpDriver import SignUp
import unittest
import random
import os

# class Configure:
#     def configure_test_1_success_or_existed():
#         (username, password) = \
#             ("sampleuser_CreateEvaluation@mail.com", "abcdefgh")
#         conf = ConfigureUsernamePassword()
#         conf.username = username
#         conf.password = password
#         return conf

#     def configure_test_3_create_project_success():
#         # both xlsx and json files are downloaded in the selenium/tests
#         (username, password) = \
#             ("sampleuser_CreateEvaluation@mail.com", "abcdefgh")
#         (project_name, project_description) = \
#             ("Informational Processing1",
#              "A sample project using an ELPISSrubric "
#              "for Informational Processing")
#         (student_file, json_file) = \
#             (os.getcwd() + "/sample_roster.xlsx",
#              os.getcwd() + "/interpersonal_communication_scale3.json")

#         conf1 = ConfigureUsernamePassword()
#         conf1.username = username
#         conf1.password = password

#         conf2 = ConfigureProject
#         conf2.project_name = project_name
#         conf2.project_description = project_description
#         conf2.student_file = student_file
#         conf2.json_file = json_file

#         return (conf1, conf2)

#     def configure_test_evaluations():
#         (username, password) = \
#             ("sampleuser_CreateEvaluation@mail.com", "abcdefgh")
#         (project_name, evaluation_name) = \
#             ("Informational Processing", "Week 1")

#         conf1 = ConfigureUsernamePassword()
#         conf1.username = username
#         conf1.password = password

#         conf2 = ConfigureEvaluation
#         conf2.project_name = project_name
#         conf2.evaluation_name = evaluation_name

#         return (conf1, conf2)

class TestEvaluation(unittest.TestCase):
    email = "signupname" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12)) + "@gmail.com"
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
        current_url = create_evaluation.create_evaluation_get_current_url_after_clicking_projects_link(self.email, self.password, self.projectname, self.projectdescription, self.rosterfile, self.rubricfile)
        del create_evaluation
        self.assertTrue(current_url.find("instructor_project"))
    
    # New test that checks for a successful creation of a new evaluation
    def test2_successful_create_evaluation(self):
        create_evaluation = CreateEvaluation()
        current_url = create_evaluation.create_evaluation_create_a_new_evaluation(self.email, self.password, self.projectname, self.evaluationname, self.evaluationdescription)
        del create_evaluation
        self.assertTrue(current_url.find("load_project"))
    
    # New test that checks cannot make new evaluation because evaluation_name already exists
    def test3_unsuccessfull_evaluation_name_already_exists(self):
        create_evaluation = CreateEvaluation()
        alert = create_evaluation.create_evaluation_create_a_new_evaluation_again_get_error_message(self.email, self.password, self.projectname, self.evaluationname, self.evaluationdescription)
        del create_evaluation
        self.assertTrue(alert == "The evaluation_name has been used before")
    
    # New test that checks if the subgroup link works
    def test4_check_if_subgroup_link_works(self):
        create_evaluation = CreateEvaluation()
        current_url = create_evaluation.create_evaluation_click_project_subgroup(self.email, self.password, self.projectname, self.evaluationname, self.evaluationdescription)
        del create_evaluation
        self.assertTrue(current_url.find("jump_to_evaluation_page"))

if __name__ == "__main__":
    unittest.main()

# class TestEvaluation(unittest.TestCase):

#     def test_1_SignUp_Existed(self):
#         # sign up
#         test_sign_up = SignUp()
#         conf = Configure.configure_test_1_success_or_existed()
#         (username, password) = (conf.username, conf.password)
#         (url_current, alert_info) = test_sign_up.sign_up(username, password)

#     def test_3_CreateProject_Success(self):
#         # create project

#         (conf1, conf2) = \
#             Configure.configure_test_3_create_project_success()
#         (username, password) = (conf1.username, conf1.password)
#         (project_name, project_description, student_file, json_file) = \
#             (conf2.project_name, conf2.project_description,
#              conf2.student_file, conf2.json_file)
#         create_p = CreateProject()
#         (url_current, alert_info) = create_p.\
#             create_project_attempt(username, password,
#                                    project_name, project_description,
#                                    student_file, json_file)

#     def test_Evaluations(self):
#         # success or duplicate evaluation

#         (conf1, conf2) = \
#             Configure.configure_test_evaluations()
#         (username, password) = \
#             (conf1.username, conf1.password)
#         (project_name, evaluation_name) = \
#             (conf2.project_name, conf2.evaluation_name)

#         create_e = Evaluation()

#         (projectURL, alert_info) = create_e.\
#             create_evaluation_attempt(username, password,
#                                       project_name, evaluation_name)
#         std_url = "http://localhost:5000/load_project/" + \
#             username + username + project_name + "full/noAlert"
#         is_at_eval_create_page = \
#             projectURL == std_url

#         is_alert_info = \
#             alert_info == "The evaluation_name has been used before"
#         is_no_error = alert_info == "no error"

#         msg = alert_info

#         self.assertTrue((not is_at_eval_create_page and is_no_error)
#                         or (is_at_eval_create_page and is_alert_info, msg))

# if __name__ == "__main__":
#     unittest.main()

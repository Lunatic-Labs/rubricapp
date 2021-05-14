import unittest
import time
import os
from signUpDriver import SignUp
from createProjectDriver import CreateProject
from evaluationDriver import Evaluation
from configure import *


class Configure:
    def configure_test_1_success_or_existed():
        (username, password) = \
            ("sampleuser_CreateEvaluation@mail.com", "abcdefgh")
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return conf

    def configure_test_3_create_project_success():
        # both xlsx and json files are downloaded in the selenium/tests
        (username, password) = \
            ("sampleuser_CreateEvaluation@mail.com", "abcdefgh")
        (project_name, project_description) = \
            ("Informational Processing1",
             "A sample project using an ELPISSrubric "
             "for Informational Processing")
        (student_file, json_file) = \
            (os.getcwd() + "/sample_roster.xlsx",
             os.getcwd() + "/interpersonal_communication_scale3.json")

        conf1 = ConfigureUsernamePassword()
        conf1.username = username
        conf1.password = password

        conf2 = ConfigureProject
        conf2.project_name = project_name
        conf2.project_description = project_description
        conf2.student_file = student_file
        conf2.json_file = json_file

        return (conf1, conf2)

    def configure_test_evaluations():
        (username, password) = \
            ("sampleuser_CreateEvaluation@mail.com", "abcdefgh")
        (project_name, evaluation_name) = \
            ("Informational Processing", "Week 1")

        conf1 = ConfigureUsernamePassword()
        conf1.username = username
        conf1.password = password

        conf2 = ConfigureEvaluation
        conf2.project_name = project_name
        conf2.evaluation_name = evaluation_name

        return (conf1, conf2)


class TestEvaluation(unittest.TestCase):

    def test_1_SignUp_Existed(self):
        # sign up
        test_sign_up = SignUp()
        conf = Configure.configure_test_1_success_or_existed()
        (username, password) = (conf.username, conf.password)
        (url_current, alert_info) = test_sign_up.sign_up(username, password)

    def test_3_CreateProject_Success(self):
        # create project

        (conf1, conf2) = \
            Configure.configure_test_3_create_project_success()
        (username, password) = (conf1.username, conf1.password)
        (project_name, project_description, student_file, json_file) = \
            (conf2.project_name, conf2.project_description,
             conf2.student_file, conf2.json_file)
        create_p = CreateProject()
        (url_current, alert_info) = create_p.\
            create_project_attempt(username, password,
                                   project_name, project_description,
                                   student_file, json_file)

    def test_Evaluations(self):
        # success or duplicate evaluation

        (conf1, conf2) = \
            Configure.configure_test_evaluations()
        (username, password) = \
            (conf1.username, conf1.password)
        (project_name, evaluation_name) = \
            (conf2.project_name, conf2.evaluation_name)

        create_e = Evaluation()

        (projectURL, alert_info) = create_e.\
            create_evaluation_attempt(username, password,
                                      project_name, evaluation_name)
        std_url = "http://localhost:5000/load_project/" + \
            username + username + project_name + "full/noAlert"
        is_at_eval_create_page = \
            projectURL == std_url

        is_alert_info = \
            alert_info == "The evaluation_name has been used before"
        is_no_error = alert_info == "no error"

        msg = alert_info

        self.assertTrue((not is_at_eval_create_page and is_no_error)
                        or (is_at_eval_create_page and is_alert_info, msg))

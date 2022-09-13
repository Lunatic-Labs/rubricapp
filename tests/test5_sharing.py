import unittest
import time
import os
from signUpDriver import SignUp
from createProjectDriver import CreateProject
from evaluationDriver import Evaluation
from ratingDriver import Rating
from sharingDriver import Sharing
from configure import *


class Configure:

    def configure_test_1_success_or_existed():
        (username, password) = ("instructor1@example.com", "abcdefgh")
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return conf

    def configure_test_3_create_project_success():
        # both xlsx and json files are downloaded in the selenium/tests
        (username, password) = ("instructor1@example.com", "abcdefgh")
        (project_name, project_description) = \
            ("Teamwork2",
             "A sample project using an ELPISSrubric for Teamwork2")
        (student_file, json_file) = (
            os.getcwd() + "/sample_roster.xlsx",
            os.getcwd() + "/teamwork_scale3.json")

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
        (username, password) = ("instructor1@example.com", "abcdefgh")
        (project_name, evaluation_name) = ("Teamwork2", "Week 2")
        conf1 = ConfigureUsernamePassword()
        conf1.username = username
        conf1.password = password

        conf2 = ConfigureEvaluation
        conf2.project_name = project_name
        conf2.evaluation_name = evaluation_name

        return (conf1, conf2)

    def configure_test_rating():
        (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")
        (project_name, evaluation_name) = ("Teamwork2", "Week 1")
        (metagroup_name, group_name) = ("b", "O")
        (level, checkbox1, checkbox2, checkbox3) = \
            ("Sporadically", True, True, False)
        conf1 = ConfigureUsernamePassword()
        conf1.username = username
        conf1.password = password

        conf2 = ConfigureEvaluation
        conf2.project_name = project_name
        conf2.evaluation_name = evaluation_name

        conf3 = ConfigureRating
        conf3.metagroup_name = metagroup_name
        conf3.group_name = group_name
        conf3.level = level
        conf3.checkbox1 = checkbox1
        conf3.checkbox2 = checkbox2
        conf3.checkbox3 = checkbox3

        return (conf1, conf2, conf3)

    def configure_test_rating_another_group():
        (username, password) = \
            ("sampleuser13@mailinator.com", "abcdefgh")
        (project_name, evaluation_name) = ("Teamwork2", "Week 1")
        (metagroup_name, group_name) = ("b", "F")
        (level, checkbox1, checkbox2, checkbox3) =\
            ("Frequently", False, False, True)
        conf1 = ConfigureUsernamePassword()
        conf1.username = username
        conf1.password = password

        conf2 = ConfigureEvaluation
        conf2.project_name = project_name
        conf2.evaluation_name = evaluation_name

        conf3 = ConfigureRating
        conf3.metagroup_name = metagroup_name
        conf3.group_name = group_name
        conf3.level = level
        conf3.checkbox1 = checkbox1
        conf3.checkbox2 = checkbox2
        conf3.checkbox3 = checkbox3

        return (conf1, conf2, conf3)

    def configure_test_sharing_and_delete():
        (username, password, share_to_user) = (
            "instructor1@example.com",
            "abcdefgh", "ta@example.com")
        conf = ConfigureUsernamePassword()
        conf.username = username
        conf.password = password
        return (conf, share_to_user)

    def configure_test_sharing_and_modify_sharing():
        (username, password, share_to_user, shared_user_pw) =\
            ("instructor1@example.com", "abcdefgh",
             "ta@example.com", "abcdefgh")
        (project_name, evaluation_name) = ("Teamwork2", "Week 2")
        (metagroup_name, group_name) = ("b", "F")
        (level, checkbox1, checkbox2, checkbox3) = \
            ("Rarely", False, True, True)
        conf1 = ConfigureUsernamePassword()
        conf1.username = username
        conf1.password = password

        conf2 = ConfigureUsernamePassword()
        conf2.username = share_to_user
        conf2.password = shared_user_pw

        conf3 = ConfigureEvaluation
        conf3.project_name = project_name
        conf3.evaluation_name = evaluation_name

        conf4 = ConfigureRating
        conf4.metagroup_name = metagroup_name
        conf4.group_name = group_name
        conf4.level = level
        conf4.checkbox1 = checkbox1
        conf4.checkbox2 = checkbox2
        conf4.checkbox3 = checkbox3

        return (conf1, conf2, conf3, conf4)


class TestSharing(unittest.TestCase):

    def test_1_sign_up_existed(self):
        # sign up
        test_sign_up = SignUp()

        conf = Configure.configure_test_1_success_or_existed()
        (username, password) = (conf.username, conf.password)
        (url_current, alert_info) = test_sign_up.sign_up(username, password)

    def test_2_create_project_success(self):
        # create project

        (conf1, conf2) = \
            Configure.configure_test_3_create_project_success()
        (username, password) = (conf1.username, conf1.password)
        (project_name, project_description, student_file, json_file) = \
            (conf2.project_name, conf2.project_description,
             conf2.student_file, conf2.json_file)
        create_p = CreateProject()

        (url_current, alert_info) = \
            create_p.create_project_attempt(username, password,
                                            project_name, project_description,
                                            student_file, json_file)

    def test_3_evaluations(self):
        # create evaluation

        (conf1, conf2) = \
            Configure.configure_test_evaluations()
        (username, password) = \
            (conf1.username, conf1.password)
        (project_name, evaluation_name) = \
            (conf2.project_name, conf2.evaluation_name)
        create_e = Evaluation()
        (project_url, alert_info) =\
            create_e.create_evaluation_attempt(
                username, password, project_name, evaluation_name)

    def test_4_rating_two_groups(self):

        # Select one group to rate
        # then select the 2nd group to rate

        (conf1, conf2, conf3) = \
            Configure.configure_test_rating()
        (username, password) = \
            (conf1.username, conf1.password)
        (project_name, evaluation_name) = \
            (conf2.project_name, conf2.evaluation_name)
        (metagroup_name, group_name,
         level, checkbox1, checkbox2, checkbox3) = (
            conf3.metagroup_name,
            conf3.group_name,
            conf3.level,
            conf3.checkbox1,
            conf3.checkbox2,
            conf3.checkbox3
        )

        create_r = Rating()
        (statusA, statusB, statusC) =\
            create_r.rating_one_group(username, password,
                                      project_name, evaluation_name,
                                      metagroup_name, group_name,
                                      level, checkbox1, checkbox2, checkbox3)
        if checkbox1:
            self.assertTrue(statusA)
        if checkbox2:
            self.assertTrue(statusB)
        if checkbox3:
            self.assertTrue(statusC)

        # rate another group
        create_r = Rating()

        (conf1, conf2, conf3) = \
            Configure.configure_test_rating_another_group()
        (username, password) = \
            (conf1.username, conf1.password)
        (project_name, evaluation_name) = \
            (conf2.project_name, conf2.evaluation_name)
        (metagroup_name, group_name,
         level, checkbox1, checkbox2, checkbox3) = (
            conf3.metagroup_name,
            conf3.group_name,
            conf3.level,
            conf3.checkbox1,
            conf3.checkbox2,
            conf3.checkbox3
        )

        (statusA, statusB, statusC) = \
            create_r.rating_one_group(username, password, project_name,
                                      evaluation_name, metagroup_name,
                                      group_name, level,
                                      checkbox1, checkbox2, checkbox3)
        if checkbox1:
            self.assertTrue(statusA)
        if checkbox2:
            self.assertTrue(statusB)
        if checkbox3:
            self.assertTrue(statusC)

    def test_5_sharing_and_delete(self):
        # share the project and then delete the sharing

        (conf, share_to_user) =  \
            Configure.configure_test_sharing_and_delete()
        (username, password) = (
            conf.username,
            conf.password
        )

        create_s = Sharing()

        (success_text, delete_text) = create_s.\
            sharing_project_and_delete(username, password, share_to_user)
        is_success_text = success_text == "Permission successfully created"
        is_delete_text = delete_text == "successfully delete permission"

        self.assertTrue(is_success_text and is_delete_text, delete_text)

    def test_6_sharing_and_modify_sharing(self):
        # share the project and modify the rating from the sharedUser

        (conf1, conf2, conf3, conf4) = \
            Configure.configure_test_sharing_and_modify_sharing()
        (username, password) = (conf1.username, conf1.password)
        (share_to_user, shared_user_pw) = (
            conf2.username,
            conf2.password
        )
        (project_name, evaluation_name) = \
            (conf3.project_name, conf3.evaluation_name)
        (metagroup_name, group_name,
         level, checkbox1, checkbox2, checkbox3) = (
            conf4.metagroup_name,
            conf4.group_name,
            conf4.level,
            conf4.checkbox1,
            conf4.checkbox2,
            conf4.checkbox3
        )

        create_s = Sharing()

        (statusA, statusB, statusC) =\
            create_s.sharing_project_and_check(username, password,
                                               share_to_user, shared_user_pw,
                                               project_name,
                                               evaluation_name, metagroup_name,
                                               group_name, level,
                                               checkbox1, checkbox2, checkbox3)

        if checkbox1:
            self.assertTrue(statusA)
        if checkbox2:
            self.assertTrue(statusB)
        if checkbox3:
            self.assertTrue(statusC)

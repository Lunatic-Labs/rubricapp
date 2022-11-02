from signUpDriver import SignUp
from ratingDriver import Rating
import unittest
import random
import os

# class Configure:
#     def configure_test_1_success_or_existed():
#         (username, password) = \
#             ("sampleuser13@mailinator.com", "abcdefgh")
#         conf = ConfigureUsernamePassword()
#         conf.username = username
#         conf.password = password
#         return conf

#     def configure_test_3_create_project_success():
#         # both xlsx and json files have to be downloaded previously
#         (username, password) = \
#             ("sampleuser13@mailinator.com", "abcdefgh")
#         (project_name, project_description) =\
#             ("Teamwork2",
#              "A sample project using an "
#              "ELPISSrubric for Teamwork2")
#         (student_file, json_file) = (
#             os.getcwd() + "/sample_roster.xlsx",
#             os.getcwd() + "/teamwork_scale3.json")
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
#         (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")
#         (project_name, evaluation_name) = ("Teamwork2", "Week 1")
#         conf1 = ConfigureUsernamePassword()
#         conf1.username = username
#         conf1.password = password

#         conf2 = ConfigureEvaluation
#         conf2.project_name = project_name
#         conf2.evaluation_name = evaluation_name

#         return (conf1, conf2)

#     def configure_test_rating():
#         (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")
#         (project_name, evaluation_name) = ("Teamwork2", "Week 1")
#         (metagroup_name, group_name) = ("b", "O")
#         (level, checkbox1, checkbox2, checkbox3) = \
#             ("Sporadically", True, True, False)

#         conf1 = ConfigureUsernamePassword()
#         conf1.username = username
#         conf1.password = password

#         conf2 = ConfigureEvaluation
#         conf2.project_name = project_name
#         conf2.evaluation_name = evaluation_name

#         conf3 = ConfigureRating
#         conf3.metagroup_name = metagroup_name
#         conf3.group_name = group_name
#         conf3.level = level
#         conf3.checkbox1 = checkbox1
#         conf3.checkbox2 = checkbox2
#         conf3.checkbox3 = checkbox3

#         return (conf1, conf2, conf3)

#     def configure_test_rating_another_group():
#         (username, password) = \
#             ("sampleuser13@mailinator.com", "abcdefgh")
#         (project_name, evaluation_name) = ("Teamwork2", "Week 1")
#         (metagroup_name, group_name) = ("b", "F")
#         (level, checkbox1, checkbox2, checkbox3) = \
#             ("Frequently", False, False, True)

#         conf1 = ConfigureUsernamePassword()
#         conf1.username = username
#         conf1.password = password

#         conf2 = ConfigureEvaluation
#         conf2.project_name = project_name
#         conf2.evaluation_name = evaluation_name

#         conf3 = ConfigureRating
#         conf3.metagroup_name = metagroup_name
#         conf3.group_name = group_name
#         conf3.level = level
#         conf3.checkbox1 = checkbox1
#         conf3.checkbox2 = checkbox2
#         conf3.checkbox3 = checkbox3

#         return (conf1, conf2, conf3)

#     def configure_test_attendance():
#         (username, password) = ("sampleuser13@mailinator.com", "abcdefgh")
#         (project_name, evaluation_name) = ("Teamwork2", "Week 1")
#         (metagroup_name, group_name) = ("b", "O")
#         student_name_to_check = "Wickens, Hebe"

#         conf1 = ConfigureUsernamePassword()
#         conf1.username = username
#         conf1.password = password

#         conf2 = ConfigureEvaluation
#         conf2.project_name = project_name
#         conf2.evaluation_name = evaluation_name

#         conf3 = ConfigureRating
#         conf3.metagroup_name = metagroup_name
#         conf3.group_name = group_name
#         conf3.student_name_to_check = student_name_to_check

#         return (conf1, conf2, conf3)

class TestRating(unittest.TestCase):
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
    
    # New test that checks if the project name link works
    def test1_check_if_project_name_link_works(self):
        create_rating = Rating()
        current_url = create_rating.create_rating_get_current_url_after_clicking_project_name_link(self.email, self.password, self.projectname, self.projectdescription, self.rosterfile, self.rubricfile, self.evaluationname, self.evaluationdescription)
        del create_rating
        self.assertTrue(current_url.find("load/project"))
    
    # New test that checks if the projects link works
    def test2_check_if_projects_link_works(self):
        create_rating = Rating()
        current_url = create_rating.create_rating_get_current_url_after_clicking_projects_link(self.email, self.password, self.projectname)
        del create_rating
        self.assertTrue(current_url.find("instructor_project"))
    
    # New test that checks if the subgroup link when click triggers alert with corresponding text
    def test3_check_if_subgroup_works(self):
        create_rating = Rating()
        text = create_rating.create_rating_switch_to_different_subgroup(self.email, self.password, self.projectname)
        del create_rating
        self.assertTrue(text == "Do you want to switch group?")
    
    # New test that checks if the meta group link when click triggers alert with corresponding text
    def test4_check_if_metagroup_works(self):
        create_rating = Rating()
        text = create_rating.create_rating_switch_to_different_metagroup(self.email, self.password, self.projectname)
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
# class TestRating(unittest.TestCase):

#     def test_1_sign_up_existed(self):
#         # sign up
#         test_sign_up = SignUp()
#         conf = Configure.configure_test_1_success_or_existed()
#         (username, password) = (conf.username, conf.password)
#         (url_current, alert_info) = test_sign_up.sign_up(username, password)

#     def test_3_create_project_success(self):
#         # create project

#         (conf1, conf2) = \
#             Configure.configure_test_3_create_project_success()
#         (username, password) = (conf1.username, conf1.password)
#         (project_name, project_description, student_file, json_file) = \
#             (conf2.project_name, conf2.project_description,
#              conf2.student_file, conf2.json_file)
#         create_p = CreateProject()

#         (url_current, alert_info) = create_p.\
#             create_project_attempt(username, password, project_name,
#                                    project_description,
#                                    student_file, json_file)

#     def test_Evaluations(self):
#         # create evaluation

#         (conf1, conf2) = \
#             Configure.configure_test_evaluations()
#         (username, password) = \
#             (conf1.username, conf1.password)
#         (project_name, evaluation_name) = \
#             (conf2.project_name, conf2.evaluation_name)
#         create_e = Evaluation()

#         (project_url, alert_info) = create_e.\
#             create_evaluation_attempt(username, password,
#                                       project_name, evaluation_name)

#     def test_RatingTwoGroups(self):
#         # select one group to rate; then select the 2nd group to rate

#         (conf1, conf2, conf3) = \
#                     Configure.configure_test_rating()
#         (username, password) = \
#             (conf1.username, conf1.password)
#         (project_name, evaluation_name) = \
#             (conf2.project_name, conf2.evaluation_name)
#         (metagroup_name, group_name,
#          level, checkbox1, checkbox2, checkbox3) = (
#             conf3.metagroup_name,
#             conf3.group_name,
#             conf3.level,
#             conf3.checkbox1,
#             conf3.checkbox2,
#             conf3.checkbox3
#         )

#         create_r = Rating()

#         (statusA, statusB, statusC) = create_r.\
#             rating_one_group(username, password, project_name, evaluation_name,
#                              metagroup_name, group_name, level,
#                              checkbox1, checkbox2, checkbox3)
#         if checkbox1:
#             self.assertTrue(statusA)
#         if checkbox2:
#             self.assertTrue(statusB)
#         if checkbox3:
#             self.assertTrue(statusC)

#         # rate another group
#         create_r = Rating()

#         (conf1, conf2, conf3) = \
#             Configure.configure_test_rating_another_group()
#         (username, password) = \
#             (conf1.username, conf1.password)
#         (project_name, evaluation_name) = \
#             (conf2.project_name, conf2.evaluation_name)
#         (metagroup_name, group_name,
#          level, checkbox1, checkbox2, checkbox3) = (
#             conf3.metagroup_name,
#             conf3.group_name,
#             conf3.level,
#             conf3.checkbox1,
#             conf3.checkbox2,
#             conf3.checkbox3
#         )

#         (statusA, statusB, statusC) = create_r.\
#             rating_one_group(username, password, project_name, evaluation_name,
#                              metagroup_name, group_name, level,
#                              checkbox1, checkbox2, checkbox3)
#         if checkbox1:
#             self.assertTrue(statusA)
#         if checkbox2:
#             self.assertTrue(statusB)
#         if checkbox3:
#             self.assertTrue(statusC)

#     def test_Attendance(self):
#         # test checkbox of the attendance

#         (conf1, conf2, conf3) = \
#             Configure.configure_test_attendance()
#         (username, password) = \
#             (conf1.username, conf1.password)
#         (project_name, evaluation_name) = \
#             (conf2.project_name, conf2.evaluation_name)
#         (metagroup_name, group_name,
#          student_name_to_check) = (
#             conf3.metagroup_name,
#             conf3.group_name,
#             conf3.student_name_to_check
#         )

#         create_r = Rating()
#         response = create_r.\
#             rate_attendance(username, password, project_name,
#                             evaluation_name, metagroup_name, group_name,
#                             student_name_to_check)

#         self.assertTrue(response)


# if __name__ == '__main__':
#     unittest.main()

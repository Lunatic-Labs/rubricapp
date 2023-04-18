import sys
sys.path.append('..')
import unittest
from BackEndFlask.functions import new_map_generator
from core import app
from openpyxl import load_workbook
import random
from createTestProject import *

class new_row_generator_Test(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        
        basedirectoryAndmkuser()

        flask_app = app
        with flask_app.app_context():
            cls.projectName = "Test pName" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12))
            create_test_project("test@gmail.com", cls.projectName)

        path_to_current_user_project = "{}/{}/{}".format(base_directory, "test@gmail.com", cls.projectName)
        path_to_student_file_stored = "{}/evaluation.xlsx".format(path_to_current_user_project)
        cls.student_file_workbook = load_workbook(path_to_student_file_stored)

    @classmethod
    def tearDownClass(cls):    
        delete_project("test@gmail.com", cls.projectName)
        

    def test_Ne(self):
        new_map = new_map_generator("Ne", "evalname", self.student_file_workbook['eva'])
        self.assertEqual(new_map["group_id"], "Ne")

    def test_evalName(self):
        new_map = new_map_generator("Ne", "evalName", self.student_file_workbook['eva'])
        self.assertEqual(new_map["eva_name"], "evalName")

    def test_not_eva_name(self):
        new_map = new_map_generator("Ne", "evalName", self.student_file_workbook['eva'])
        self.assertNotEqual(new_map["eva_name"], "eva_name")

    def test_no_students(self):
        new_map = new_map_generator("Ne", "evalName", self.student_file_workbook['eva'])
        self.assertEqual(new_map["students"], '')




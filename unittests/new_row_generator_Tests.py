import sys
sys.path.append('..')
from functions import new_row_generator
from core import app
import os
import openpyxl
import shutil
from flask import Flask
import random
from createTestProject import *
import unittest
import collections

def makeEvalNames(evalnameList):
    for i in range(40):
        evalnameList.insert(i,"EvalName" + str(i+2))

evalnameList = []
makeEvalNames(evalnameList)

class new_row_generator_Test(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        
        base_directory = os.getcwd()+"/users"
        if not os.path.exists(base_directory+"/test@gmail.com"):
            os.mkdir(base_directory+"/test@gmail.com")

        flask_app = app
        with flask_app.app_context():
            cls.projectName = "Test pName" + str(random.getrandbits(12)) + str(random.getrandbits(12)) + str(random.getrandbits(12))
            create_test_project("test@gmail.com", cls.projectName)
            createEvaluation("test@gmail.com", cls.projectName,evalnameList)

    @classmethod
    def tearDownClass(cls):    
        delete_project("test@gmail.com", cls.projectName)

    @classmethod
    def setup(cls):
        path_to_current_user_project = "{}/{}/{}".format(base_directory, "test@gmail.com", cls.projectName)
        path_to_student_file_stored = "{}/evaluation.xlsx".format(path_to_current_user_project)
        student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
        return student_file_workbook['eva']

    def test_one(self):
        student_file_worksheet = new_row_generator_Test.setup()
        self.assertEqual(new_row_generator("Ne","Palomo, Jeremy","Test",student_file_worksheet),['Ne', 'Test', 'Guest', str(datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")), 'Palomo, Jeremy', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Guest'])
    
    def test_two(self):
        student_file_worksheet = new_row_generator_Test.setup()
        self.assertNotEqual(new_row_generator("Ne","Palomo,Jeremy","Test",student_file_worksheet),['Ne', 'Test', 'Guest', str(datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")), 'Palomo, Jeremy', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Guest'])



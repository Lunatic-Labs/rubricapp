import sys
sys.path.append('..')
from app import *
import os
import openpyxl
import shutil
from flask import Flask
import random
from createTestProject import *
import unittest
import collections

class new_row_generator_Test(unittest.TestCase):
    def test_one(self):
        path_to_current_user_project = "{}/{}/{}".format(base_directory, email, project_name)
        path_to_student_file_stored = "{}/evaluation.xlsx".format(path_to_current_user_project)
        student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
        student_file_worksheet = student_file_workbook['eva']

        self.assertEqual(new_row_generator("Ne","Palomo, Jeremy","Test",student_file_worksheet),['Ne', 'Test', ' ', str(datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")), 'Palomo, Jeremy', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])
    
    def test_two(self):
        path_to_current_user_project = "{}/{}/{}".format(base_directory, email, project_name)
        path_to_student_file_stored = "{}/evaluation.xlsx".format(path_to_current_user_project)
        student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)  
        student_file_worksheet = student_file_workbook['eva']

        self.assertNotEqual(new_row_generator("Ne","Palomo,Jeremy","Test",student_file_worksheet),['Ne', 'Test', ' ', str(datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")), 'Palomo, Jeremy', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '])



if __name__ == '__main__':
    
    flaskapp = create_app()
    email = "testing@gmail.com"
    project_name = "Project " + str(random.randint(0,1000))+ str(random.randint(0,1000))
    print(project_name)

    with flaskapp.app_context():
        create_test_project(email,project_name)
        unittest.main(argv=['first-arg-is-ignored'], exit=False)
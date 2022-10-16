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

email = "testing@gmail.com"
project_name.insert(1,"Project " + str(random.randint(0,1000))+ str(random.randint(0,1000)))

def setup():
    path_to_current_user_project = "{}/{}/{}".format(base_directory, email, project_name[1])
    path_to_student_file_stored = "{}/evaluation.xlsx".format(path_to_current_user_project)
    student_file_workbook = openpyxl.load_workbook(path_to_student_file_stored)
    return student_file_workbook['eva']

class new_row_generator_Test(unittest.TestCase):
    def test_one(self):
        student_file_worksheet = setup()
        self.assertEqual(new_row_generator("Ne","Palomo, Jeremy","Test",student_file_worksheet),['Ne', 'Test', 'Guest', str(datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")), 'Palomo, Jeremy', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Guest'])
    
    def test_two(self):
        student_file_worksheet = setup()
        self.assertNotEqual(new_row_generator("Ne","Palomo,Jeremy","Test",student_file_worksheet),['Ne', 'Test', 'Guest', str(datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")), 'Palomo, Jeremy', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Guest'])



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
from select_index_by_group_eva_Tests import *
from new_row_generator_Tests import *
from select_column_by_name_Tests import *

def makeEvalNames(evalnameList):
    for i in range(40):
        evalnameList.insert(i,"EvalName" + str(i+2))

if __name__ == '__main__':
    
    flaskapp = create_app()
    print(project_name)
    evalnameList = []
    makeEvalNames(evalnameList)

    with flaskapp.app_context():
        for i in range(0,3):
            create_test_project(email,project_name[i])
            createEvaluation(email,project_name[i],evalnameList)
        unittest.main(argv=['first-arg-is-ignored'], exit=False)
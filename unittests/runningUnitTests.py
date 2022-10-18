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
from new_row_generator_Tests import *
from select_index_by_group_eva_Tests import *
from select_column_by_name_Tests import *
from select_map_by_index_Tests import *
from select_index_by_group_eva_owner_date_Tests import *
from select_index_by_group_eva_owner_Tests import *
from test_select_students_by_group import *
from test_get_students_by_group import *
from test_select_row_by_index import *

if __name__ == '__main__':
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
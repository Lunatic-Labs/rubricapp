import sys
from os.path import dirname, abspath
d = dirname(dirname(dirname(abspath(__file__))))
sys.path.append(d)
from core import *
import os
import openpyxl
import shutil
from flask import Flask
import random
from createTestProject import *
import unittest
import collections
from test_select_by_col_name import *
from test_new_row_generator import *
from test_select_index_by_group_eva import *
from test_select_index_by_group_eva_owner_date import *
from test_select_index_by_group_eva_owner import *
from test_select_map_by_index import *
from test_get_students_by_group import *
from test_select_students_by_group import *
from test_select_row_by_index import *
from test_select_row_by_group_id import *
from test_new_map_generator import *
if __name__ == '__main__':
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
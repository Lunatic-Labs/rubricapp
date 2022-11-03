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
project_name.insert(0,"Project " + str(random.randint(0,1000))+ str(random.randint(0,1000)))
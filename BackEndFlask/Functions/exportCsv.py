#-----------------------------------------------------------------------
# Developer: Aldo Vera-Espinoza
# Date: 6 May, 2024
# File Purpose: 
#   This file contains functions that retrives data from the database
# and returns to a csv file to a customer.
#
# NOTE:
#   +
#-----------------------------------------------------------------------
import csv

from core import app, db
from models.completed_assessment import * 
from core import db
from models.schemas import ObservableCharacteristic

def createCsv():
    

"""def main():
    with open('pertinent.csv', 'w', newline='') as csvFile:
        writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)
        writer.writerow(["ThisisONe"]+["this is another item"])

main()"""



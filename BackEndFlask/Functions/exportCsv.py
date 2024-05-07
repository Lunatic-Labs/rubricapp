#----------------------------------------------------------------------------------------------------
# Developer: Aldo Vera-Espinoza
# Date: 6 May, 2024
# File Purpose: 
#   This file contains functions that retrives data from the database
# and returns to a csv file to a customer.
#
# NOTE:
#   the current way to write out things is as follows:
# AT_name, RN(AT_type, AT_completor), TeamName, IndividualName, CompDate, Category, datapoint
#            /             \                                                            |
#        unitofasess...     roleid                                                     rating,oc,sfi
#----------------------------------------------------------------------------------------------------
import csv
from core import app
from models.queries import *
from enum import Enum

class CSVloc(Enum):
    AT_NAME = 0
    AT_TYPE = 1
    AT_COMPLETER = 2
    TEAM_NAME = 3
    FIRST_NAME = 4
    LAST_NAME = 5
    COMP_DATE = 6


#testing needs to be intergrated
#init for security has preverse structure
def create_csv():
    """
    Description:
        Creates the csv file pertinent.csv and dumps info to it.
    Return: None
    """
    with app.app_context():
        with open('pertinent.csv', 'w', newline='') as csvFile:
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)
            allAssessmentData = get_csv_data_by_at_name("Critical Thinking Assessment")
            for entry in allAssessmentData:
                at_type = ["Team"] if entry[CSVloc.AT_TYPE.value] else ["Individual"]
                print(type(entry[CSVloc.COMP_DATE.value]))
                writer.writerow([entry[CSVloc.AT_NAME.value]] + at_type
                                + [entry[CSVloc.AT_COMPLETER.value]]
                                + [entry[CSVloc.TEAM_NAME.value]]
                                + [entry[CSVloc.FIRST_NAME.value]]
                                + [entry[CSVloc.LAST_NAME.value]]
                                + [entry[CSVloc.COMP_DATE.value].strftime("%m/%d/%Y,%H:%M:%S")]
                                )


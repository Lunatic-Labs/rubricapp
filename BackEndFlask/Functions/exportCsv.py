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
from core import app, db
from models.queries import *

#testing needs to be intergrated
#init for security has preverse structure
def createCsv():
    OBSERVABLE_LOCATION = 6
    with app.app_context():
        with open('pertinent.csv', 'w', newline='') as csvFile:
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)
            allAssessmentData = get_completed_assessment_with_team_name(1)
            for entry in allAssessmentData:
                writer.writerow(entry[OBSERVABLE_LOCATION]["Analyzing"])
                print(type(entry[OBSERVABLE_LOCATION]["Analyzing"]))
                get_Csv_Data_by_AT_Name("Critical Thinking Assessment")


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
from models.queries import *

#testing needsd to be intergrated
#init for security has preverse structure
#intrestingly enought this is now functioning as a list of lists where
#   the first list a singular query and the second is the data from one
#interval? seems like its just plain date that is stored
def createCsv():
    OBSERVABLE_LOCATION = 6
    with app.app_context():
        with open('pertinent.csv', 'w', newline='') as csvFile:
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)
            allAssessmentData = get_completed_assessment_with_team_name(1)
            for entry in allAssessmentData:
                writer.writerow(entry[OBSERVABLE_LOCATION]["Analyzing"])
                print(type(entry[OBSERVABLE_LOCATION]["Analyzing"]))


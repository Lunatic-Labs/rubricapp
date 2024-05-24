#----------------------------------------------------------------------------------------------------
# File Purpose: 
#   This file contains functions that retrieves data from the database
# and returns to a csv file to a customer.
#
# NOTE:
#   the current way to write out things is as follows:
# AT_name, RN(AT_type, AT_completer), TeamName, IndividualName, CompDate, Category, datapoint
#            /             \                                                            |
#        unitofasess...     roleid                                                     rating,oc,sfi
#----------------------------------------------------------------------------------------------------
import csv
from core import app
from models.queries import *
from enum import Enum
from datetime import datetime



def rounded_hours_difference(completed: datetime, seen: datetime) -> int:
    """
    Description:
    Returns the hour difference between seen
    and completed rounded to the nearest
    full hour.

    Parameters:
    Completed: datetime (The day the completed assessment was saved)
    seen: datetime (The day the student saw the completed assessment)

    Return:
    Result: int (The lag_time between completed and seen)
    """
    time_delta = seen - completed

    hours_remainder = divmod( divmod( time_delta.total_seconds(), 60 )[0], 60)

    return int(hours_remainder[0]) if hours_remainder[1] < 30.0 else int(hours_remainder[0]) + 1


class Csv_data(Enum):
    """
    Description:
    Locations associated to where they are in the json file.
    This enum should be modified if the json names change in the future.

    Parameters:
    NONE (THIS IS AN ENUM!)
    """
    AT_NAME = 0

    AT_TYPE = 1

    RUBRIC_ID = 2

    RUBRIC_NAME = 3

    AT_COMPLETER = 4

    TEAM_NAME = 5

    FIRST_NAME = 6

    LAST_NAME = 7

    COMP_DATE = 8

    LAG_TIME = 9

    NOTIFICATION = 10

    JSON = 11


def create_csv(at_id: int, file_name: str) -> None:
    """
    Description:
    Creates the csv file and dumps info in to it.
    File name follows the convention: [0-9]*.csv

    Parameters:
    at_id: int (The id of an assessment task)
    file_name: str (csv file to write to)

    Return:
    None
    """
    # Assessment_task_name, Completion_date, Rubric_name, AT_type (Team/individual), AT_completer_role (Admin, TA/Instructor, Student), Notification_date
    with app.app_context():
        with open("./tempCsv/" + file_name, 'w', newline='') as csvFile:
            writer = csv.writer(csvFile, quoting=csv.QUOTE_MINIMAL)

            # Next line is the header line and its values.
            writer.writerow(
                ["Assessment_task_name"] +
                ["Completion_date"]+
                ["Rubric_name"]+
                ["AT_type (Team/individual)"] +
                ["AT_completer_role (Admin[TA/Instructor] / Student)"] +
                ["Notification_data"]
            )

            completed_assessment_data = get_csv_data_by_at_id(at_id)

            if len(completed_assessment_data) == 0:
                return

            writer.writerow(
                [completed_assessment_data[0][Csv_data.AT_NAME.value]]      +
                [completed_assessment_data[0][Csv_data.COMP_DATE.value]]    +
                [completed_assessment_data[0][Csv_data.RUBRIC_NAME.value]]  +
                ["Team" if completed_assessment_data[0][Csv_data.AT_TYPE.value] else "Individual"] +
                [completed_assessment_data[0][Csv_data.AT_COMPLETER.value]] +
                [completed_assessment_data[0][Csv_data.NOTIFICATION.value]]
            )

            # The block generates data lines.
            writer.writerow(
                ["Team_name"]  +
                ["First name"] +
                ["last name"]  +
                ["Category"]   +
                ["Rating"]     +
                ["Observable Characteristics"]  +
                ["Suggestions for Improvement"] +
                ["feedback time lag"]
            )

            for entry in completed_assessment_data:
                sfi_oc_data = get_csv_categories(entry[Csv_data.RUBRIC_ID.value])

                lag = ""

                try:
                    lag = rounded_hours_difference(entry[Csv_data.COMP_DATE.value], entry[Csv_data.LAG_TIME.value])

                except:
                    pass

                for i in entry[Csv_data.JSON.value]:
                    if i == "comments" or i == "done":
                        continue

                    oc = entry[Csv_data.JSON.value][i]["observable_characteristics"]

                    for j in range (0, len(oc)):
                        if(oc[j] == '0'):
                            continue

                        writer.writerow(
                            [entry[Csv_data.TEAM_NAME.value]]  +
                            [entry[Csv_data.FIRST_NAME.value]] +
                            [entry[Csv_data.LAST_NAME.value]]  +
                            [i] +
                            [entry[Csv_data.JSON.value][i]["rating"]] +
                            [sfi_oc_data[1][j][1]] +
                            [lag] +
                            ["OC"]
                        )

                for i in entry[Csv_data.JSON.value]:
                    if i == "comments" or i == "done":
                        continue

                    sfi = entry[Csv_data.JSON.value][i]["suggestions"]

                    for j in range (0, len(sfi)):
                        if(sfi[j] == '0'):
                            continue

                        writer.writerow(
                            [entry[Csv_data.TEAM_NAME.value]]  +
                            [entry[Csv_data.FIRST_NAME.value]] +
                            [entry[Csv_data.LAST_NAME.value]]  +
                            [i] +
                            [entry[Csv_data.JSON.value][i]["rating"]] +
                            [sfi_oc_data[0][j][1]] +
                            [lag] +
                            ["SFI"]
                        )

    return

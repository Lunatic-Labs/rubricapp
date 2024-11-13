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
import io
import contextlib
from core import app
from models.queries import *
from enum import Enum
from datetime import datetime
from collections import deque

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

    Exception:
    TypeError: Both arguements must be datetimes.
    """

    if not isinstance(seen, datetime): raise TypeError(f"Expected: {datetime}, got {type(seen)} for seen.")
    if not isinstance (completed, datetime): raise TypeError(f"Expected: {datetime}, got {type(completed)} for completed.")

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

    TEAM_ID = 5

    TEAM_NAME = 6

    USER_ID = 7

    FIRST_NAME = 8

    LAST_NAME = 9

    COMP_DATE = 10

    LAG_TIME = 11
    
    NOTIFICATION = 12

    JSON = 13

def create_ocs_sfis_csv(at_id: int) -> str:
    """
    Description:
    Creates a string that has properly formated csv data for
    Ocs and sfis according to client specifiications.

    Parameters:
    at_id: <class 'int'> (assessment_task_id)

    Returns:
    <class 'str'>

    Exceptions:
    None
    """

    with app.app_context():
        with io.StringIO() as csvFile:
            writer = csv.writer(csvFile, delimiter='\t')

            writer.writerow(["Course Name"])
            writer.writerow([get_course_name_by_at_id(at_id)])
            writer.writerow([''])

            checkmark = "✔"
            crossmark = "✗"

           # List of dicts: Each list is another individual in the AT and the dict is there related data. 
            completed_assessment_data = get_csv_data_by_at_id(at_id)

            if len(completed_assessment_data) == 0:
                return csvFile.getvalue()

            singular = completed_assessment_data[0]

            is_teams = False if singular[Csv_data.TEAM_NAME.value] == None else True

            # Writing out in category chuncks. 
            for category in singular[Csv_data.JSON.value]:
                if category == "done" or category == "comments": # Yes those two are "categories" at least from how the data is pulled.
                        continue

                headers = ["First Name"] + ["Last Name"] if not is_teams else ["Team Name"]

                oc_sfi_per_category = get_csv_categories(singular[Csv_data.RUBRIC_ID.value],
                                        singular[Csv_data.USER_ID.value],
                                        singular[Csv_data.TEAM_ID.value],
                                        at_id, category)

                headers += [i[0] for i in oc_sfi_per_category[0]] + [i[0] for i in oc_sfi_per_category[1]]                

                writer.writerow([category])
                writer.writerow(headers)

                # Writing the checkmarks or crossmarks of them out.
                for individual in completed_assessment_data:
                    respective_ocs_sfis = [individual[Csv_data.JSON.value][category]["observable_characteristics"], 
                                           individual[Csv_data.JSON.value][category]["suggestions"]]
                    
                    row = None
                    if not is_teams: row = [individual[Csv_data.FIRST_NAME.value]] + [individual[Csv_data.LAST_NAME.value]]
                    else: row = [individual[Csv_data.TEAM_NAME.value]]

                    for bits in respective_ocs_sfis:
                        row += [checkmark if i == "1" else crossmark for i in bits]
                    
                    writer.writerow(row)
                writer.writerow([''])

            return csvFile.getvalue()

def create_ratings_csv(at_id: int) -> str:
    """
    Description:
    Creates a string that has properly formated csv data for
    assessment task ratings according to client specifiications. 
    
    Parameters:
    at_id: <class 'int'> (assessment_task_id)

    Returns:
    <class 'str'>
    
    Excepitions:
    None
    """
    with app.app_context():
        with io.StringIO() as csvFile:
            writer = csv.writer(csvFile, delimiter='\t')
            return csvFile.getvalue()
#----------------------------------------------------------------------------------------------------
# File Purpose: 
#   This file contains functions that retrieves data from the database
# and returns to a csv file to a customer.
#
# NOTE:
#   The Template method pattern was used since both exports deal with similar related data fetches
#   from the data base but just handle formating differently. This is hopefully expandable.
#----------------------------------------------------------------------------------------------------
import csv
import io
from core import app
from models.queries import *
from enum import Enum
from datetime import datetime
from abc import ABC, abstractmethod


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

class Csv_Data(Enum):
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

class Csv_Creation(ABC):
    """
    Description: Abstract class that leads to the creation of a csv formated string.
    Decided to do this pattern becasue the clients seem to want this same data in many
    differing formated outputs. This way all that needs to get created with the same data is
    the format rather than working on the query and repeating the same starter code.
    """

    def __init__(self, at_id) -> None:
        """
        Parameters:
        at_id: <class 'int'> 
        """
        self._at_id = at_id
        self._csv_file = io.StringIO()
        self._writer = csv.writer(self._csv_file, delimiter='\t')
        self._completed_assessment_data = None
        self._oc_sfi_data = None
        self._is_teams = False
        self._singular_data = None

    def return_csv_str(self) -> str:
        """
        Description: Returns a csv formated string.

        Return:
        <class 'str'>
        """

        # Writting a common identifying data.
        self._writer.writerow(['\ufeff']) # A dom that helps excel auto use utf-8. Downside is that it uses up a line.
        self._writer.writerow(["Course Name"])
        self._writer.writerow([get_course_name_by_at_id(self._at_id)])
        self._writer.writerow(["Task Name"])  # Add this line
        self._writer.writerow([get_assessment_task_name_by_at_id(self._at_id)])  # Add this line
        self._writer.writerow([' '])

        
        # List of dicts: Each list is another individual in the AT and the dict is there related data. 
        self._completed_assessment_data = get_csv_data_by_at_id(self._at_id)

        if len(self._completed_assessment_data) == 0:
            return self._csv_file.getvalue()
        
        self._singular = self._completed_assessment_data[0]
        self._is_teams = False if self._singular[Csv_Data.TEAM_NAME.value] == None else True

        self._format()

        return self._csv_file.getvalue()
    
    def __del__(self) -> None:
        """
        Description: Freeing resources.
        """
        self._csv_file.close()

    @abstractmethod
    def _format(self) -> None:
        pass

class Ratings_Csv(Csv_Creation):
    """
    Description: Singleton that creates a csv string of ratings.
    """
    def __init__(self, at_id:int) -> None:
        """
        Parameters:
        at_id: <class 'int'> 
        """
        super().__init__(at_id)
    
    def _format(self) -> None:
        """
        Description: Formats the data in the csv string.
        Exceptions: None except what IO can rise.
        """
        column_name = ["First Name"] + ["Last Name"] if not self._is_teams else ["Team Name"]

        # Adding the column name. Noitice that done and comments is skipped since they are categories but are not important.
        column_name += [i for i in self._singular[Csv_Data.JSON.value] if (i != "done" and i !="comments")]

        column_name += ["Lag Time (Hours)"]

        self._writer.writerow(column_name)

        row_info = None

        # Notice that in the list comphrehensions done and comments are skiped since they are categories but dont hold relavent data.
        for individual in self._completed_assessment_data:

            row_info = [individual[Csv_Data.FIRST_NAME.value]] + [individual[Csv_Data.LAST_NAME.value]] if not self._is_teams else [individual[Csv_Data.TEAM_NAME.value]]

            row_info += [individual[Csv_Data.JSON.value][category]["rating"] for category in individual[Csv_Data.JSON.value] if (category != "done" and category !="comments")]
                
            lag = [" "]
            try:
                # Possible that a particular individual has not yet seen so its a Nonetype in the backend.
                lag = [rounded_hours_difference(individual[Csv_Data.COMP_DATE.value], individual[Csv_Data.LAG_TIME.value])]
            except TypeError:
                pass

            row_info += lag
            self._writer.writerow(row_info)

class Ocs_Sfis_Csv(Csv_Creation):
    """
    Description: Singleton that creates a csv string of ratings.
    """
    def __init__(self, at_id: int) -> None:
        """
        Parameters:
        at_id: <class 'int'> 
        """
        super().__init__(at_id)
        self.__checkmark = '\u2713'
        self.__crossmark = " "

    def _format(self) -> None:
        """
        Description: Formats the data in the csv string.
        Exceptions: None except what IO can rise.
        """
        # Writing out in category chuncks. 
        for category in self._singular[Csv_Data.JSON.value]:
            if category == "done" or category == "comments": # Yes those two are "categories" at least from how the data is pulled.
                continue

            headers = ["First Name"] + ["Last Name"] if not self._is_teams else ["Team Name"]

            oc_sfi_per_category = get_csv_categories(self._singular[Csv_Data.RUBRIC_ID.value],
                                                    self._singular[Csv_Data.USER_ID.value],
                                                    self._singular[Csv_Data.TEAM_ID.value],
                                                    self._at_id, category)

            # Adding the other column names which are the ocs and sfi text.
            headers += ["OC:" + i[0] for i in oc_sfi_per_category[0]] + ["SFI:" + i[0] for i in oc_sfi_per_category[1]]                

            self._writer.writerow([category])
            self._writer.writerow(headers)

            # Writing the checkmarks.
            for individual in self._completed_assessment_data:
                respective_ocs_sfis = [individual[Csv_Data.JSON.value][category]["observable_characteristics"], 
                                       individual[Csv_Data.JSON.value][category]["suggestions"]]
                    
                row = None
                if not self._is_teams: row = [individual[Csv_Data.FIRST_NAME.value]] + [individual[Csv_Data.LAST_NAME.value]]
                else: row = [individual[Csv_Data.TEAM_NAME.value]]

                for bits in respective_ocs_sfis:
                    row += [self.__checkmark if i == "1" else self.__crossmark for i in bits]
                    
                self._writer.writerow(row)
            self._writer.writerow([''])
        
class Comments_Csv(Csv_Creation):
    """
    Description: Singleton that creates a csv string of comments per category per student.
    """
    def __init__(self, at_id: int) -> None:
        """
        Parameters:
        at_id: <class 'int'> 
        """
        super().__init__(at_id)

    def _format(self) -> None:
        """
        Description: Formats the data in the csv string.
        Exceptions: None except what IO can rise.
        """
        column_name = ["First Name"] + ["Last Name"] if not self._is_teams else ["Team Name"]

        # Adding the column name. Noitice that done and comments is skipped since they are categories but are not important.
        column_name += [i for i in self._singular[Csv_Data.JSON.value] if (i != "done" and i !="comments")]

        self._writer.writerow(column_name)

        row_info = None

        # Notice that in the list comphrehensions done and comments are skiped since they are categories but dont hold relavent data.
        for individual in self._completed_assessment_data:

            row_info = [individual[Csv_Data.FIRST_NAME.value]] + [individual[Csv_Data.LAST_NAME.value]] if not self._is_teams else [individual[Csv_Data.TEAM_NAME.value]]

            row_info += [individual[Csv_Data.JSON.value][category]["comments"] for category in individual[Csv_Data.JSON.value] if (category != "done" and category !="comments")]
            
            self._writer.writerow(row_info) 

class Aggregates_Csv(Csv_Creation):
    """
    Description: Creates a csv string of aggregate percentages for characteristics and improvements.
    This exports the same data shown in the reporting graphs.
    """
    def __init__(self, at_id: int) -> None:
        """
        Parameters:
        at_id: <class 'int'>
        """
        super().__init__(at_id)
        self._category_name = None

    def set_category(self, category_name: str) -> None:
        """
        Description: Sets the category to export aggregates for.
        If None, exports all categories.

        Parameters:
        category_name: str (The category name to filter by, or None for all)
        """
        self._category_name = category_name

    def _format(self) -> None:
        """
        Description: Formats the aggregate data in the csv string.
        Exports percentages for observable characteristics and suggestions for improvement.
        """
        from models.category import get_categories_per_rubric
        from models.observable_characteristics import get_observable_characteristic_per_category
        from models.suggestions import get_suggestions_per_category
        from models.completed_assessment import get_completed_assessments_by_assessment_task_id

        # Get rubric_id from the first completed assessment
        rubric_id = self._singular[Csv_Data.RUBRIC_ID.value]

        # Get total students/teams for percentage calculation
        course_id = get_course_from_at(self._at_id)
        course_id = course_id[0] if course_id else 0
        total = get_course_total_students(course_id, self._at_id)

        if total == 0:
            self._writer.writerow(["No students/teams found for percentage calculation"])
            return

        # Get completed assessments with the 'done' field directly from the model
        # This matches how the frontend fetches data via /completed_assessment endpoint
        completed_assessments = get_completed_assessments_by_assessment_task_id(self._at_id)

        # Get categories for this rubric (same way the rubric route does it)
        all_categories = get_categories_per_rubric(rubric_id)

        # Build category_json structure the same way the rubric route does
        category_json = {}
        for index, category in enumerate(all_categories):
            category_json[category.category_name] = {
                "observable_characteristics": [],
                "suggestions": [],
                "index": index
            }

            # Get observable characteristics for this category
            observable_characteristics = get_observable_characteristic_per_category(category.category_id)
            for oc in observable_characteristics:
                category_json[category.category_name]["observable_characteristics"].append(oc.observable_characteristic_text)

            # Get suggestions for this category
            suggestions = get_suggestions_per_category(category.category_id)
            for sfi in suggestions:
                category_json[category.category_name]["suggestions"].append(sfi.suggestion_text)

        # Sort categories by index
        categories = sorted(category_json.keys(), key=lambda x: category_json[x].get('index', 0))

        # Filter to specific category if set
        if self._category_name and self._category_name in categories:
            categories = [self._category_name]

        for category in categories:
            category_data = category_json.get(category, {})
            observable_characteristics = category_data.get('observable_characteristics', [])
            suggestions = category_data.get('suggestions', [])

            # Initialize counters
            oc_counts = [0] * len(observable_characteristics)
            sfi_counts = [0] * len(suggestions)
            completed_count = 0

            # Count occurrences from completed assessments
            # Use the completed_assessments query which has the 'done' field directly
            for ca in completed_assessments:
                # Check if assessment is done (using the model's done field, not JSON)
                if not ca.done:
                    continue

                json_data = ca.rating_observable_characteristics_suggestions_data
                if not json_data or category not in json_data:
                    continue

                completed_count += 1
                cat_data = json_data[category]

                # Count observable characteristics
                oc_bits = cat_data.get('observable_characteristics', '')
                for i, bit in enumerate(oc_bits):
                    if i < len(oc_counts) and bit == '1':
                        oc_counts[i] += 1

                # Count suggestions for improvement
                sfi_bits = cat_data.get('suggestions', '')
                for i, bit in enumerate(sfi_bits):
                    if i < len(sfi_counts) and bit == '1':
                        sfi_counts[i] += 1

            # Write category header
            self._writer.writerow([f"Category: {category}"])
            self._writer.writerow([f"Completed Assessments: {completed_count} / {total}"])
            self._writer.writerow([''])

            # Write Observable Characteristics section
            self._writer.writerow(["Observable Characteristics"])
            self._writer.writerow(["Characteristic", "Count", "Percentage"])

            for i, oc in enumerate(observable_characteristics):
                count = oc_counts[i] if i < len(oc_counts) else 0
                percentage = round((count / total) * 100, 2) if total > 0 else 0
                self._writer.writerow([oc, count, f"{percentage}%"])

            self._writer.writerow([''])

            # Write Suggestions for Improvement section
            self._writer.writerow(["Suggestions for Improvement"])
            self._writer.writerow(["Suggestion", "Count", "Percentage"])

            for i, sfi in enumerate(suggestions):
                count = sfi_counts[i] if i < len(sfi_counts) else 0
                percentage = round((count / total) * 100, 2) if total > 0 else 0
                self._writer.writerow([sfi, count, f"{percentage}%"])

            self._writer.writerow([''])
            self._writer.writerow([''])


class CSV_Type(Enum):
    """
    Description: This is the enum for the different types of csv file formats the clients have requested.
    """
    OCS_SFI_CSV = 0
    RATING_CSV = 1
    COMMENTS_CSV = 2
    AGGREGATES_CSV = 3

def create_csv_strings(at_id:int, type_csv:int=0, category_name:str=None) -> str:
    """
    Description: Creates a csv file with the data in the format specified by type_csv.

    Parameters:
    at_id: <class 'int'> (Desired assessment task)
    type_csv: <class 'int'> (Desired format)
    category_name: <class 'str'> (Optional category name for filtering aggregates export)

    Returns:
    <class 'str'>

    Exceptions: None except the chance the database or IO calls raise one.
    """
    try:
        type_csv = CSV_Type(type_csv)
    except:
        raise ValueError("No type of csv is associated for the value passed.")
    match type_csv:
        case CSV_Type.RATING_CSV:
            return Ratings_Csv(at_id).return_csv_str()
        case CSV_Type.OCS_SFI_CSV:
            return Ocs_Sfis_Csv(at_id).return_csv_str()
        case CSV_Type.COMMENTS_CSV:
            return Comments_Csv(at_id).return_csv_str()
        case CSV_Type.AGGREGATES_CSV:
            aggregates_csv = Aggregates_Csv(at_id)
            if category_name:
                aggregates_csv.set_category(category_name)
            return aggregates_csv.return_csv_str()
        case _:
            return "Error in create_csv_strings()."
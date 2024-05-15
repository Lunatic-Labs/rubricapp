from core import db
from sqlalchemy import and_
from sqlalchemy.exc import SQLAlchemyError
from models.schemas import CompletedAssessment, AssessmentTask, User, Feedback
from datetime import datetime
from models.utility import error_log

class InvalidCRID(Exception):
    def __init__(self, id):
        self.message = f"Invalid completed_assessment_id: {id}."

    def __str__(self):
        return self.message


@error_log
def get_completed_assessments():
    return CompletedAssessment.query.all()


@error_log
def get_completed_assessments_by_assessment_task_id(assessment_task_id):
    return CompletedAssessment.query.filter_by(assessment_task_id=assessment_task_id).all()


@error_log
def get_completed_assessment(completed_assessment_id):
    one_completed_assessment = CompletedAssessment.query.filter_by(completed_assessment_id=completed_assessment_id).first()

    if one_completed_assessment is None:
        raise InvalidCRID(completed_assessment_id)

    return one_completed_assessment


@error_log
def get_completed_assessment_by_course_id(course_id):
    return db.session.query(CompletedAssessment).join(AssessmentTask, CompletedAssessment.assessment_task_id == AssessmentTask.assessment_task_id).filter(
            AssessmentTask.course_id == course_id
        ).all()


@error_log
def completed_assessment_exists(team_id, assessment_task_id, user_id):
    return CompletedAssessment.query.filter_by(team_id=team_id, assessment_task_id=assessment_task_id, user_id=user_id).first()


@error_log
def create_completed_assessment(completed_assessment_data):
    if "." not in completed_assessment_data["initial_time"]:
        completed_assessment_data["initial_time"] = completed_assessment_data["initial_time"] + ".000"

    if "Z" not in completed_assessment_data["initial_time"]:
        completed_assessment_data["initial_time"] = completed_assessment_data["initial_time"] + "Z"

    if "." not in completed_assessment_data["last_update"]:
        completed_assessment_data["last_update"] = completed_assessment_data["last_update"] + ".000"

    if "Z" not in completed_assessment_data["last_update"]:
        completed_assessment_data["last_update"] = completed_assessment_data["last_update"] + "Z"

    completed_assessment_data = CompletedAssessment(
        assessment_task_id=completed_assessment_data["assessment_task_id"],
        team_id=completed_assessment_data["team_id"],
        user_id=completed_assessment_data["user_id"],
        initial_time=datetime.strptime(completed_assessment_data["initial_time"], '%Y-%m-%dT%H:%M:%S.%fZ'),
        last_update=None if completed_assessment_data["last_update"] is None else datetime.strptime(completed_assessment_data["last_update"], '%Y-%m-%dT%H:%M:%S.%fZ'),
        rating_observable_characteristics_suggestions_data=completed_assessment_data["rating_observable_characteristics_suggestions_data"],
        done=completed_assessment_data["done"]
    )

    db.session.add(completed_assessment_data)
    db.session.commit()

    return completed_assessment_data

def load_demo_completed_assessment():
    list_of_completed_assessments = [
        {
            "assessment_task_id": 1,
            "done": True,
            "initial_time": "2024-01-28T21:08:36.376000",
            "last_update": "2024-02-01T21:01:33.458000",
            "rating_observable_characteristics_suggestions_data": {
                "Analyzing": {
                    "comments": "ASDFASDFASDFASDFASDF",
                    "description": "Interpreted information to determine meaning and to extract relevant evidence",
                    "observable_characteristics": "101",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Inaccurately",
                        "2": "",
                        "3": "With some errors",
                        "4": "",
                        "5": "Accurately"
                    },
                    "suggestions": "00100"
                },
                "Evaluating": {
                    "comments": "ASDFJKL;",
                    "description": "Determined the relevance and reliability of information that might be used to support the conclusion or argument",
                    "observable_characteristics": "111",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Extensively"
                    },
                    "suggestions": "00000"
                },
                "Forming Arguments (Structure)": {
                    "comments": "",
                    "description": "Made an argument that includes a claim (a position), supporting information, and reasoning.",
                    "observable_characteristics": "0100",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "1111111"
                },
                "Forming Arguments (Validity)": {
                    "comments": "",
                    "description": "The claim, evidence, and reasoning were logical and consistent with broadly accepted principles.",
                    "observable_characteristics": "10110",
                    "rating": 4,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Fully"
                    },
                    "suggestions": "11111"
                },
                "Identifying the Goal": {
                    "comments": "",
                    "description": "Determined the purpose/context of the argument or conclusion that needed to be made",
                    "observable_characteristics": "110",
                    "rating": 2,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "1010"
                },
                "Synthesizing": {
                    "comments": "",
                    "description": "Connected or integrated information to support an argument or reach a conclusion",
                    "observable_characteristics": "101",
                    "rating": 2,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Inaccurately",
                        "2": "",
                        "3": "With some errors",
                        "4": "",
                        "5": "Accurately"
                    },
                    "suggestions": "10001"
                },
                "comments": "",
                "done": True
            },
            "team_id": 1,
            "user_id": 3
        },
        {
            "assessment_task_id": 2,
            "done": True,
            "initial_time": "2024-01-28T21:08:55.755000",
            "last_update": "2024-02-01T21:02:45.652000",
            "rating_observable_characteristics_suggestions_data": {
                "Audience": {
                    "comments": "hasdfasdf",
                    "description": "Uses language and delivery style that is consistent with the norms of the subject area and suitable for the audience",
                    "observable_characteristics": "010",
                    "rating": 4,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "000000"
                },
                "Delivery (oral)": {
                    "comments": "",
                    "description": "Uses voice and body language to convey the intended message in a clear and engaging manner",
                    "observable_characteristics": "0110",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "00000"
                },
                "Format and Style": {
                    "comments": "3408rewlj;k5u0dsfjopkrew",
                    "description": "Selects a format and style that enhances the effectiveness of the communication",
                    "observable_characteristics": "101",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "000000"
                },
                "Intent": {
                    "comments": "",
                    "description": "Clearly conveys the purpose, and the content is well-aligned towards this intent",
                    "observable_characteristics": "111",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "00000"
                },
                "Mechanics (written words)": {
                    "comments": "",
                    "description": "Uses expected writing conventions for the form of communication",
                    "observable_characteristics": "1111",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "0000000"
                },
                "Organization": {
                    "comments": "",
                    "description": "Presents ideas in a logical and cohesive manner",
                    "observable_characteristics": "100",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "000000"
                },
                "Visual Representations": {
                    "comments": "Chester",
                    "description": "Constructs and uses visual representations effectively and appropriately",
                    "observable_characteristics": "101",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "000000"
                },
                "comments": "",
                "done": True
            },
            "team_id": 1,
            "user_id": 3
        },
        {
            "assessment_task_id": 5,
            "done": True,
            "initial_time": "2024-01-28T21:09:24.685000",
            "last_update": "2024-02-01T21:03:25.208000",
            "rating_observable_characteristics_suggestions_data": {
                "Coordinating": {
                    "comments": "",
                    "description": "Optimized and communicated the distribution of tasks among team members",
                    "observable_characteristics": "1100",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "0100100"
                },
                "Organizing": {
                    "comments": "",
                    "description": "Prepared and/or gathered the materials, tools, and information needed to progress toward the goal",
                    "observable_characteristics": "101",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "111"
                },
                "Overseeing": {
                    "comments": "",
                    "description": "Monitored ongoing progress, assessed resources, and adjusted plans as needed",
                    "observable_characteristics": "11000",
                    "rating": 2,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "10001001"
                },
                "Planning": {
                    "comments": "",
                    "description": "Laid out the course of action required to accomplish a goal",
                    "observable_characteristics": "1100",
                    "rating": 4,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "111001"
                },
                "comments": "",
                "done": True
            },
            "team_id": 1,
            "user_id": 3
        },
        {
            "assessment_task_id": 8,
            "done": True,
            "initial_time": "2024-01-28T21:22:03.218000",
            "last_update": "2024-02-01T21:04:16.909000",
            "rating_observable_characteristics_suggestions_data": {
                "Analyzing": {
                    "comments": "",
                    "description": "Interpreted information to determine meaning and to extract relevant evidence",
                    "observable_characteristics": "101",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Inaccurately",
                        "2": "",
                        "3": "With some errors",
                        "4": "",
                        "5": "Accurately"
                    },
                    "suggestions": "01100"
                },
                "Evaluating": {
                    "comments": "",
                    "description": "Determined the relevance and reliability of information that might be used to support the conclusion or argument",
                    "observable_characteristics": "110",
                    "rating": 2,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Extensively"
                    },
                    "suggestions": "11000"
                },
                "Forming Arguments (Structure)": {
                    "comments": "",
                    "description": "Made an argument that includes a claim (a position), supporting information, and reasoning.",
                    "observable_characteristics": "1110",
                    "rating": 2,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "0101000"
                },
                "Forming Arguments (Validity)": {
                    "comments": "Then Again",
                    "description": "The claim, evidence, and reasoning were logical and consistent with broadly accepted principles.",
                    "observable_characteristics": "11000",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Fully"
                    },
                    "suggestions": "00110"
                },
                "Identifying the Goal": {
                    "comments": "",
                    "description": "Determined the purpose/context of the argument or conclusion that needed to be made",
                    "observable_characteristics": "001",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "1101"
                },
                "Synthesizing": {
                    "comments": "Charlie",
                    "description": "Connected or integrated information to support an argument or reach a conclusion",
                    "observable_characteristics": "100",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Inaccurately",
                        "2": "",
                        "3": "With some errors",
                        "4": "",
                        "5": "Accurately"
                    },
                    "suggestions": "00010"
                },
                "comments": "",
                "done": True
            },
            "team_id": 1,
            "user_id": 3
        },
        {
            "assessment_task_id": 9,
            "done": True,
            "initial_time": "2024-01-28T21:26:21.901000",
            "last_update": "2024-02-01T21:05:39.666000",
            "rating_observable_characteristics_suggestions_data": {
                "Audience": {
                    "comments": "12341234123412341234",
                    "description": "Uses language and delivery style that is consistent with the norms of the subject area and suitable for the audience",
                    "observable_characteristics": "101",
                    "rating": 4,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "010100"
                },
                "Delivery (oral)": {
                    "comments": "",
                    "description": "Uses voice and body language to convey the intended message in a clear and engaging manner",
                    "observable_characteristics": "1000",
                    "rating": 4,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "01011"
                },
                "Format and Style": {
                    "comments": "",
                    "description": "Selects a format and style that enhances the effectiveness of the communication",
                    "observable_characteristics": "001",
                    "rating": 4,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "100011"
                },
                "Intent": {
                    "comments": "Henry",
                    "description": "Clearly conveys the purpose, and the content is well-aligned towards this intent",
                    "observable_characteristics": "101",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "00110"
                },
                "Mechanics (written words)": {
                    "comments": "",
                    "description": "Uses expected writing conventions for the form of communication",
                    "observable_characteristics": "1010",
                    "rating": 4,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "1101100"
                },
                "Organization": {
                    "comments": "",
                    "description": "Presents ideas in a logical and cohesive manner",
                    "observable_characteristics": "010",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "000001"
                },
                "Visual Representations": {
                    "comments": "",
                    "description": "Constructs and uses visual representations effectively and appropriately",
                    "observable_characteristics": "100",
                    "rating": 2,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "100111"
                },
                "comments": "Oliver",
                "done": True
            },
            "team_id": 1,
            "user_id": 3
        },
        {
            "assessment_task_id": 10,
            "done": True,
            "initial_time": "2024-01-30T15:11:00.760000",
            "last_update": "2024-02-01T21:06:49.714000",
            "rating_observable_characteristics_suggestions_data": {
                "Audience": {
                    "comments": "",
                    "description": "Uses language and delivery style that is consistent with the norms of the subject area and suitable for the audience",
                    "observable_characteristics": "011",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "101000"
                },
                "Delivery (oral)": {
                    "comments": "",
                    "description": "Uses voice and body language to convey the intended message in a clear and engaging manner",
                    "observable_characteristics": "1001",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "01100"
                },
                "Format and Style": {
                    "comments": "",
                    "description": "Selects a format and style that enhances the effectiveness of the communication",
                    "observable_characteristics": "111",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "000000"
                },
                "Intent": {
                    "comments": "Chester",
                    "description": "Clearly conveys the purpose, and the content is well-aligned towards this intent",
                    "observable_characteristics": "010",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "01001"
                },
                "Mechanics (written words)": {
                    "comments": "",
                    "description": "Uses expected writing conventions for the form of communication",
                    "observable_characteristics": "1000",
                    "rating": 2,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "1000110"
                },
                "Organization": {
                    "comments": "",
                    "description": "Presents ideas in a logical and cohesive manner",
                    "observable_characteristics": "100",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "010100"
                },
                "Visual Representations": {
                    "comments": "Sydney",
                    "description": "Constructs and uses visual representations effectively and appropriately",
                    "observable_characteristics": "110",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "001000"
                },
                "comments": "",
                "done": True
            },
            "team_id": 1,
            "user_id": 3
        },
        {
            "assessment_task_id": 11,
            "done": True,
            "initial_time": "2024-01-30T15:12:56.525000",
            "last_update": "2024-02-05T16:26:42.377000",
            "rating_observable_characteristics_suggestions_data": {
                "Building Community": {
                    "comments": "Abby",
                    "description": "Acted as a cohesive unit that supported and included all team members.",
                    "observable_characteristics": "10100",
                    "rating": 4,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "00010011"
                },
                "Contributing": {
                    "comments": "",
                    "description": "Considered the contributions, strengths and skills of all team members",
                    "observable_characteristics": "0101",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "101110"
                },
                "Interacting": {
                    "comments": "",
                    "description": "Communicated with each other and worked together",
                    "observable_characteristics": "101",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "001001"
                },
                "Progressing": {
                    "comments": "",
                    "description": "Moved forward towards a common goal",
                    "observable_characteristics": "1000",
                    "rating": 5,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Rarely",
                        "2": "",
                        "3": "Sometimes",
                        "4": "",
                        "5": "Consistently"
                    },
                    "suggestions": "1000011"
                },
                "comments": "",
                "done": True
            },
            "team_id": 1,
            "user_id": 3
        },
        {
            "assessment_task_id": 12,
            "done": True,
            "initial_time": "2024-02-05T17:04:36.368000",
            "last_update": "2024-02-05T17:04:38.112000",
            "rating_observable_characteristics_suggestions_data": {
                "Analyzing the situation": {
                    "comments": "",
                    "description": "Determined the scope and complexity of the problem",
                    "observable_characteristics": "110",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "001100"
                },
                "Executing": {
                    "comments": "",
                    "description": "Implemented the strategy effectively",
                    "observable_characteristics": "1000",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "0000001"
                },
                "Identifying": {
                    "comments": "",
                    "description": "Determined the information, tools, and resources necessary to solve the problem",
                    "observable_characteristics": "0100",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "00101"
                },
                "Strategizing": {
                    "comments": "",
                    "description": "Developed a process (series of steps) to arrive at a solution",
                    "observable_characteristics": "010",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "10110"
                },
                "Validating": {
                    "comments": "",
                    "description": "Judged the reasonableness and completeness of the proposed strategy or solution",
                    "observable_characteristics": "0110",
                    "rating": 3,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "0010110"
                },
                "comments": "",
                "done": True
            },
            "team_id": 1,
            "user_id": 4
        },
        {
            "assessment_task_id": 13,
            "done": True,
            "initial_time": "2024-02-05T17:07:57.768000",
            "last_update": "2024-02-05T17:08:00.783000",
            "rating_observable_characteristics_suggestions_data": {
                "Analyzing the situation": {
                    "comments": "",
                    "description": "Determined the scope and complexity of the problem",
                    "observable_characteristics": "110",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "000001"
                },
                "Executing": {
                    "comments": "",
                    "description": "Implemented the strategy effectively",
                    "observable_characteristics": "1000",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "0000110"
                },
                "Identifying": {
                    "comments": "",
                    "description": "Determined the information, tools, and resources necessary to solve the problem",
                    "observable_characteristics": "1010",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "11111"
                },
                "Strategizing": {
                    "comments": "",
                    "description": "Developed a process (series of steps) to arrive at a solution",
                    "observable_characteristics": "101",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "00101"
                },
                "Validating": {
                    "comments": "",
                    "description": "Judged the reasonableness and completeness of the proposed strategy or solution",
                    "observable_characteristics": "1010",
                    "rating": 1,
                    "rating_json": {
                        "0": "No evidence",
                        "1": "Minimally",
                        "2": "",
                        "3": "Partially",
                        "4": "",
                        "5": "Completely"
                    },
                    "suggestions": "1000100"
                },
                "comments": "",
                "done": True
            },
            "team_id": 1,
            "user_id": 4
        }
    ]

    for comp_assessment in list_of_completed_assessments:
        create_completed_assessment({
            "assessment_task_id": comp_assessment["assessment_task_id"],
            "team_id": comp_assessment["team_id"],
            "user_id": comp_assessment["user_id"],
            "initial_time": comp_assessment["initial_time"],
            "last_update": comp_assessment["last_update"],
            "rating_observable_characteristics_suggestions_data": comp_assessment["rating_observable_characteristics_suggestions_data"],
            "done": comp_assessment["done"],
        })

def replace_completed_assessment(completed_assessment_data, completed_assessment_id):
    if "." not in completed_assessment_data["last_update"]:
        completed_assessment_data["last_update"] = completed_assessment_data["last_update"] + ".000"

    if "Z" not in completed_assessment_data["last_update"]:
        completed_assessment_data["last_update"] = completed_assessment_data["last_update"] + "Z"

    one_completed_assessment = CompletedAssessment.query.filter_by(completed_assessment_id=completed_assessment_id).first()

    if one_completed_assessment is None:
        raise InvalidCRID

    one_completed_assessment.assessment_task_id = completed_assessment_data["assessment_task_id"]
    one_completed_assessment.team_id = completed_assessment_data["team_id"]
    one_completed_assessment.user_id = completed_assessment_data["user_id"]
    one_completed_assessment.last_update = datetime.strptime(completed_assessment_data["last_update"], '%Y-%m-%dT%H:%M:%S.%fZ')
    one_completed_assessment.rating_observable_characteristics_suggestions_data = completed_assessment_data["rating_observable_characteristics_suggestions_data"]
    one_completed_assessment.done = completed_assessment_data["done"]

    db.session.commit()

    return one_completed_assessment
from datetime import datetime
import pytz

def convert_timezone(completed_assessment, assessment_task):
    """
    Description:
    Convert times of a completed assessment to the timezone of its assessment task

    Parameters:
    completed_assessment: CompletedAssessment
    assessment_task: AssessmentTask

    Return:
    CompletedAssessment with converted timezone
    """

    if not assessment_task:
        return completed_assessment

    timezone_list = {
        "PST": "America/Los_Angeles",
        "PDT": "America/Los_Angeles",
        "MST": "America/Denver",
        "MDT": "America/Denver",
        "CST": "America/Chicago",
        "CDT": "America/Chicago",
        "EST": "America/New_York",
        "EDT": "America/New_York",
    }

    task_timezone = assessment_task.time_zone
    pytz_timezone = pytz.timezone(timezone_list.get(task_timezone, "UTC"))

    if completed_assessment.initial_time:
        completed_assessment.initial_time = completed_assessment.initial_time.astimezone(pytz_timezone)
        
    if completed_assessment.last_update:
        completed_assessment.last_update = completed_assessment.last_update.astimezone(pytz_timezone)

    return completed_assessment
    
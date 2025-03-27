from datetime import datetime
import pytz

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

def parse_and_convert_timezone(time_str, assessment_task):
    """
    Parse a time string and convert it to the assessment task's timezone
    
    Parameters:
    time_str: ISO format time string in UTC
    assessment_task: AssessmentTask object
    
    Returns:
    Timezone-aware datetime in the assessment task's timezone
    """

    if "." not in time_str:
        time_str = time_str + ".000"
    
    if "Z" not in time_str:
        time_str = time_str + "Z"
    

    utc_time = datetime.strptime(time_str, '%Y-%m-%dT%H:%M:%S.%fZ').replace(tzinfo=pytz.UTC)
    
    # Gets the correct timezone
    if assessment_task and assessment_task.time_zone:
        pytz_timezone = pytz.timezone(timezone_list.get(assessment_task.time_zone, "UTC"))
        return utc_time.astimezone(pytz_timezone)
    
    return utc_time

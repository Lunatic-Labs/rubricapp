from core import db
from sqlalchemy.sql import text
from sqlalchemy import RowMapping
from collections.abc import Sequence
from datetime import datetime

def call_procedure_FilterStudentAssessmentTasks(
    user_id: int, course_id: int
) -> Sequence[RowMapping]:
    """Returns the desired assessment tasks bound with their respective completed assessments.

    Args:
        user_id: Student user id the assessment tasks are fetched for.
        course_id: Course id the assessment tasks belong to.

    Returns:
        A mapping where a row contains all the assessment task information and completed assessment task data in a non-repeated form.
    """
    result = db.session.connection().execute(
        text("CALL FilterStudentAssessmentTasks(:user_id, :course_id);"),
        {
            "user_id": user_id,
            "course_id": course_id,
        },
    )

    rows = []

    datetime_fields = [
        "due_date",
        "initial_time",
        "last_update",
        "notification_sent",
    ]

    for row in result.mappings():
        row = dict(row)

        for field in datetime_fields:
            if row[field] is not None:
                row[field] = row[field].isoformat()

        rows.append(row)

    return rows 

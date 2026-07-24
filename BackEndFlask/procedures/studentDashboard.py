from core import db
from sqlalchemy.sql import text
from models.utility import error_log
from sqlalchemy import RowMapping
from collections.abc import Sequence

@error_log
def getStudentDashBoardAssessments(
    user_id: int, course_id: int
) -> Sequence[RowMapping]:
    """Returns the desired assessment tasks bound with their respective completed assessments.

    Args:
        user_id: Student user id the assessment tasks are fetched for.
        course_id: Course id the assessment tasks belong to.

    Returns:
        A mapping where a row contains all the assessment task information and completed assessment task data in a non-repeated form.
    """
    result = db.session.execute(
        text("CALL FilterStudentAssessmentTasks(:user_id, :course_id)"),
        {
            "user_id": user_id,
            "course_id": course_id,
        },
    )

    result = result.mappings()
    return result.all()

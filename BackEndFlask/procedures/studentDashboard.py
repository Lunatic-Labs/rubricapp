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
    stmt = text(
        "CALL FilterStudentAssessmentTasks(:user_id, :course_id)"
    ).columns(
        completed_assessment_id=db.Integer(),
        assessment_task_id=db.Integer(),
        completed_by=db.Integer(),
        team_id=db.Integer(),
        team_name=db.String(),
        user_id=db.Integer(),
        first_name=db.String(),
        last_name=db.String(),
        initial_time=db.DateTime(),
        done=db.Boolean(),
        last_update=db.DateTime(),
        rating_observable_characteristics_suggestions_data=db.JSON(),
        completed_count=db.Integer(),
        assessment_task_name=db.String(),
        course_id=db.Integer(),
        rubric_id=db.Integer(),
        role_id=db.Integer(),
        due_date=db.DateTime(),
        time_zone=db.String(),
        show_suggestions=db.Boolean(),
        show_ratings=db.Boolean(),
        unit_of_assessment=db.Boolean(),
        create_team_password=db.String(),
        comment=db.String(),
        number_of_teams=db.Integer(),
        max_team_size=db.Integer(),
        notification_sent=db.DateTime(),
        locked=db.Boolean(),
        published=db.Boolean(),
    )

    result = db.session.execute(
        stmt,
        {
            "user_id": user_id,
            "course_id": course_id,
        },
    )

    return result.mappings().all()
 

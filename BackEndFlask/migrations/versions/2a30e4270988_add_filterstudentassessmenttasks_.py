"""add FilterStudentAssessmentTasks procedure

Revision ID: 2a30e4270988
Revises: b3c4d5e6f7a8
Create Date: 2026-08-06 23:51:09.097221

"""

from pathlib import Path
from alembic import op

# revision identifiers, used by Alembic.
revision = "2a30e4270988"
down_revision = "b3c4d5e6f7a8"
branch_labels = None
depends_on = None


def upgrade():
    sql_file = (
        Path(__file__).resolve()
        .parents[2]
        / "procedures"
        / "studentDashboardProcedure.sql"
    )

    op.execute(sql_file.read_text(encoding="utf-8"))


def downgrade():
    op.execute("""
        DROP PROCEDURE IF EXISTS FilterStudentAssessmentTasks;
    """)
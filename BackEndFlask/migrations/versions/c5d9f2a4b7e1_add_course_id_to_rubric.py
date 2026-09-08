"""add course_id to rubric

Revision ID: c5d9f2a4b7e1
Revises: 2a30e4270988
Create Date: 2026-09-03 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c5d9f2a4b7e1'
down_revision = '2a30e4270988'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'Rubric',
        sa.Column('course_id', sa.Integer(), nullable=True)
    )
    op.create_foreign_key(
        'fk_rubric_course_id',
        'Rubric',
        'Course',
        ['course_id'],
        ['course_id']
    )
    # Backfill: a rubric created before course scoping belongs to the course
    # of the first assessment task that uses it. Rubrics not used by any
    # task stay NULL (visible only to their creator).
    op.execute("""
        UPDATE Rubric
        SET course_id = (
            SELECT AT.course_id
            FROM AssessmentTask AT
            WHERE AT.rubric_id = Rubric.rubric_id
            LIMIT 1
        )
    """)


def downgrade():
    op.drop_constraint('fk_rubric_course_id', 'Rubric', type_='foreignkey')
    op.drop_column('Rubric', 'course_id')

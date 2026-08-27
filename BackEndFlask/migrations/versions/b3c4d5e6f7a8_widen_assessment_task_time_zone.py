"""Widen assessment_task time_zone from String(5) to String(50) for IANA format

Revision ID: b3c4d5e6f7a8
Revises: a1b2c3d4e5f6
Create Date: 2026-04-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b3c4d5e6f7a8'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('AssessmentTask') as batch_op:
        batch_op.alter_column('time_zone', type_=sa.String(50), nullable=False)


def downgrade():
    with op.batch_alter_table('AssessmentTask') as batch_op:
        batch_op.alter_column('time_zone', existing_type=sa.String(50), type_=sa.String(5), nullable=False)

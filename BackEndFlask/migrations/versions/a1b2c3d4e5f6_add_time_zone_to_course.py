"""Add time_zone to Course table

Revision ID: a1b2c3d4e5f6
Revises: 51ae14b2150d
Create Date: 2026-03-23 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'b3a7c2d0e1f8'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('Course', sa.Column('time_zone', sa.String(50), nullable=True))


def downgrade():
    op.drop_column('Course', 'time_zone')

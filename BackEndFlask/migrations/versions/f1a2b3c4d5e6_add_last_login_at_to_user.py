"""Add last login timestamp to User

Revision ID: f1a2b3c4d5e6
Revises: 51ae14b2150d
Create Date: 2026-09-08 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'f1a2b3c4d5e6'
down_revision = '51ae14b2150d'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('User', schema=None) as batch_op:
        batch_op.add_column(sa.Column('last_login_at', sa.DateTime(timezone=True), nullable=True))


def downgrade():
    with op.batch_alter_table('User', schema=None) as batch_op:
        batch_op.drop_column('last_login_at')
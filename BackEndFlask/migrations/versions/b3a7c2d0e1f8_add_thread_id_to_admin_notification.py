"""add_thread_id_to_admin_notification

Revision ID: b3a7c2d0e1f8
Revises: 204609b1e9ff
Create Date: 2026-03-29

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'b3a7c2d0e1f8'
down_revision = '204609b1e9ff'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('AdminNotification', sa.Column('thread_id', sa.Integer(), sa.ForeignKey('AdminNotification.admin_notification_id'), nullable=True))


def downgrade():
    op.drop_column('AdminNotification', 'thread_id')

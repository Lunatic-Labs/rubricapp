"""add_admin_notification_table

Revision ID: 204609b1e9ff
Revises: 51ae14b2150d
Create Date: 2026-03-29 17:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '204609b1e9ff'
down_revision = '51ae14b2150d'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'AdminNotification',
        sa.Column('admin_notification_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('subject', sa.String(length=200), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('sent_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['sender_id'], ['User.user_id']),
        sa.PrimaryKeyConstraint('admin_notification_id')
    )


def downgrade():
    op.drop_table('AdminNotification')

"""merge current migration heads

Revision ID: cc347340a108
Revises: f1a2b3c4d5e6, 2a30e4270988
Create Date: 2026-09-08 21:12:54.609805

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cc347340a108'
down_revision = ('f1a2b3c4d5e6', '2a30e4270988')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass

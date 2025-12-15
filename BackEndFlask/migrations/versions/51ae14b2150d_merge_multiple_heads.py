"""merge multiple heads

Revision ID: 51ae14b2150d
Revises: 62f6b9e34e01, 6a1bbb69b54a, cdbfa4b948a6
Create Date: 2025-11-20 17:08:52.389522

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '51ae14b2150d'
down_revision = ('62f6b9e34e01', '6a1bbb69b54a', 'cdbfa4b948a6')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass

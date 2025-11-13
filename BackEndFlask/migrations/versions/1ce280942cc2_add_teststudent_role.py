"""Add TestStudent role

Revision ID: 1ce280942cc2
Revises: 0f5614086ba2
Create Date: 2025-11-11 21:44:30.431535

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1ce280942cc2'
down_revision = '0f5614086ba2'
branch_labels = None
depends_on = None


def upgrade():
    """Add TestStudent role to the role table"""
    op.execute("""
        INSERT INTO role (role_id, role_name) 
        VALUES (6, 'TestStudent')
        ON DUPLICATE KEY UPDATE role_name = 'TestStudent'
    """)


def downgrade():
    """Remove TestStudent role from the role table"""
    op.execute("DELETE FROM role WHERE role_id = 6")

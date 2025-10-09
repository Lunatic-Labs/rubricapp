"""Changed role_name from text to string

Revision ID: 9aa494f95475
Revises: 0d58fa9b8925
Create Date: 2025-10-07 15:14:45.243503

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9aa494f95475'
down_revision = '0d58fa9b8925'
branch_labels = None
depends_on = None


def upgrade():
    # Change role_name from Text to String(20)
    op.alter_column('Role', 'role_name',
                   existing_type=sa.Text(),
                   type_=sa.String(20),
                   existing_nullable=False)

def downgrade():
    # Reverse the change - String back to Text
    op.alter_column('Role', 'role_name',
                   existing_type=sa.String(20),
                   type_=sa.Text(),
                   existing_nullable=False)
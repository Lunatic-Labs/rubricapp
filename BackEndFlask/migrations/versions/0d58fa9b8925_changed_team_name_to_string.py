"""Changed team_name to string

Revision ID: 0d58fa9b8925
Revises: 9e451a7f31df
Create Date: 2025-10-02 15:22:04.487119

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0d58fa9b8925'
down_revision = '6ba5a8670ef1'
branch_labels = None
depends_on = None


def upgrade():
    # Change team_name from Text to String(50)
    op.alter_column('Team', 'team_name',
                   existing_type=sa.Text(),
                   type_=sa.String(50),
                   existing_nullable=False)

def downgrade():
    # Reverse the change - String back to Text
    op.alter_column('Team', 'team_name',
                   existing_type=sa.String(50),
                   type_=sa.Text(),
                   existing_nullable=False)

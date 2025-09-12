"""Set ON DELETE for TeamUser.team_id

Revision ID: e0656a03c4e6
Revises: db6727070aae
Create Date: 2025-09-09 15:00:43.227030

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e0656a03c4e6'
down_revision = 'db6727070aae'
branch_labels = None
depends_on = None


def upgrade():
    # Drop the old foreign key constraint
    op.drop_constraint('TeamUser_ibfk_1', 'TeamUser', type_='foreignkey')
    # Add the new foreign key constraint with ON DELETE CASCADE
    op.create_foreign_key(
        'TeamUser_ibfk_1',
        'TeamUser', 'Team',
        ['team_id'], ['team_id'],
        ondelete='CASCADE'
    )


def downgrade():
    # Drop the CASCADE constraint and restore the original (no cascade)
    op.drop_constraint('TeamUser_ibfk_1', 'TeamUser', type_='foreignkey')
    op.create_foreign_key(
        'TeamUser_ibfk_1',
        'TeamUser', 'Team',
        ['team_id'], ['team_id']
        # No ondelete
    )

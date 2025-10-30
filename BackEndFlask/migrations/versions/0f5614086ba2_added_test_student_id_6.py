"""Added Test student ID 6

Revision ID: 0f5614086ba2
Revises: 9aa494f95475
Create Date: 2025-10-28 16:00:07.995078

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0f5614086ba2'
down_revision = '9aa494f95475'
branch_labels = None
depends_on = None


def upgrade():
    """Add TestStudent role to roles table"""
    # Use raw SQL to insert the TestStudent role
    # Using INSERT IGNORE or ON DUPLICATE KEY UPDATE to handle if it already exists
    op.execute("""
        INSERT INTO roles (role_id, role_name) 
        VALUES (6, 'TestStudent')
        ON DUPLICATE KEY UPDATE role_name = 'TestStudent'
    """)
    
    # Alternative for PostgreSQL (if you're using PostgreSQL instead of MySQL):
    # op.execute("""
    #     INSERT INTO roles (role_id, role_name) 
    #     VALUES (6, 'TestStudent')
    #     ON CONFLICT (role_id) DO UPDATE SET role_name = 'TestStudent'
    # """)


def downgrade():
    """Remove TestStudent role from roles table"""
    # Delete the TestStudent role
    op.execute("DELETE FROM roles WHERE role_id = 6")
    
    # Also remove any user_course entries with this role to maintain referential integrity
    op.execute("DELETE FROM user_courses WHERE role_id = 6")

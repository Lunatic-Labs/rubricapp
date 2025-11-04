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
    # Get connection and check if table exists
    conn = op.get_bind()
    inspector = inspect(conn)
    
    # Only insert if roles table exists
    if 'roles' in inspector.get_table_names():
        op.execute("""
            INSERT INTO roles (role_id, role_name) 
            VALUES (6, 'TestStudent')
            ON DUPLICATE KEY UPDATE role_name = 'TestStudent'
        """)
        print("TestStudent role added successfully")
    else:
        print("Roles table doesn't exist yet, skipping TestStudent insertion")


def downgrade():
    """Remove TestStudent role from roles table"""
    conn = op.get_bind()
    inspector = inspect(conn)
    
    if 'roles' in inspector.get_table_names():
        op.execute("DELETE FROM roles WHERE role_id = 6")
        op.execute("DELETE FROM user_courses WHERE role_id = 6")
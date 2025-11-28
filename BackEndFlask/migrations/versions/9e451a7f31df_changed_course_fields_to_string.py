"""Changed Course Fields to String

Revision ID: 9e451a7f31df
Revises: db6727070aae
Create Date: 2025-09-25 15:23:06.336582

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9e451a7f31df'
down_revision = 'db6727070aae'
branch_labels = None
depends_on = None


def upgrade():
    # Change course_number from Text to String(20)
    op.alter_column('Course', 'course_number',
                   existing_type=sa.Text(),
                   type_=sa.String(20),
                   existing_nullable=False)
    
    # Change course_name from Text to String(50)  
    op.alter_column('Course', 'course_name',
                   existing_type=sa.Text(),
                   type_=sa.String(50),
                   existing_nullable=False)
    
    # Change term from Text to String(20)
    op.alter_column('Course', 'term',
                   existing_type=sa.Text(),
                   type_=sa.String(20),
                   existing_nullable=False)

def downgrade():
    # Reverse the changes - String back to Text
    op.alter_column('Course', 'term',
                   existing_type=sa.String(20),
                   type_=sa.Text(),
                   existing_nullable=False)
    
    op.alter_column('Course', 'course_name',
                   existing_type=sa.String(50),
                   type_=sa.Text(),
                   existing_nullable=False)
    
    op.alter_column('Course', 'course_number',
                   existing_type=sa.String(20),
                   type_=sa.Text(),
                   existing_nullable=False)

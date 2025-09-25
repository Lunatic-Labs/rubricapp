"""Change course fields from Text to String with limits

Revision ID: 2c0c4ec96eec
Revises: db6727070aae
Create Date: 2025-09-23 16:40:54.321475

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2c0c4ec96eec'
down_revision = 'db6727070aae'
branch_labels = None
depends_on = None


def upgrade():
    #change course_number from Text to String(20)
    op.alter_column('Course', 'course_number',
               existing_type=sa.Text(),
               type_=sa.String(length=20),
               existing_nullable=False)
    
    #change course_name from Text to String(50)
    op.alter_column('Course', 'course_name',
               existing_type=sa.Text(),
               type_=sa.String(length=50),
               existing_nullable=False)
    
    #change term from Text to String(20)
    op.alter_column('Course', 'term',
               existing_type=sa.Text(),
               type_=sa.String(length=20),
               existing_nullable=False)


def downgrade():
    #reverse the changes - String back to Text
    op.alter_column('Course', 'course_number',
               existing_type=sa.String(length=20),
               type_=sa.Text(),
               existing_nullable=False)
    
    op.alter_column('Course', 'course_name',
               existing_type=sa.String(length=50),
               type_=sa.Text(),
               existing_nullable=False)
    
    op.alter_column('Course', 'term',
               existing_type=sa.String(length=20),
               type_=sa.Text(),
               existing_nullable=False)

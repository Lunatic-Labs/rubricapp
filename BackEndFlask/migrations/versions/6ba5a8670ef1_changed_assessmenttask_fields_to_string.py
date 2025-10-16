"""Changed AssessmentTask fields to string

Revision ID: 6ba5a8670ef1
Revises: 9e451a7f31df
Create Date: 2025-10-02 13:48:16.111874

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6ba5a8670ef1'
down_revision = '7c2e82728947'
branch_labels = None
depends_on = None


def upgrade():
    # Change assessment_task_name from Text to String(50)
    op.alter_column('AssessmentTask', 'assessment_task_name',
                   existing_type=sa.Text(),
                   type_=sa.String(50),
                   existing_nullable=False)
    
    # Change time_zone from Text to String(5)
    op.alter_column('AssessmentTask', 'time_zone',
                   existing_type=sa.Text(),
                   type_=sa.String(5),
                   existing_nullable=False)
    
    # Change create_team_password from Text to String(20)
    op.alter_column('AssessmentTask', 'create_team_password',
                   existing_type=sa.Text(),
                   type_=sa.String(20),
                   existing_nullable=True)

def downgrade():
    # Reverse the changes - String back to Text
    op.alter_column('AssessmentTask', 'create_team_password',
                   existing_type=sa.String(20),
                   type_=sa.Text(),
                   existing_nullable=True)
    
    op.alter_column('AssessmentTask', 'time_zone',
                   existing_type=sa.String(5),
                   type_=sa.Text(),
                   existing_nullable=False)
    
    op.alter_column('AssessmentTask', 'assessment_task_name',
                   existing_type=sa.String(50),
                   type_=sa.Text(),
                   existing_nullable=False)

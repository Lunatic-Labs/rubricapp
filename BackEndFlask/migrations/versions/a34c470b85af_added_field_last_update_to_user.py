"""Added field last_update to User

Revision ID: a34c470b85af
Revises: 9820393e9e55
Create Date: 2025-01-26 02:42:08.492048

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'a34c470b85af'
down_revision = '9820393e9e55'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('BouncedEmailTimestamp')
    with op.batch_alter_table('User', schema=None) as batch_op:
        batch_op.add_column(sa.Column('last_update', sa.DateTime(timezone=True), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('User', schema=None) as batch_op:
        batch_op.drop_column('last_update')

    op.create_table('BouncedEmailTimestamp',
    sa.Column('last_checked', mysql.DATETIME(), nullable=False),
    sa.PrimaryKeyConstraint('last_checked'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    # ### end Alembic commands ###

"""add reset_code_expires_at and password_version to User

Gives password reset codes a lifetime, and gives every user a counter that is
bumped when their password changes. Tokens carry the value they were minted
under, so a reset stops older sessions from being accepted.

reset_code_expires_at is nullable: a null expiry means no code is outstanding.
password_version defaults to 0 so existing rows and the tokens already issued
against them keep matching.

Revision ID: c7f1a9d24b30
Revises: 2a30e4270988
Create Date: 2026-09-08 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c7f1a9d24b30"
down_revision = "2a30e4270988"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("User") as batch_op:
        batch_op.add_column(sa.Column("reset_code_expires_at", sa.DateTime(timezone=True), nullable=True))
        batch_op.add_column(sa.Column("password_version", sa.Integer(), nullable=False, server_default="0"))


def downgrade():
    with op.batch_alter_table("User") as batch_op:
        batch_op.drop_column("password_version")
        batch_op.drop_column("reset_code_expires_at")

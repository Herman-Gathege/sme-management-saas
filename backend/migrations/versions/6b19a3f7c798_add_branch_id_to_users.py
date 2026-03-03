"""Add branch_id to users

Revision ID: 6b19a3f7c798
Revises: 3bc737585423
Create Date: 2026-03-03 16:10:58.050327

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b19a3f7c798'
down_revision = '3bc737585423'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('branch_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            'fk_users_branch_id',
            'branches',
            ['branch_id'],
            ['id']
        )


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('fk_users_branch_id', type_='foreignkey')
        batch_op.drop_column('branch_id')
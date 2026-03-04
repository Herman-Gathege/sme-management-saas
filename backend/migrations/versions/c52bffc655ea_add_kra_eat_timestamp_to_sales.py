"""Add kra_eat_timestamp to sales

Revision ID: c52bffc655ea
Revises: 6b19a3f7c798
Create Date: 2026-03-04 15:39:22.483729

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c52bffc655ea'
down_revision = '6b19a3f7c798'
branch_labels = None
depends_on = None


def upgrade():

    with op.batch_alter_table('sales', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('kra_eat_timestamp', sa.DateTime(), nullable=True)
        )

    # ### end Alembic commands ###


def downgrade():

    with op.batch_alter_table('sales', schema=None) as batch_op:
        batch_op.drop_column('kra_eat_timestamp')

    # ### end Alembic commands ###

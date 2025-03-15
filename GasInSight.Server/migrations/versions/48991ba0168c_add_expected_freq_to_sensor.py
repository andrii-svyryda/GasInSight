"""add_expected_freq_to_sensor

Revision ID: 48991ba0168c
Revises: 4e73abd3d617
Create Date: 2025-03-15 23:01:04.847093

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '48991ba0168c'
down_revision: Union[str, None] = '4e73abd3d617'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('sensors', sa.Column('expected_freq', sa.String(), nullable=False, server_default="1H"))


def downgrade() -> None:
    op.drop_column('sensors', 'expected_freq')

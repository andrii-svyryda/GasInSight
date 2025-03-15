"""add_initial_admin_user

Revision ID: c3dec047ec83
Revises: 64e4a7f312ee
Create Date: 2025-03-15 13:58:48.454005

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, DateTime
from datetime import datetime, timezone
from passlib.context import CryptContext


# revision identifiers, used by Alembic.
revision: str = 'c3dec047ec83'
down_revision: Union[str, None] = '64e4a7f312ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def upgrade() -> None:
    users = table('users',
        column('id', Integer),
        column('username', String),
        column('email', String),
        column('password_hash', String),
        column('created_at', DateTime),
        column('refresh_token', String),
        column('last_login', DateTime),
        column('role', String)
    )
    
    op.bulk_insert(
        users,
        [
            {
                'id': 1,
                'username': 'admin',
                'email': 'admin@gasinisight.com',
                'password_hash': pwd_context.hash('Admin123!'),
                'created_at': datetime.now(timezone.utc),
                'refresh_token': None,
                'last_login': None,
                'role': 'Admin'
            }
        ]
    )


def downgrade() -> None:
    op.execute("DELETE FROM users WHERE username = 'admin'")

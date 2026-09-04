"""add operator verification fields

Revision ID: dc8d93603fd8
Revises: 1d2c5d4772e2
Create Date: 2026-08-14 17:07:52.151906

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "dc8d93603fd8"
down_revision: Union[str, None] = "1d2c5d4772e2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.add_column(
        "weather_observations",
        sa.Column(
            "verified_by",
            sa.String(length=100),
            nullable=True,
        ),
    )

    op.add_column(
        "weather_observations",
        sa.Column(
            "verified_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    op.add_column(
        "weather_observations",
        sa.Column(
            "verification_remarks",
            sa.Text(),
            nullable=True,
        ),
    )


def downgrade() -> None:

    op.drop_column(
        "weather_observations",
        "verification_remarks",
    )

    op.drop_column(
        "weather_observations",
        "verified_at",
    )

    op.drop_column(
        "weather_observations",
        "verified_by",
    )

"""add district observation time performance index

Revision ID: 958f8fd62182
Revises: db6b2d51b987
Create Date: 2026-09-01 05:35:55.332238

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "958f8fd62182"
down_revision: Union[str, None] = "db6b2d51b987"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_weather_observations_district_time",
        "weather_observations",
        [
            "normalized_district",
            "observation_time",
        ],
        unique=False,
        if_not_exists=True,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_weather_observations_district_time",
        table_name="weather_observations",
        if_exists=True,
    )

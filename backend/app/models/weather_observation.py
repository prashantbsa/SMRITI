import uuid as uuid_lib
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    DateTime,
    Float,
    Index,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column,relationship

from app.models.base import Base
from app.models.mixins import TimestampMixin


class WeatherObservation(Base, TimestampMixin):
    """
    One citizen weather observation submitted to SMRITI.
    """

    __tablename__ = "weather_observations"

    __table_args__ = (
        Index(
            "ix_weather_observations_district_time",
            "normalized_district",
            "observation_time",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    uuid: Mapped[uuid_lib.UUID] = mapped_column(
        UUID(as_uuid=True),
        default=uuid_lib.uuid4,
        unique=True,
        nullable=False,
    )

    reporter_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    reporter_name: Mapped[Optional[str]] = mapped_column(
        String(200),
        nullable=True,
    )

    reporter_mobile: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        index=True,
    )

    source: Mapped[str] = mapped_column(
        String(50),
        default="SMRITI",
        nullable=False,
    )

    source_record_id: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
        unique=True,
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
    )

    district: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
    )

    normalized_state: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    normalized_district: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )

    weather_code: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
        index=True,
    )


    phenomenon: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    severity: Mapped[str] = mapped_column(
        String(30),
        nullable=True,
    )

    observation_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    language: Mapped[str] = mapped_column(
        String(30),
        default="en",
        nullable=False,
    )

    remarks: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    verification_status: Mapped[str] = mapped_column(
        String(20),
        default="UNVERIFIED",
        nullable=False,
    )

    verified_by: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    verified_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    verification_remarks: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    images = relationship(
        "WeatherObservationImage",
        back_populates="observation",
        cascade="all, delete-orphan",
    )
    events = relationship(
        "WeatherObservationEvent",
        back_populates="observation",
        cascade="all, delete-orphan",
    )

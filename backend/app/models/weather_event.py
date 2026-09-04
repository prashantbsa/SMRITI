import uuid as uuid_lib
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class WeatherEvent(Base, TimestampMixin):
    """
    Represents a tracked weather event created from one or more
    citizen observations.

    This is an operational tracking entity.
    It does not replace the original observations.
    """

    __tablename__ = "weather_events"

    __table_args__ = (
        UniqueConstraint(
            "district",
            "weather_type",
            "start_time",
            name="uq_weather_events_district_type_start",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    uuid: Mapped[uuid_lib.UUID] = mapped_column(
        UUID(as_uuid=True),
        default=uuid_lib.uuid4,
        unique=True,
        nullable=False,
    )

    # Event classification
    weather_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Geographic information
    state: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    district: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    latitude: Mapped[Optional[float]] = mapped_column(
        nullable=True,
    )

    longitude: Mapped[Optional[float]] = mapped_column(
        nullable=True,
    )

    # Event timing
    start_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    end_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Evidence Strength
    evidence_strength: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        comment="Suggested evidence strength score from observations",
    )

    # Workflow status
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="active",
    )

    observations = relationship(
        "WeatherObservationEvent",
        back_populates="weather_event",
        cascade="all, delete-orphan",
    )

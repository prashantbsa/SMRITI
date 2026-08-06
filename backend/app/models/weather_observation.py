import uuid as uuid_lib
from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
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

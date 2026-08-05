import uuid as uuid_lib

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional
from app.models.base import Base, TimestampMixin


class WeatherObservationImage(Base, TimestampMixin):
    __tablename__ = "weather_observation_images"

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

    observation_id: Mapped[int] = mapped_column(
        ForeignKey("weather_observations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    image_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    thumbnail_url: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True,
    )

    caption: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    observation = relationship(
        "WeatherObservation",
        back_populates="images",
    )

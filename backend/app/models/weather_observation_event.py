import uuid as uuid_lib

from sqlalchemy import ForeignKey, Integer, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class WeatherObservationEvent(Base, TimestampMixin):
    """
    Links citizen observations with tracked weather events.

    A single event can contain multiple observations.
    An observation can optionally be linked to an event.
    """

    __tablename__ = "weather_observation_events"

    __table_args__ = (
        UniqueConstraint(
            "observation_id",
            "weather_event_id",
            name="uq_weather_observation_events_observation_event",
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

    observation_id: Mapped[int] = mapped_column(
        ForeignKey(
            "weather_observations.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    weather_event_id: Mapped[int] = mapped_column(
        ForeignKey(
            "weather_events.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    observation = relationship(
        "WeatherObservation",
        back_populates="events",
    )

    weather_event = relationship(
        "WeatherEvent",
        back_populates="observations",
    )

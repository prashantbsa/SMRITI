import uuid as uuid_lib
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class PortalSession(Base, TimestampMixin):
    """
    Server-side authenticated portal session.

    The raw session token is never stored in the database.
    Only a SHA-256 hash of the token is stored.

    PostgreSQL also guarantees that a portal user can have
    at most one non-revoked session at a time.
    """

    __tablename__ = "portal_sessions"

    __table_args__ = (
        Index(
            "uq_portal_sessions_one_active_per_user",
            "user_id",
            unique=True,
            postgresql_where=text(
                "revoked_at IS NULL"
            ),
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

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "portal_users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    token_hash: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
        index=True,
    )

    last_seen_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    revoked_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
    )

    user = relationship(
        "PortalUser",
        back_populates="sessions",
    )

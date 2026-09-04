import uuid as uuid_lib

from sqlalchemy import Boolean, CheckConstraint, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class PortalUser(Base, TimestampMixin):
    """
    User account for access to the SMRITI portal.

    Passwords are stored only as bcrypt hashes.
    """

    __tablename__ = "portal_users"

    __table_args__ = (
        UniqueConstraint(
            "email",
            name="uq_portal_users_email",
        ),
        CheckConstraint(
            "role IN ('ADMIN', 'USER')",
            name="ck_portal_users_role",
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

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(254),
        nullable=False,
    )

    contact_no: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    office: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="USER",
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    sessions = relationship(
        "PortalSession",
        back_populates="user",
        cascade="all, delete-orphan",
    )

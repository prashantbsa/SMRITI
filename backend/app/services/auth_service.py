from datetime import datetime, timezone
from typing import Optional, Tuple

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.models.portal_session import PortalSession
from app.models.portal_user import PortalUser
from app.services.auth_security_service import (
    generate_session_token,
    hash_session_token,
    verify_password,
)


def normalize_email(email: str) -> str:
    """
    Normalize portal login email for consistent lookup.
    """
    return email.strip().lower()


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> Optional[PortalUser]:
    """
    Validate email/password for an active portal user.
    """
    normalized_email = normalize_email(email)

    stmt = (
        select(PortalUser)
        .where(
            PortalUser.email == normalized_email,
            PortalUser.is_active.is_(True),
        )
        .limit(1)
    )

    user = db.execute(stmt).scalar_one_or_none()

    if user is None:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    return user


def create_login_session(
    db: Session,
    user: PortalUser,
) -> Tuple[PortalSession, str]:
    """
    Create exactly one active session for a portal user.

    A row-level lock on the portal user serializes simultaneous
    login attempts for the same account.

    Any existing active session is revoked before the new session
    is created.

    Returns:
        (database session record, raw browser token)
    """
    try:
        # --------------------------------------------------
        # LOCK THIS USER
        #
        # Two simultaneous logins for different users do not
        # block each other. Only logins for this same user are
        # serialized.
        # --------------------------------------------------
        lock_stmt = (
            select(PortalUser.id)
            .where(
                PortalUser.id == user.id,
            )
            .with_for_update()
        )

        locked_user_id = db.execute(
            lock_stmt
        ).scalar_one()

        now = datetime.now(timezone.utc)

        # --------------------------------------------------
        # REVOKE PREVIOUS ACTIVE SESSION
        # --------------------------------------------------
        revoke_stmt = (
            update(PortalSession)
            .where(
                PortalSession.user_id == locked_user_id,
                PortalSession.revoked_at.is_(None),
            )
            .values(
                revoked_at=now,
            )
        )

        db.execute(revoke_stmt)

        # --------------------------------------------------
        # CREATE NEW SESSION
        # --------------------------------------------------
        raw_token = generate_session_token()
        token_hash = hash_session_token(raw_token)

        portal_session = PortalSession(
            user_id=locked_user_id,
            token_hash=token_hash,
            last_seen_at=now,
        )

        db.add(portal_session)

        # Flush while the user row is still locked.
        #
        # PostgreSQL's partial unique index provides the final
        # database-level guarantee that only one non-revoked
        # session can exist for this user.
        db.flush()

        db.commit()
        db.refresh(portal_session)

        return portal_session, raw_token

    except Exception:
        db.rollback()
        raise


def get_user_by_session_token(
    db: Session,
    raw_token: str,
) -> Optional[PortalUser]:
    """
    Resolve an active portal user from a raw browser session token.
    """
    if not raw_token:
        return None

    token_hash = hash_session_token(raw_token)

    stmt = (
        select(PortalUser)
        .join(
            PortalSession,
            PortalSession.user_id == PortalUser.id,
        )
        .where(
            PortalSession.token_hash == token_hash,
            PortalSession.revoked_at.is_(None),
            PortalUser.is_active.is_(True),
        )
        .limit(1)
    )

    return db.execute(stmt).scalar_one_or_none()


def revoke_session(
    db: Session,
    raw_token: str,
) -> bool:
    """
    Revoke one active portal session.
    """
    if not raw_token:
        return False

    token_hash = hash_session_token(raw_token)
    now = datetime.now(timezone.utc)

    stmt = (
        update(PortalSession)
        .where(
            PortalSession.token_hash == token_hash,
            PortalSession.revoked_at.is_(None),
        )
        .values(
            revoked_at=now,
        )
    )

    result = db.execute(stmt)
    db.commit()

    return result.rowcount > 0

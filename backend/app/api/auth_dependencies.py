from typing import Optional

from fastapi import (
    Cookie,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.portal_user import PortalUser
from app.services.auth_service import (
    get_user_by_session_token,
)


SESSION_COOKIE_NAME = "smriti_session"


def get_current_user(
    smriti_session: Optional[str] = Cookie(
        default=None,
        alias=SESSION_COOKIE_NAME,
    ),
    db: Session = Depends(get_db),
) -> PortalUser:
    """
    Require a valid active SMRITI portal session.

    A revoked session, disabled user, missing cookie, or invalid
    token is treated as unauthenticated.
    """
    if not smriti_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
        )

    user = get_user_by_session_token(
        db=db,
        raw_token=smriti_session,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session is invalid or has been revoked.",
        )

    return user


def require_admin(
    current_user: PortalUser = Depends(
        get_current_user
    ),
) -> PortalUser:
    """
    Require an authenticated ADMIN account.
    """
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required.",
        )

    return current_user

import secrets
from typing import Optional

from fastapi import (
    Header,
    HTTPException,
    status,
)

from app.core.config import settings


def require_shared_api_key(
    x_api_key: Optional[str] = Header(
        default=None,
        alias="X-API-Key",
    ),
):
    """
    Authenticate machine-to-machine access to
    SMRITI shared-data APIs.
    """

    if (
        not x_api_key
        or not secrets.compare_digest(
            x_api_key,
            settings.SMRITI_SHARED_API_KEY,
        )
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key.",
        )

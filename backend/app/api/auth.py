from typing import Optional

from fastapi import (
    APIRouter,
    Cookie,
    Depends,
    HTTPException,
    Response,
    status,
)
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.api.auth_dependencies import (
    SESSION_COOKIE_NAME,
    get_current_user,
)
from app.db.database import get_db
from app.models.portal_user import PortalUser
from app.services.auth_service import (
    authenticate_user,
    create_login_session,
    revoke_session,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def user_response(user: PortalUser):
    """
    Return only safe portal-user information.

    password_hash is intentionally never exposed.
    """
    return {
        "id": user.id,
        "uuid": str(user.uuid),
        "name": user.name,
        "email": user.email,
        "contact_no": user.contact_no,
        "office": user.office,
        "role": user.role,
        "is_active": user.is_active,
    }


@router.post("/login")
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = authenticate_user(
        db=db,
        email=str(payload.email),
        password=payload.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    _, raw_token = create_login_session(
        db=db,
        user=user,
    )

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=raw_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
    )

    return {
        "authenticated": True,
        "user": user_response(user),
    }


@router.get("/me")
def me(
    current_user: PortalUser = Depends(
        get_current_user
    ),
):
    return {
        "authenticated": True,
        "user": user_response(current_user),
    }


@router.post("/logout")
def logout(
    response: Response,
    smriti_session: Optional[str] = Cookie(
        default=None,
        alias=SESSION_COOKIE_NAME,
    ),
    db: Session = Depends(get_db),
):
    if smriti_session:
        revoke_session(
            db=db,
            raw_token=smriti_session,
        )

    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        path="/",
        httponly=True,
        samesite="lax",
    )

    return {
        "authenticated": False,
        "message": "Logged out successfully.",
    }

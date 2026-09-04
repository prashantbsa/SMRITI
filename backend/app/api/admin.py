from datetime import datetime, timezone
from typing import Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.auth_dependencies import require_admin
from app.db.database import get_db
from app.models.portal_user import PortalUser
from app.models.portal_session import PortalSession
from app.services.auth_security_service import hash_password
from app.services.auth_service import normalize_email
from app.services.meghdoot_import_service import (
    import_from_meghdoot,
    import_all_from_meghdoot,
)
from app.services.verification_service import (
    verify_observation,
    unverify_observation,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[
        Depends(require_admin),
    ],
)


class CreatePortalUserRequest(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=150,
    )

    email: EmailStr

    contact_no: str = Field(
        min_length=1,
        max_length=30,
    )

    office: str = Field(
        min_length=1,
        max_length=200,
    )

    password: str = Field(
        min_length=8,
    )

class ResetPortalUserPasswordRequest(BaseModel):
    password: str = Field(
        min_length=8,
    )


def portal_user_response(user: PortalUser):
    """
    Return safe portal-user information.

    password_hash is never exposed.
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
        "created_at": user.created_at,
    }
@router.get("/users")
def list_portal_users(
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """
    List portal users visible to the administrator.

    Only the fields required by User Management are selected.
    """
    limit = max(
        1,
        min(limit, 500),
    )

    stmt = (
        select(
            PortalUser.id,
            PortalUser.name,
            PortalUser.email,
            PortalUser.contact_no,
            PortalUser.office,
            PortalUser.role,
            PortalUser.is_active,
            PortalUser.created_at,
        )
        .order_by(
            PortalUser.role.asc(),
            PortalUser.name.asc(),
            PortalUser.id.asc(),
        )
        .limit(limit)
    )

    rows = db.execute(stmt).all()

    users = [
        {
            "id": row.id,
            "name": row.name,
            "email": row.email,
            "contact_no": row.contact_no,
            "office": row.office,
            "role": row.role,
            "is_active": row.is_active,
            "created_at": row.created_at,
        }
        for row in rows
    ]

    return {
        "count": len(users),
        "users": users,
    }

@router.post(
    "/users",
    status_code=status.HTTP_201_CREATED,
)
def create_portal_user(
    payload: CreatePortalUserRequest,
    db: Session = Depends(get_db),
):
    """
    Create a normal SMRITI portal user.

    Only an authenticated ADMIN can access this endpoint.
    New accounts created here always receive the USER role.
    """
    name = payload.name.strip()
    email = normalize_email(
        str(payload.email)
    )
    contact_no = payload.contact_no.strip()
    office = payload.office.strip()

    if not name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Name is required.",
        )

    if not contact_no:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Contact number is required.",
        )

    if not office:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Office is required.",
        )

    password_bytes = payload.password.encode(
        "utf-8"
    )

    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "Password must not exceed "
                "72 UTF-8 bytes."
            ),
        )

    # Fast indexed lookup through the existing
    # UNIQUE constraint on portal_users.email.
    existing_user_stmt = (
        select(PortalUser.id)
        .where(
            PortalUser.email == email,
        )
        .limit(1)
    )

    existing_user_id = db.execute(
        existing_user_stmt
    ).scalar_one_or_none()

    if existing_user_id is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "A portal user with this email "
                "already exists."
            ),
        )

    user = PortalUser(
        name=name,
        email=email,
        contact_no=contact_no,
        office=office,
        password_hash=hash_password(
            payload.password
        ),
        role="USER",
        is_active=True,
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)

    except IntegrityError:
        # Protect against two simultaneous requests
        # attempting to create the same email address.
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "A portal user with this email "
                "already exists."
            ),
        )

    except Exception:
        db.rollback()
        raise

    return {
        "created": True,
        "user": portal_user_response(user),
    }

@router.post(
    "/users/{user_id}/reset-password"
)
def reset_portal_user_password(
    user_id: int,
    payload: ResetPortalUserPasswordRequest,
    db: Session = Depends(get_db),
):
    """
    Reset the password of a normal portal USER.

    ADMIN accounts cannot be reset through this endpoint.

    Any active session belonging to the affected user is
    revoked in the same database transaction.
    """
    password_bytes = payload.password.encode(
        "utf-8"
    )

    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "Password must not exceed "
                "72 UTF-8 bytes."
            ),
        )

    try:
        user_stmt = (
            select(PortalUser)
            .where(
                PortalUser.id == user_id,
            )
            .with_for_update()
        )

        user = db.execute(
            user_stmt
        ).scalar_one_or_none()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portal user not found.",
            )

        if user.role == "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "ADMIN password cannot be reset "
                    "through User Management."
                ),
            )

        user.password_hash = hash_password(
            payload.password
        )

        now = datetime.now(timezone.utc)

        revoke_stmt = (
            update(PortalSession)
            .where(
                PortalSession.user_id == user.id,
                PortalSession.revoked_at.is_(None),
            )
            .values(
                revoked_at=now,
            )
        )

        db.execute(revoke_stmt)

        db.commit()

    except HTTPException:
        db.rollback()
        raise

    except Exception:
        db.rollback()
        raise

    return {
        "reset": True,
        "message": (
            "Password reset successfully. "
            "Any active session for this user "
            "has been revoked."
        ),
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }

@router.post("/import/meghdoot")
def import_meghdoot(
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """
    Import one page from Meghdoot.
    """
    return import_from_meghdoot(
        db=db,
        limit=limit,
        offset=offset,
    )


@router.post("/import/meghdoot/all")
def import_all_meghdoot(
    db: Session = Depends(get_db),
):
    """
    Import complete Meghdoot history.
    """
    return import_all_from_meghdoot(db)


@router.post(
    "/observations/{observation_id}/verify"
)
def verify_observation_endpoint(
    observation_id: int,
    operator_id: str,
    remarks: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Mark an observation as verified by a manual operator.
    """
    return verify_observation(
        db=db,
        observation_id=observation_id,
        operator_id=operator_id,
        remarks=remarks,
    )


@router.post(
    "/observations/{observation_id}/unverify"
)
def unverify_observation_endpoint(
    observation_id: int,
    operator_id: str,
    remarks: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Mark an observation as unverified.
    """
    return unverify_observation(
        db=db,
        observation_id=observation_id,
        operator_id=operator_id,
        remarks=remarks,
    )

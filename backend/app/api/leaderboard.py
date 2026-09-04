from fastapi import (
    APIRouter,
    Depends,
    Query,
)

from sqlalchemy.orm import Session

from app.api.auth_dependencies import get_current_user
from app.db.database import get_db
from app.models.portal_user import PortalUser
from app.services.leaderboard_service import (
    get_leaderboard,
)


router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"],
)


@router.get("/")
def leaderboard(
    limit: int = Query(
        default=50,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
    current_user: PortalUser = Depends(
        get_current_user
    ),
):
    return get_leaderboard(
        db=db,
        limit=limit,
    )

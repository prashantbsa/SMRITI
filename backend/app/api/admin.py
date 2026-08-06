from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.services.meghdoot_import_service import (
    import_from_meghdoot,
    import_all_from_meghdoot,
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


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

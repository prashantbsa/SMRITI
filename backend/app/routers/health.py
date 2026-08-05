from fastapi import APIRouter
from sqlalchemy import text

from app.db.database import SessionLocal

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("/")
def health_check():
    """
    Simple API and database health check.
    """
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()

        return {
            "status": "healthy",
            "database": "connected",
            "application": "SMRITI",
            "version": "0.1.0",
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
        }

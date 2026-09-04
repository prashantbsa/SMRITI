from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.importers.mausam_importer import (
    import_mausam_reports
)


def import_from_mausam(
    db: Session,
    days: int = 1,
):
    """
    Import recent Mausam crowdsource data.
    """

    today = datetime.utcnow().date()

    from_date = (
        today - timedelta(days=days)
    ).isoformat()

    to_date = today.isoformat()

    return import_mausam_reports(
        db=db,
        from_date=from_date,
        to_date=to_date,
    )

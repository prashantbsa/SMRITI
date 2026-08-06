from sqlalchemy.orm import Session

from app.importers.meghdoot_importer import import_weather_events


def import_from_meghdoot(
    db: Session,
    limit: int = 100,
    offset: int = 0,
):
    """
    Existing import (used by scheduler/API)
    """

    return import_weather_events(
        db=db,
        limit=limit,
        offset=offset,
    )


def import_all_from_meghdoot(db: Session):

    offset = 0
    limit = 100

    total_imported = 0
    total_skipped = 0
    pages = 0

    while True:

        result = import_weather_events(
            db=db,
            limit=limit,
            offset=offset,
        )

        total_imported += result["imported"]
        total_skipped += result["skipped"]

        pages += 1

        print(
            f"Page {pages} | "
            f"Imported {result['imported']} | "
            f"Skipped {result['skipped']}"
        )

        #
        # If the page contained fewer than 'limit'
        # records we've reached the end.
        #
        if result["imported"] + result["skipped"] < limit:
            break

        offset += limit

    return {

        "pages": pages,

        "imported": total_imported,

        "skipped": total_skipped

    }

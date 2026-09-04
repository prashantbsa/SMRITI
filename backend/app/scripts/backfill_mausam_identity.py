from datetime import date, timedelta

from app.db.database import SessionLocal
from app.importers.mausam_importer import fetch_mausam_reports
from app.models.weather_observation import WeatherObservation


# --------------------------------------------------
# Configuration
# --------------------------------------------------

FROM_DATE = "2026-07-01"
TO_DATE = "2026-08-19"

PAGE_SIZE = 1


# --------------------------------------------------
# Helpers
# --------------------------------------------------

def build_reporter_identity(item):

    user = item.get("user") or {}

    reporter_name = (
        user.get("name") or ""
    ).strip()

    if not reporter_name:
        reporter_name = "Anonymous"

    reporter_mobile_raw = (
        user.get("mobile") or ""
    ).strip()

    reporter_mobile = None

    if reporter_mobile_raw:

        digits = "".join(
            ch
            for ch in reporter_mobile_raw
            if ch.isdigit()
        )

        if 10 <= len(digits) <= 15:
            reporter_mobile = digits

    return reporter_name, reporter_mobile

def update_observation(
    db,
    item,
):

    source_record_id = str(
        item.get("id")
    )

    observation = (
        db.query(WeatherObservation)
        .filter(
            WeatherObservation.source == "MAUSAM"
        )
        .filter(
            WeatherObservation.source_record_id
            == source_record_id
        )
        .first()
    )

    if not observation:
        return "not_found"

    reporter_name, reporter_mobile = (
        build_reporter_identity(item)
    )

    changed = False

    if (
        observation.reporter_name
        != reporter_name
    ):
        observation.reporter_name = (
            reporter_name
        )
        changed = True

    if (
        reporter_mobile
        and observation.reporter_mobile
        != reporter_mobile
    ):
        observation.reporter_mobile = (
            reporter_mobile
        )
        changed = True

    if changed:
        return "updated"

    return "complete"


# --------------------------------------------------
# Backfill
# --------------------------------------------------

def backfill_mausam_identity(
    db,
    from_date,
    to_date,
):

    page = 1

    updated = 0
    complete = 0
    not_found = 0
    processed = 0

    while True:

        print(
            f"Fetching Mausam: "
            f"{from_date} -> {to_date}, "
            f"page={page}"
        )

        response = fetch_mausam_reports(
            from_date=from_date,
            to_date=to_date,
            page=page,
        )

        if not response.get("status"):
            raise RuntimeError(
                response.get(
                    "message",
                    "Mausam API returned an error",
                )
            )

        items = response.get(
            "data",
            [],
        )

        if not items:
            break

        for item in items:

            result = update_observation(
                db,
                item,
            )

            processed += 1

            if result == "updated":
                updated += 1

            elif result == "complete":
                complete += 1

            elif result == "not_found":
                not_found += 1

        db.commit()

        print(
            f"Processed={processed} "
            f"updated={updated} "
            f"complete={complete} "
            f"not_found={not_found}"
        )

        total_pages = response.get(
            "total_pages"
        )

        if total_pages:
            if page >= int(total_pages):
                break
        else:
            if len(items) < PAGE_SIZE:
                break

        page += 1

    return {
        "processed": processed,
        "updated": updated,
        "complete": complete,
        "not_found": not_found,
    }


# --------------------------------------------------
# Main
# --------------------------------------------------

def main():

    db = SessionLocal()

    try:

        result = backfill_mausam_identity(
            db=db,
            from_date=FROM_DATE,
            to_date=TO_DATE,
        )

        print()
        print(
            "======================================"
        )
        print(
            "Mausam identity backfill complete"
        )
        print(
            "======================================"
        )

        print(
            f"Processed:        "
            f"{result['processed']}"
        )

        print(
            f"Updated:          "
            f"{result['updated']}"
        )

        print(
            f"Already complete: "
            f"{result['complete']}"
        )

        print(
            f"Not found:        "
            f"{result['not_found']}"
        )

    except Exception as exc:

        db.rollback()

        print(
            "Backfill failed:",
            exc,
        )

        raise

    finally:

        db.close()


if __name__ == "__main__":
    main()

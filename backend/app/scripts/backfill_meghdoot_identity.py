import sys

import requests

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import SessionLocal
from app.models.weather_observation import WeatherObservation


def fetch_meghdoot_events(limit=100, offset=0):

    url = (
        f"{settings.MEGHDOOT_BASE_URL}"
        f"/v1/admin/weather-events"
        f"?limit={limit}&offset={offset}"
    )

    headers = {
        "X-Key": settings.MEGHDOOT_API_KEY,
        "accept": "application/json",
    }

    response = requests.get(
        url,
        headers=headers,
        timeout=60,
    )

    response.raise_for_status()

    return response.json()


def update_observation_from_item(
    observation,
    item,
):
    first_name = (
        item.get("first_name") or ""
    ).strip()

    last_name = (
        item.get("last_name") or ""
    ).strip()

    reporter_name = " ".join(
        part
        for part in [first_name, last_name]
        if part
    ) or "Anonymous"

    reporter_mobile = (
        item.get("mobile_number") or ""
    ).strip() or None

    changed = False

    if observation.reporter_name != reporter_name:
        observation.reporter_name = reporter_name
        changed = True

    if (
        reporter_mobile
        and observation.reporter_mobile != reporter_mobile
    ):
        observation.reporter_mobile = reporter_mobile
        changed = True

    return changed


def backfill_meghdoot_identity(
    db: Session,
    page_size=100,
):
    offset = 0

    updated = 0
    not_found = 0
    already_complete = 0

    while True:

        print(
            f"Fetching Meghdoot records "
            f"offset={offset}..."
        )

        response = fetch_meghdoot_events(
            limit=page_size,
            offset=offset,
        )

        items = (
            response
            .get("data", {})
            .get("items", [])
        )

        if not items:
            break

        for item in items:

            source_record_id = item.get("id")

            if not source_record_id:
                continue

            observation = (
                db.query(WeatherObservation)
                .filter(
                    WeatherObservation.source
                    == "MEGHDOOT"
                )
                .filter(
                    WeatherObservation.source_record_id
                    == source_record_id
                )
                .first()
            )

            if not observation:
                not_found += 1
                continue

            changed = update_observation_from_item(
                observation,
                item,
            )

            if changed:
                updated += 1
            else:
                already_complete += 1

        db.commit()

        print(
            f"Processed {len(items)} records | "
            f"updated={updated} | "
            f"complete={already_complete} | "
            f"not_found={not_found}"
        )

        if len(items) < page_size:
            break

        offset += page_size

    return {
        "updated": updated,
        "already_complete": already_complete,
        "not_found": not_found,
    }


def main():

    db = SessionLocal()

    try:

        result = backfill_meghdoot_identity(
            db
        )

        print()
        print("======================================")
        print("Meghdoot identity backfill complete")
        print("======================================")
        print(
            f"Updated:          "
            f"{result['updated']}"
        )
        print(
            f"Already complete: "
            f"{result['already_complete']}"
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

        sys.exit(1)

    finally:

        db.close()


if __name__ == "__main__":
    main()

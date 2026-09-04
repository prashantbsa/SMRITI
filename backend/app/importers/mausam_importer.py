import requests
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.weather_observation import WeatherObservation
from app.services.geography_normalization_service import (
    normalize_state,
    normalize_district,
)

MAUSAM_URL = (
    "https://api.imd.gov.in/api/"
    "mausamapp_crowdsource_api.php"
)


def fetch_mausam_reports(
    from_date,
    to_date,
    page=1,
):
    url = (
        f"{MAUSAM_URL}"
        f"?from_date={from_date}"
        f"&to_date={to_date}"
        f"&page={page}"
    )

    print("Fetching Mausam:", url)

    response = requests.get(
        url,
        timeout=60,
    )

    response.raise_for_status()

    return response.json()


def import_mausam_reports(
    db: Session,
    from_date,
    to_date,
):
    page = 1
    total_pages = 1

    imported = 0
    skipped = 0
    imported_observations = []

    while page <= total_pages:

        response = fetch_mausam_reports(
            from_date=from_date,
            to_date=to_date,
            page=page,
        )

        if not response.get("status"):
            raise Exception(
                response.get(
                    "message",
                    "Mausam API returned an error"
                )
            )

        total_pages = response.get(
            "total_pages",
            1
        )

        items = response.get(
            "data",
            []
        )

        print(
            f"Mausam page {page}/{total_pages}: "
            f"{len(items)} records"
        )

        for item in items:

            source_record_id = str(
                item["id"]
            )

            existing = (
                db.query(WeatherObservation)
                .filter(
                    WeatherObservation.source == "MAUSAM",
                    WeatherObservation.source_record_id
                    == source_record_id,
                )
                .first()
            )

            if existing:

                skipped += 1
                continue


            # --------------------------------------------------
            # REPORTER IDENTITY
            # --------------------------------------------------

            user = item.get("user") or {}

            reporter_name = (
                user.get("name") or "Anonymous"
            ).strip()

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

                # Keep only values that look like a phone number.
                #
                # The Mausam API currently sometimes places
                # email addresses in the "mobile" field.
                #
                # Those must NOT be stored as reporter_mobile.
                if 10 <= len(digits) <= 15:

                    reporter_mobile = digits


            # --------------------------------------------------
            # WEATHER EVENTS
            # --------------------------------------------------

            weather_events = (
                item.get("weather_events")
                or []
            )

            event_names = []

            for event in weather_events:

                name = event.get("name")

                if name:

                    event_names.append(
                        str(name)
                        .strip()
                        .upper()
                        .replace(" ", "_")
                    )

            if not event_names:

                event_names = ["UNKNOWN"]


            # --------------------------------------------------
            # OBSERVATION TIME
            # --------------------------------------------------

            observation_time = None

            if item.get("created_at"):

                observation_time = (
                    datetime.strptime(
                        item["created_at"],
                        "%Y-%m-%d %H:%M:%S"
                    )
                )


            # --------------------------------------------------
            # CREATE OBSERVATION
            # --------------------------------------------------

            observation = WeatherObservation(

                source="MAUSAM",

                source_record_id=
                    source_record_id,

                reporter_id=
                    str(item.get("user_id", "")),

                reporter_name=
                    reporter_name,

                reporter_mobile=
                    reporter_mobile,

                latitude=
                    float(
                        item.get("latitude")
                        or 0
                    ),

                longitude=
                    float(
                        item.get("longitude")
                        or 0
                    ),

                state=
                    item.get("state"),

                district=
                    item.get("district"),

normalized_state=
    normalize_state(
        item.get("state")
    ),

normalized_district=
    normalize_district(
        item.get("district")
    ),

weather_code=None, 


               phenomenon=
                    ",".join(
                        event_names
                    ),

                severity=None,

                observation_time=
                    observation_time,

                language="UNKNOWN",

                remarks=
                    item.get(
                        "about_observation"
                    ),

                verification_status=
                    "UNVERIFIED",
            )

            db.add(observation)

            imported += 1

            imported_observations.append(
                observation
            )

        page += 1

    db.flush()

    imported_ids = [
        observation.id
        for observation in imported_observations
    ]

    db.commit()

    return {
        "imported": imported,
        "skipped": skipped,
        "pages": total_pages,
        "imported_ids": imported_ids,
    }

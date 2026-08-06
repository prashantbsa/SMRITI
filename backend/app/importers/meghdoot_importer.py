import requests
from datetime import datetime

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.weather_observation import WeatherObservation


def fetch_weather_events(limit=100, offset=0):

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


def import_weather_events(
    db: Session,
    limit=100,
    offset=0,
):

    response = fetch_weather_events(
        limit=limit,
        offset=offset,
    )

    items = response["data"]["items"]

    imported = 0
    skipped = 0

    for item in items:

        existing = (
            db.query(WeatherObservation)
            .filter(
                WeatherObservation.source_record_id == item["id"]
            )
            .first()
        )

        if existing:
            skipped += 1
            continue

        observation = WeatherObservation(

            source="MEGHDOOT",

            source_record_id=item["id"],

            reporter_id=item["user_id"],

            latitude=item["latitude"],

            longitude=item["longitude"],

            state=item["state_name"],

            district=item["district_name"],

            phenomenon=",".join(
                item["weather_phenomena_codes"]
            ),

            severity=None,

            observation_time=datetime.fromisoformat(
                item["captured_at"]
            ),

            language=item["language_code"],

            remarks=item.get("additional_info"),
        )

        db.add(observation)

        imported += 1

    db.commit()

    return {
        "imported": imported,
        "skipped": skipped,
    }

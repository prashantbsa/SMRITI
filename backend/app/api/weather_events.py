from collections import defaultdict
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.weather_event import WeatherEvent
from app.models.weather_observation import WeatherObservation
from app.models.weather_observation_event import (
    WeatherObservationEvent,
)
from app.services.weather_event_generation_service import (
    contributor_key,
)


router = APIRouter(
    prefix="/weather-events",
    tags=["Weather Events"],
)


@router.get("/")
def get_weather_events(
    limit: int = Query(
        default=5000,
        ge=1,
        le=10000,
    ),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Return weather events for forecaster visualization.

    Forecaster summary information is calculated using
    bounded aggregate queries for the returned events.
    """

    query = (
        db.query(
            WeatherEvent
        )
        .order_by(
            WeatherEvent.start_time.desc()
        )
    )

    if status:
        query = query.filter(
            WeatherEvent.status == status
        )

    events = (
        query
        .limit(limit)
        .all()
    )

    if not events:
        return {
            "count": 0,
            "events": [],
        }

    event_ids = [
        event.id
        for event in events
    ]

    # --------------------------------------------------
    # OBSERVATION SUMMARY
    #
    # One aggregate query for:
    #
    # observation count
    # first actual observation time
    # latest actual observation time
    # --------------------------------------------------

    summary_rows = (
        db.query(
            WeatherObservationEvent.weather_event_id,
            func.count(
                WeatherObservationEvent.observation_id
            ).label("observation_count"),
            func.min(
                WeatherObservation.observation_time
            ).label("first_observation_time"),
            func.max(
                WeatherObservation.observation_time
            ).label("latest_observation_time"),
        )
        .join(
            WeatherObservation,
            WeatherObservation.id
            == WeatherObservationEvent.observation_id,
        )
        .filter(
            WeatherObservationEvent.weather_event_id.in_(
                event_ids
            )
        )
        .group_by(
            WeatherObservationEvent.weather_event_id
        )
        .all()
    )

    summaries = {
        row.weather_event_id: {
            "observation_count":
                row.observation_count,
            "first_observation_time":
                row.first_observation_time,
            "latest_observation_time":
                row.latest_observation_time,
        }
        for row in summary_rows
    }

    # --------------------------------------------------
    # CONTRIBUTOR IDENTITIES
    #
    # Reuse the same contributor_key() logic used by
    # Weather Event generation and Evidence Strength.
    #
    # Only identity fields required by contributor_key()
    # are selected.
    # --------------------------------------------------

    contributor_rows = (
        db.query(
            WeatherObservationEvent.weather_event_id,
            WeatherObservation.id,
            WeatherObservation.reporter_mobile,
            WeatherObservation.reporter_id,
            WeatherObservation.source,
        )
        .join(
            WeatherObservation,
            WeatherObservation.id
            == WeatherObservationEvent.observation_id,
        )
        .filter(
            WeatherObservationEvent.weather_event_id.in_(
                event_ids
            )
        )
        .all()
    )

    contributor_sets = defaultdict(set)

    for row in contributor_rows:

        contributor_sets[
            row.weather_event_id
        ].add(
            contributor_key(
                row
            )
        )

    # --------------------------------------------------
    # RESPONSE
    # --------------------------------------------------

    results = []

    for event in events:

        summary = summaries.get(
            event.id,
            {},
        )

        results.append({
            "id": event.id,
            "uuid": str(event.uuid),
            "weather_type": event.weather_type,
            "description": event.description,
            "state": event.state,
            "district": event.district,
            "latitude": event.latitude,
            "longitude": event.longitude,
            "start_time": event.start_time,
            "end_time": event.end_time,
            "evidence_strength":
                event.evidence_strength,
            "status": event.status,

            "observation_count":
                summary.get(
                    "observation_count",
                    0,
                ),

            "contributor_count":
                len(
                    contributor_sets.get(
                        event.id,
                        set(),
                    )
                ),

            "first_observation_time":
                summary.get(
                    "first_observation_time"
                ),

            "latest_observation_time":
                summary.get(
                    "latest_observation_time"
                ),
        })

    return {
        "count": len(results),
        "events": results,
    }

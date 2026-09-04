from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.weather_event import WeatherEvent
from app.models.weather_observation_event import WeatherObservationEvent


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

    results = []

    for event in events:

        observation_count = (
            db.query(
                WeatherObservationEvent
            )
            .filter(
                WeatherObservationEvent.weather_event_id
                == event.id
            )
            .count()
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
            "evidence_strength": event.evidence_strength,
            "status": event.status,
            "observation_count": observation_count,
        })

    return {
        "count": len(results),
        "events": results,
    }

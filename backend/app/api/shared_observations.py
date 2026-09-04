from datetime import datetime
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    Query,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.shared_dependencies import (
    require_shared_api_key,
)
from app.db.database import get_db
from app.models.weather_observation import (
    WeatherObservation,
)


router = APIRouter(
    prefix="/shared",
    tags=["Shared Data"],
    dependencies=[
        Depends(require_shared_api_key),
    ],
)


@router.get("/observations")
def list_shared_observations(
    limit: int = Query(
        default=100,
        ge=1,
        le=1000,
    ),
    before_id: Optional[int] = Query(
        default=None,
        ge=1,
    ),
    source: Optional[str] = Query(
        default=None,
        max_length=50,
    ),
    state: Optional[str] = Query(
        default=None,
        max_length=100,
    ),
    district: Optional[str] = Query(
        default=None,
        max_length=100,
    ),
    from_time: Optional[datetime] = None,
    to_time: Optional[datetime] = None,
    db: Session = Depends(get_db),
):
    """
    Share raw SMRITI weather observations.

    Records come directly from the combined
    weather_observations table.

    Cursor pagination is based on the primary-key ID.
    """

    stmt = select(
        WeatherObservation.id,
        WeatherObservation.uuid,
        WeatherObservation.source,
        WeatherObservation.source_record_id,
        WeatherObservation.latitude,
        WeatherObservation.longitude,
        WeatherObservation.state,
        WeatherObservation.district,
        WeatherObservation.normalized_state,
        WeatherObservation.normalized_district,
        WeatherObservation.phenomenon,
        WeatherObservation.weather_code,
        WeatherObservation.severity,
        WeatherObservation.observation_time,
        WeatherObservation.language,
        WeatherObservation.remarks,
        WeatherObservation.verification_status,
        WeatherObservation.created_at,
    )

    if before_id is not None:
        stmt = stmt.where(
            WeatherObservation.id < before_id
        )

    if source:
        stmt = stmt.where(
            WeatherObservation.source == source.strip()
        )

    if state:
        stmt = stmt.where(
            WeatherObservation.normalized_state
            == state.strip()
        )

    if district:
        stmt = stmt.where(
            WeatherObservation.normalized_district
            == district.strip()
        )

    if from_time is not None:
        stmt = stmt.where(
            WeatherObservation.observation_time
            >= from_time
        )

    if to_time is not None:
        stmt = stmt.where(
            WeatherObservation.observation_time
            <= to_time
        )

    stmt = (
        stmt
        .order_by(
            WeatherObservation.id.desc()
        )
        .limit(limit + 1)
    )

    rows = db.execute(stmt).all()

    has_more = len(rows) > limit

    if has_more:
        rows = rows[:limit]

    observations = [
        {
            "id": row.id,
            "uuid": row.uuid,
            "source": row.source,
            "source_record_id":
                row.source_record_id,
            "latitude": row.latitude,
            "longitude": row.longitude,
            "state": row.state,
            "district": row.district,
            "normalized_state":
                row.normalized_state,
            "normalized_district":
                row.normalized_district,
            "phenomenon": row.phenomenon,
            "weather_code": row.weather_code,
            "severity": row.severity,
            "observation_time":
                row.observation_time,
            "language": row.language,
            "remarks": row.remarks,
            "verification_status":
                row.verification_status,
            "created_at": row.created_at,
        }
        for row in rows
    ]

    next_before_id = None

    if has_more and observations:
        next_before_id = observations[-1]["id"]

    return {
        "count": len(observations),
        "limit": limit,
        "has_more": has_more,
        "next_before_id": next_before_id,
        "observations": observations,
    }

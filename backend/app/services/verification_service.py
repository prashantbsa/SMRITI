from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.weather_observation import WeatherObservation


def verify_observation(
    db: Session,
    observation_id: int,
    operator_id: str,
    remarks: Optional[str] = None,
):
    observation = (
        db.query(WeatherObservation)
        .filter(
            WeatherObservation.id == observation_id
        )
        .first()
    )

    if not observation:
        raise HTTPException(
            status_code=404,
            detail="Observation not found",
        )

    observation.verification_status = "VERIFIED"
    observation.verified_by = operator_id
    observation.verified_at = datetime.now(timezone.utc)
    observation.verification_remarks = remarks

    db.commit()
    db.refresh(observation)

    return observation


def unverify_observation(
    db: Session,
    observation_id: int,
    operator_id: str,
    remarks: Optional[str] = None,
):
    observation = (
        db.query(WeatherObservation)
        .filter(
            WeatherObservation.id == observation_id
        )
        .first()
    )

    if not observation:
        raise HTTPException(
            status_code=404,
            detail="Observation not found",
        )

    observation.verification_status = "UNVERIFIED"
    observation.verified_by = operator_id
    observation.verified_at = datetime.now(timezone.utc)
    observation.verification_remarks = remarks

    db.commit()
    db.refresh(observation)

    return observation

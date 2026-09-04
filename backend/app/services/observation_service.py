from sqlalchemy.orm import Session

from app.models.weather_observation import WeatherObservation
from app.schemas.observation import ObservationCreate
from app.utils.india_admin_units import (
    normalize_indian_admin_unit,
)


def create_observation(
    db: Session,
    observation: ObservationCreate,
):
    obj = WeatherObservation(
        reporter_id=observation.reporter_id,
        latitude=observation.latitude,
        longitude=observation.longitude,
        phenomenon=observation.phenomenon,
        severity=observation.severity,
        observation_time=observation.observation_time,
        remarks=observation.remarks,
        language=observation.language,
        state=observation.state,
        district=observation.district,
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)

    return obj


def get_observations(db: Session):
    observations = (
        db.query(WeatherObservation)
        .order_by(WeatherObservation.id.desc())
        .all()
    )

    for observation in observations:

        observation.state = normalize_indian_admin_unit(
            observation.state
        )

    return observations

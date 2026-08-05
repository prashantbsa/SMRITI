from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.observation import (
    ObservationCreate,
    ObservationResponse,
)
from app.services.observation_service import (
    create_observation,
    get_observations,
)

router = APIRouter(
    prefix="/observations",
    tags=["Observations"],
)


@router.get(
    "/",
    response_model=List[ObservationResponse],
)
def list_observations(
    db: Session = Depends(get_db),
):
    return get_observations(db)


@router.post(
    "/",
    response_model=ObservationResponse,
)
def add_observation(
    observation: ObservationCreate,
    db: Session = Depends(get_db),
):
    return create_observation(
        db=db,
        observation=observation,
    )

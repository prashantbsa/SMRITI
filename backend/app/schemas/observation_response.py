from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ObservationResponse(BaseModel):
    id: int
    uuid: UUID

    reporter_id: str

    latitude: float
    longitude: float

    phenomenon: str
    severity: Optional[str]

    observation_time: datetime

    verification_status: str

    class Config:
        from_attributes = True

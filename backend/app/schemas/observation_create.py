from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ObservationCreate(BaseModel):
    reporter_id: str = Field(..., max_length=100)

    latitude: float
    longitude: float

    phenomenon: str
    severity: Optional[str] = None

    observation_time: datetime

    state: Optional[str] = None
    district: Optional[str] = None

    remarks: Optional[str] = None

    language: str = "en"

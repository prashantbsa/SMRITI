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

    remarks: Optional[str] = None

    language: str = "en"

    state: Optional[str] = None
    district: Optional[str] = None


class ObservationResponse(BaseModel):
    id: int

    reporter_id: str

    latitude: float
    longitude: float

    state: Optional[str]
    district: Optional[str]

    phenomenon: str

    severity: Optional[str]

    observation_time: datetime

    remarks: Optional[str]

    verification_status: str

    class Config:
        from_attributes = True

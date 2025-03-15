from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.sensor import SensorType, SensorStatus
from app.schemas.location import LocationCreate


class SensorBase(BaseModel):
    name: str
    status: SensorStatus
    type: SensorType


class SensorCreate(SensorBase):
    id: str
    facility_id: str
    location: LocationCreate
    installed_at: datetime


class SensorUpdate(BaseModel):
    name: Optional[str] = None


class Sensor(SensorBase):
    id: str
    facility_id: str
    location_id: int
    installed_at: datetime

    class Config:
        from_attributes = True

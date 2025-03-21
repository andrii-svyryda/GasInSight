from pydantic import BaseModel
from datetime import datetime
from app.models.sensor import SensorType, SensorStatus
from app.schemas.location import Location


class SensorBase(BaseModel):
    name: str
    status: SensorStatus
    type: SensorType
    expected_freq: str = "1H"


class SensorCreate(SensorBase):
    id: str
    facility_id: str
    location_id: int
    installed_at: datetime


class SensorUpdate(BaseModel):
    name: str | None = None
    status: SensorStatus | None = None
    expected_freq: str | None = None


class Sensor(SensorBase):
    id: str
    facility_id: str
    location_id: int
    installed_at: datetime
    location: Location | None = None

    class Config:
        from_attributes: bool = True

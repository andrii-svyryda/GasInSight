from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SensorRecordBase(BaseModel):
    data: Optional[str] = None


class SensorRecordCreate(SensorRecordBase):
    sensor_id: str
    tracked_at: datetime


class SensorRecord(SensorRecordBase):
    sensor_id: str
    tracked_at: datetime

    class Config:
        from_attributes: bool = True

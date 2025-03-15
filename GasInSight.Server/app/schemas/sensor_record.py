from pydantic import BaseModel
from datetime import datetime


class SensorRecordBase(BaseModel):
    data: str


class SensorRecordCreate(SensorRecordBase):
    sensor_id: str
    tracked_at: datetime


class SensorRecord(SensorRecordBase):
    sensor_id: str
    tracked_at: datetime

    class Config:
        from_attributes = True

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SensorRecordBase(BaseModel):
    data: Optional[str] = None


class SensorRecordCreate(SensorRecordBase):
    sensor_id: str
    tracked_at: datetime

class SensorAnalytics(BaseModel):
    mean: float | None = None
    min: float | None = None
    max: float | None = None


class SensorRecord(SensorRecordBase):
    sensor_id: str
    tracked_at: datetime

    class Config:
        from_attributes: bool = True


class SensorRecordsResponse(BaseModel):
    records: list[SensorRecord]
    analytics: SensorAnalytics


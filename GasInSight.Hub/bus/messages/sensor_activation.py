from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from constants.sensor_types import SensorTypes

class SensorActivationMsg(BaseModel):
    sensor_id: UUID
    facility_id: UUID
    address: str
    longitude: float
    latitude: float
    sensor_type: SensorTypes
    tracked_at: datetime = Field(default_factory=datetime.utcnow)

from pydantic import BaseModel
from datetime import datetime


class SensorDataMessage(BaseModel):
    sensor_id: str
    facility_id: str
    tracked_at: datetime
    data: str


class SensorActivationMessage(BaseModel):
    sensor_id: str
    facility_id: str
    address: str | None = None
    longitude: float
    latitude: float
    sensor_type: str
    tracked_at: datetime


class SensorDeactivationMessage(BaseModel):
    sensor_id: str
    facility_id: str
    tracked_at: datetime


class FacilitySetupMessage(BaseModel):
    facility_id: str
    facility_name: str
    address: str | None = None
    longitude: float
    latitude: float
    facility_type: str
    tracked_at: datetime

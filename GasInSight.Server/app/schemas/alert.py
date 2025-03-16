from pydantic import BaseModel
from datetime import datetime
from app.models.alert import AlertType
from app.schemas.sensor import Sensor
from app.schemas.facility import Facility


class AlertBase(BaseModel):
    sensor_id: str
    type: AlertType
    message: str


class AlertCreate(AlertBase):
    pass


class AlertUpdate(AlertBase):
    pass


class Alert(AlertBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AlertWithDetails(BaseModel):
    class Sensor(BaseModel):
        id: str
        name: str
        status: str
        type: str
        facility_id: str
        installed_at: datetime
        expected_freq: str

    class Facility(BaseModel):
        id: str
        name: str
        status: str
        type: str
        created_at: datetime

    id: int
    sensor_id: str
    type: AlertType
    message: str
    created_at: datetime
    sensor: Sensor 
    facility: Facility 

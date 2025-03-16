from pydantic import BaseModel
from datetime import datetime
from app.models.alert import AlertType


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

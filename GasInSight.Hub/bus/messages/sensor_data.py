from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field

class SensorDataMsg(BaseModel):
    sensor_id: UUID
    facility_id: UUID
    tracked_at: datetime = Field(default_factory=datetime.utcnow)
    data: str
